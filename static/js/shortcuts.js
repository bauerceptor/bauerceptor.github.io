/*
 * shortcuts.js — Vim/GitHub-style g-prefixed jump shortcuts.
 *   g h → home
 *   g r → research
 *   g p → projects
 *   g w → posts (writing)
 *   g n → notes
 *   g c → resume (CV)
 *   ?   → toast with the shortcut list
 *
 * Doesn't fire when typing in an input/textarea or with modifier keys held.
 */
(function () {
  'use strict';

  var routes = {
    h: '/',
    r: '/research/',
    p: '/projects/',
    w: '/posts/',
    n: '/notes/',
    c: '/resume/',
  };

  var primed = false;
  var primedTimer = null;

  function isTyping(el) {
    if (!el) return false;
    var tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
  }

  function showToast(msg) {
    var t = document.createElement('div');
    t.className = 'kb-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('kb-toast--in'); });
    setTimeout(function () {
      t.classList.remove('kb-toast--in');
      setTimeout(function () { t.remove(); }, 220);
    }, 1100);
  }

  function showHelp() {
    var lines = [
      'Keyboard shortcuts',
      'g h  Home',
      'g r  Research',
      'g p  Projects',
      'g w  Writing',
      'g n  Notes',
      'g c  Resume',
      '?    Show this',
    ];
    var t = document.createElement('div');
    t.className = 'kb-help';
    t.innerHTML = '<pre>' + lines.join('\n') + '</pre>';
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('kb-help--in'); });

    function close() {
      t.classList.remove('kb-help--in');
      setTimeout(function () { t.remove(); }, 220);
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('click', onClick, true);
    }
    function onKey(e) { if (e.key === 'Escape' || e.key === '?') { e.preventDefault(); close(); } }
    function onClick() { close(); }
    setTimeout(function () {
      document.addEventListener('keydown', onKey, true);
      document.addEventListener('click', onClick, true);
    }, 0);
  }

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (isTyping(e.target)) return;

    if (e.key === '?' && e.shiftKey) {
      e.preventDefault();
      showHelp();
      return;
    }

    if (!primed && e.key === 'g') {
      primed = true;
      clearTimeout(primedTimer);
      primedTimer = setTimeout(function () { primed = false; }, 1200);
      return;
    }

    if (primed) {
      primed = false;
      clearTimeout(primedTimer);
      var dest = routes[e.key.toLowerCase()];
      if (dest) {
        e.preventDefault();
        showToast('→ ' + dest);
        setTimeout(function () { window.location.href = dest; }, 140);
      }
    }
  });
})();
