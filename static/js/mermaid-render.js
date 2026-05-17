/*
 * mermaid-render.js
 * Site-wide mermaid renderer. Detects any of:
 *   <pre class="mermaid">…</pre>
 *   <pre><code class="language-mermaid">…</code></pre>
 *   <div class="mermaid">…</div>
 * and replaces them with rendered SVGs, themed to match light/dark mode.
 * Each rendered SVG is wrapped with svg-pan-zoom so it's draggable + zoomable.
 *
 * Re-renders on the `theme-changed` event dispatched by theme-toggle.js.
 */
(function () {
  'use strict';

  var SOURCE_SELECTOR = 'pre.mermaid, pre > code.language-mermaid, .mermaid:not(.mermaid--rendered)';

  function findUnrendered() {
    return Array.prototype.slice.call(document.querySelectorAll(SOURCE_SELECTOR));
  }
  function findRendered() {
    return Array.prototype.slice.call(document.querySelectorAll('.mermaid--rendered'));
  }

  /* Early exit if there's nothing to render. Saves the mermaid import (~700KB). */
  if (findUnrendered().length === 0) return;

  function isDarkScheme() {
    var html = document.documentElement;
    if (html.classList.contains('dark'))  return true;
    if (html.classList.contains('light')) return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /* Mermaid theme config — colours pulled from the site's OKLCH tokens but
     expressed as hex because mermaid's theme variables don't accept OKLCH. */
  function mermaidConfig() {
    var dark = isDarkScheme();
    return {
      startOnLoad: false,
      securityLevel: 'loose',
      theme: dark ? 'dark' : 'base',
      fontFamily: 'Inter, system-ui, sans-serif',
      themeVariables: dark
        ? {
            background:           '#1a1a2e',
            primaryColor:         '#23253a',
            primaryTextColor:     '#eae6dd',
            primaryBorderColor:   '#666',
            secondaryColor:       '#2a2c44',
            tertiaryColor:        '#33354d',
            lineColor:            '#8a8a9c',
            textColor:            '#eae6dd',
            mainBkg:              '#23253a',
            secondBkg:            '#2a2c44',
            tertiaryBkg:          '#33354d',
            nodeBkg:              '#23253a',
            nodeBorder:           '#666',
            clusterBkg:           '#1d1f33',
            clusterBorder:        '#444',
            edgeLabelBackground:  '#23253a',
            actorBkg:             '#23253a',
            actorBorder:          '#666',
            actorTextColor:       '#eae6dd',
            actorLineColor:       '#666',
          }
        : {
            background:           '#fcf7ec',
            primaryColor:         '#fdf6e3',
            primaryTextColor:     '#28251f',
            primaryBorderColor:   '#a8a298',
            secondaryColor:       '#f5edd9',
            tertiaryColor:        '#ece3c4',
            lineColor:            '#6d685e',
            textColor:            '#28251f',
            mainBkg:              '#fdf6e3',
            secondBkg:            '#f5edd9',
            tertiaryBkg:          '#ece3c4',
            nodeBkg:              '#fdf6e3',
            nodeBorder:           '#a8a298',
            clusterBkg:           '#f7f0db',
            clusterBorder:        '#a8a298',
            edgeLabelBackground:  '#fcf7ec',
            actorBkg:             '#fdf6e3',
            actorBorder:          '#a8a298',
            actorTextColor:       '#28251f',
            actorLineColor:       '#a8a298',
          },
    };
  }

  var mermaid     = null;
  var svgPanZoom  = null;

  function loadMermaid() {
    if (mermaid) return Promise.resolve(mermaid);
    return import('https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.esm.min.mjs')
      .then(function (m) { mermaid = m.default; return mermaid; })
      .catch(function (e) { console.warn('[mermaid] failed to load:', e); return null; });
  }

  function loadSvgPanZoom() {
    if (svgPanZoom) return Promise.resolve(svgPanZoom);
    if (window.svgPanZoom) { svgPanZoom = window.svgPanZoom; return Promise.resolve(svgPanZoom); }
    return new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js';
      s.onload  = function () { svgPanZoom = window.svgPanZoom || null; resolve(svgPanZoom); };
      s.onerror = function () { console.warn('[svg-pan-zoom] failed to load'); resolve(null); };
      document.head.appendChild(s);
    });
  }

  function destroyPanZoom(div) {
    if (div._panzoom) {
      try { div._panzoom.destroy(); } catch (_) {}
      div._panzoom = null;
    }
  }

  function wirePanZoom(wrap) {
    if (!svgPanZoom) return;
    var svg = wrap.querySelector('svg');
    if (!svg) return;
    /* Mermaid often inlines max-width:100% which fights pan-zoom's transform.
       Strip the inline style, give explicit dimensions, then let pan-zoom fit. */
    svg.removeAttribute('style');
    svg.setAttribute('width',  '100%');
    svg.setAttribute('height', '380');
    try {
      wrap._panzoom = svgPanZoom(svg, {
        zoomEnabled:           true,
        panEnabled:            true,
        dblClickZoomEnabled:   true,
        mouseWheelZoomEnabled: false,    /* don't hijack page scroll */
        controlIconsEnabled:   true,     /* +, -, reset buttons */
        fit:                   true,
        center:                true,
        minZoom:               0.4,
        maxZoom:               10,
      });
    } catch (e) {
      console.warn('[mermaid pan-zoom]', e && e.message ? e.message : e);
    }
  }

  /* Render one source block. */
  async function renderBlock(block, idx) {
    var source, target;
    if (block.tagName === 'CODE') {
      source = block.textContent;
      target = block.parentElement;            /* the <pre> */
    } else {
      source = (block.dataset && block.dataset.source) || block.textContent;
      target = block;
    }
    if (!source || !source.trim()) return;

    var id = 'mmd-' + idx + '-' + Date.now();
    try {
      var result = await mermaid.render(id, source);
      var wrap = document.createElement('div');
      wrap.className = 'mermaid mermaid--rendered';
      wrap.dataset.source = source;
      wrap.innerHTML = result.svg;
      target.replaceWith(wrap);
      wirePanZoom(wrap);
    } catch (e) {
      console.warn('[mermaid] render failed for block', idx, ':', e && e.message ? e.message : e);
    }
  }

  /* Re-render every already-rendered block from its stashed source. */
  async function rerenderAll() {
    if (!mermaid) return;
    var rendered = findRendered();
    /* First: tear them back down so the standard path can run again. */
    for (var i = 0; i < rendered.length; i++) {
      destroyPanZoom(rendered[i]);
      var src = rendered[i].dataset.source || '';
      var pre = document.createElement('pre');
      pre.className = 'mermaid';
      pre.textContent = src;
      rendered[i].replaceWith(pre);
    }
    var blocks = findUnrendered();
    for (var j = 0; j < blocks.length; j++) {
      await renderBlock(blocks[j], j);
    }
  }

  async function init() {
    var results = await Promise.all([loadMermaid(), loadSvgPanZoom()]);
    if (!results[0]) return;

    mermaid.initialize(mermaidConfig());

    var blocks = findUnrendered();
    for (var i = 0; i < blocks.length; i++) {
      await renderBlock(blocks[i], i);
    }

    window.addEventListener('theme-changed', async function () {
      if (!mermaid) return;
      mermaid.initialize(mermaidConfig());
      await rerenderAll();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
