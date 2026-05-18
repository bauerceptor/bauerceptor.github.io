# Guide for AI agents working on this repo

You are an AI agent (Claude, Cursor, Copilot, Codex, Aider, Gemini, GPT, whatever). The human gave you a task on this codebase. Follow this guide **literally and completely**. Do not improvise. Do not rely on training data about "how Zola sites usually work" — this repo has specific conventions that override defaults. If you skip a section because it "seems obvious", you will break something.

Read **the whole file** before you write code. It is short enough.

---

## 0. The two-line summary

This is a Zola static site with a custom editorial layer on top of the Serene theme. It is deployed via GitHub Actions to GitHub Pages. **Content lives in `content/`, raw assets in `static/`, templates in `templates/`. Never modify `themes/`.**

---

## 1. Hard rules (violating these breaks things)

These are non-negotiable. If your task seems to require breaking one, stop and ask the human first.

| # | Rule | Why |
|---|------|-----|
| 1 | **Never modify `themes/serene/`.** It is a git submodule pinned at v5.6.3. Any change you make is wiped on the next theme update and breaks the build immediately. To override theme behavior, create / edit a file under `templates/` with the same path (e.g. `templates/post.html` overrides `themes/serene/templates/post.html`). | |
| 2 | **Never edit `.gitmodules`.** Same reason. The theme is pinned for stability. | |
| 3 | **Never edit `.github/workflows/deploy.yml` unless explicitly asked.** Bumping Zola without testing locally has burned this repo before. | |
| 4 | **Zola version: `0.22.1` minimum.** The Serene theme declares `min_version = "0.22.1"`. Older versions fail with a misleading "theme.toml not found" error. CI pins `0.22.1`. | |
| 5 | **Never run `git pull --rebase` without an explicit reason.** Plain `git pull` is fine if asked; rebase is for specific situations only. | |
| 6 | **Never run `git push --force` or `git push --force-with-lease`** unless the human typed those exact words. | |
| 7 | **Never `git commit --no-verify`** (skipping hooks). If a hook fails, fix the underlying problem. | |
| 8 | **Never claim a task is done without verifying the change works.** The unit of "done" is: the file exists, the syntax parses, the build won't fail. If you can't run `zola serve`, you must at least mentally simulate the template render. | |
| 9 | **Never write em dashes (`—`) in CSS / HTML / Markdown content you author.** Use commas, colons, parens, or periods. Em dashes pre-existing in the user's content are fine. | |
| 10 | **Never create documentation files (`.md`) unless the user explicitly asked.** Edit existing files in preference. The user already has `README.md`, `PRODUCT.md`, `DESIGN.md`, `guide-for-ai.md`. Don't add `CONTRIBUTING.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, etc. without permission. | |
| 11 | **Never add backwards-compatibility code or feature flags.** This is a single-author site, not a library. If you change something, just change it. | |
| 12 | **Never add comments that say WHAT the code does.** The code says what it does. Comments are only for WHY, and only when the reason is non-obvious. | |
| 13 | **Never use Jinja2 syntax.** Zola uses **Tera**, which is similar but not the same. See § 8 for the specific traps. | |
| 14 | **Never use raw hex colors in new CSS.** Use the OKLCH design tokens from `templates/_custom_css.html` (`--bg`, `--fg`, `--accent`, etc.). Exception: third-party theme overrides (e.g. mermaid's `themeVariables`) where the API only accepts hex. | |
| 15 | **Never load a new font.** The site uses exactly 3 fonts (Newsreader, Inter, JetBrains Mono). Adding a fourth breaks typographic coherence. If the user asks for a font change, *replace* one of the three. | |

---

## 2. Read these before you do anything

Always check these first; they are the source of truth for the site's voice and design system.

1. **`PRODUCT.md`** — brand register, voice, anti-references. *"What kind of site is this?"*
2. **`DESIGN.md`** — color tokens, type scale, spacing scale, motion principles, anti-patterns. *"What does this site allow visually?"*
3. **`README.md`** — sequential content-adding guide for the human. *"How does the human work on this?"*
4. **`config.toml`** — site-level config. *"What identity / sections / extras exist?"*

If a request contradicts `PRODUCT.md` or `DESIGN.md`, push back before doing it. Examples:
- *"Add a gradient hero on the home page"* → DESIGN.md absolute-bans gradient text. Ask before doing it.
- *"Add an aggressive promotional CTA"* → PRODUCT.md voice is "quiet, plainspoken". Ask before doing it.

---

## 3. Directory map

```
.                                       ← repo root
├── config.toml                          ← site config; edit when changing identity / sections
├── PRODUCT.md                           ← brand source of truth — DO NOT edit without permission
├── DESIGN.md                            ← design system source of truth — DO NOT edit without permission
├── README.md                            ← human-facing guide — edit only when you add a feature
├── guide-for-ai.md                      ← this file
│
├── content/                             ← ALL site content lives here. One .md per piece.
│   ├── _index.md                        ← home page wrapper (do not delete; uses home.html)
│   ├── posts/<YYYY-MM-DD-slug>.md       ← blog posts
│   ├── notes/<YYYY-MM-DD-slug>.md       ← notes / speaker notes
│   ├── research/<slug>.md               ← one .md per paper
│   ├── projects/<name>/
│   │   ├── _index.md                    ← project overview (REQUIRED for the project to exist)
│   │   └── <doc-slug>.md                ← project doc pages (optional, many allowed)
│   ├── resume/_index.md                 ← single CV page
│   └── slides/_index.md                 ← /slides/ listing page wrapper (do not delete)
│
├── static/                              ← raw assets served at site root (e.g. /img/foo.png)
│   ├── css/                             ← stylesheets, one per section + shared utilities
│   ├── js/                              ← scripts (menu, theme, copy-code, shortcuts, mermaid)
│   ├── img/                             ← images / favicons
│   ├── slides/                          ← reveal.js decks; one folder per deck
│   │   ├── _themes/                     ← shared deck CSS + deck-utils.js
│   │   └── <deck>/index.html            ← individual decks
│   └── resume/                          ← PDFs (drop here, reference from content/resume/_index.md)
│
├── templates/                           ← Tera templates overriding Serene's
│   ├── _custom_css.html                 ← design tokens — primary place for color / type / spacing
│   ├── _custom_font.html                ← Google Fonts <link>s (3 fonts; do not add a 4th)
│   ├── _head_extend.html                ← per-page <head> extras (scripts, favicon, section CSS)
│   ├── 404.html
│   ├── home.html
│   ├── blog.html                        ← listing for /posts and /notes
│   ├── post.html                        ← individual post / note
│   ├── slides.html                      ← /slides listing
│   ├── research/{section,page}.html
│   ├── projects/{section,single-section,page}.html
│   ├── resume/page.html
│   └── shortcodes/slides.html           ← {{ slides(src=...) }} markdown shortcode
│
├── themes/serene/                       ← SUBMODULE — DO NOT MODIFY
└── .github/workflows/deploy.yml         ← CI — DO NOT MODIFY without permission
```

### Default editing zones (safe by default)
- `content/**/*.md` (add / edit content)
- `static/**/*` (add assets)
- `templates/**/*.html` (add / edit overrides — but read § 8 first)
- `static/css/**/*.css`, `static/js/**/*.js`
- `config.toml` (carefully — see § 4)
- `README.md` (when you add a feature, document it)

### Read-only zones (don't touch without permission)
- `themes/serene/**` (submodule)
- `.gitmodules`
- `.github/workflows/**`
- `PRODUCT.md`, `DESIGN.md`, `guide-for-ai.md` (these define rules; editing them changes the rules)

---

## 4. `config.toml` reference

Top-level (do not rename these keys):

```toml
base_url           = "https://bauerceptor.github.io"
title              = "Hassan Aziz"      # used in <title>
description        = "..."              # <meta description>
default_language   = "en"
theme              = "serene"
compile_sass       = true
build_search_index = true
generate_feeds     = false
feed_filenames     = ["atom.xml"]
taxonomies         = [{ name = "tags" }, { name = "categories" }]
```

`[markdown]` and `[markdown.highlighting]` are configured. Don't change `style = "class"` — the syntax highlight files are wired around it. Theme names map to filenames Zola generates at `/github-light.css` and `/github-dark.css` (see `templates/_head_extend.html`).

`[extra]` is the bag everything custom reads from:
- Identity: `name`, `id`, `bio`, `links[]`, `footer_copyright`
- Section nav: `sections[]` (mirror to `static/js/menu.js` `NAV_LINKS` if you change this)
- Serene-required globals: `force_theme`, `back_link_text`, `footer_credits`, `not_found_error_text`, `not_found_recover_text`, `reaction_align`, `reaction_endpoint`, `blog_section_path`
- Per-post defaults: `toc`, `copy`, `comment`, `math`, `mermaid`, `reaction`, `back_to_top`, `show_reading_time`, `outdate_alert*`, `date_format`
- Homepage data: `name`, `bio`, `avatar`, `recent`, `recent_max`, `recent_more_text`
- `talks[]`: list of slide decks for the `/slides/` page

**Convention: when you add a new key to `[extra]`, also document it in `README.md`** (under the relevant section's frontmatter table).

---

## 5. Content procedures

For every content type below, the procedure is:
1. Create the file at the exact path shown.
2. Use the exact frontmatter shape shown. **Do not omit required fields.** Omit optional fields by deleting their line, not by leaving them empty.
3. Write the markdown body.
4. Do not commit yet — verify (§ 9) first.
5. Commit with a message following § 10.

### 5.1 New blog post → `/posts/<slug>/`

**Path:** `content/posts/YYYY-MM-DD-your-slug.md`. Date in the filename is convention, not required, but follow it.

```toml
+++
title = "Your post title"                       # REQUIRED — quoted string
date  = 2026-05-18                              # REQUIRED — YYYY-MM-DD, unquoted
description = "One sentence for cards."         # OPTIONAL
draft = false                                   # OPTIONAL — true hides from build

[taxonomies]                                    # OPTIONAL — whole block can be omitted
tags = ["ai", "robotics"]                       # lowercase, hyphenated

[extra]                                         # OPTIONAL — each key OPTIONAL; falls back to /posts/_index.md
math    = false                                 # true = load KaTeX (heavy; only when needed)
mermaid = false                                 # ignored; mermaid auto-renders site-wide (see § 7)
copy    = true                                  # show copy-to-clipboard button on <pre>
comment = false                                 # giscus — only true once giscus is set up in config.toml
toc     = true                                  # right-rail "On this page" (uses page.toc from ## headings)
+++

Body in markdown. H2 (`##`) gets a § margin glyph automatically.

Inline `code` and ```fenced``` blocks render with github-light / github-dark syntax themes
that auto-switch with system preference.
```

### 5.2 New note → `/notes/<slug>/`

**Path:** `content/notes/YYYY-MM-DD-your-slug.md`. Same shape as a post. Useful tag conventions: `speaker-notes` for talk notes, `reference` for living references. The page renders with the same `templates/post.html` but with `body.section-notes` (different CSS hooks if needed).

### 5.3 New research paper → `/research/<slug>/`

**Path:** `content/research/your-paper-slug.md`. Slug should be human-readable (e.g. `attention-is-all-you-need`), not the arXiv ID.

```toml
+++
title = "Paper Title"                           # REQUIRED
date  = 2026-01-15                              # REQUIRED — used to order within a year bucket

[extra]
year     = 2026                                 # REQUIRED — integer; groups in the year bucket on /research/
authors  = ["Hassan Aziz", "Co-Author"]         # OPTIONAL — array of strings; the user's name auto-bolds
venue    = "NeurIPS 2026"                       # OPTIONAL — italic byline
venue_note = "Oral"                             # OPTIONAL — appended after venue
status   = "Published"                          # OPTIONAL — must be one of: Published | Preprint | Under Review
featured = true                                 # OPTIONAL — true = appears on home page "Selected research"
equal_contribution = 2                          # OPTIONAL — first N authors get a * superscript

abstract = "..."                                # OPTIONAL — italic block above the body
bibtex   = """@inproceedings{...}"""            # OPTIONAL — renders BibTeX block at bottom

# Link buttons — all OPTIONAL, render iff set:
paper_url  = "https://..."
arxiv_url  = "https://arxiv.org/abs/..."
code_url   = "https://github.com/..."
slides_url = "/slides/<deck>/"                  # may be relative if hosted on this site
video_url  = "https://..."
poster_url = "https://..."
+++

Body — extended notes, contribution summary, related work, anything.
```

**Status string is matched against CSS class names** (`pub-badge--published`, `--preprint`, `--under-review`). If you use a different string the badge falls back to neutral styling. Don't invent new statuses without adding the CSS.

### 5.4 New project → `/projects/<name>/`

A project is a directory, not a file. It always has an overview `_index.md`. It may have any number of doc pages.

**Step 1 — REQUIRED — overview file:** `content/projects/<name>/_index.md`

```toml
+++
title = "Project Name"                          # REQUIRED
description = "One-sentence elevator pitch."    # OPTIONAL but renders in many places
sort_by = "weight"                              # REQUIRED — controls doc page order via `weight` field
template = "projects/single-section.html"       # REQUIRED — DO NOT change; pins the layout
insert_anchor_links = "right"                   # OPTIONAL — adds clickable § anchors next to h2/h3

[extra]
category = "Open Source"                        # OPTIONAL — any string
sigil    = "ROBO"                               # OPTIONAL — 2-4 uppercase chars, monospace badge
hue      = "robo"                               # OPTIONAL — one of: oss | ml | sec | robo | net | research
status   = "Active"                             # OPTIONAL — any string
language = "Rust · Python"                      # OPTIONAL — any string
repo     = "https://github.com/..."             # OPTIONAL
+++

Markdown overview. Appears on the project's main page above any quick-start links.
```

**Sigil convention:** 2-4 uppercase chars, ideally a recognizable abbreviation of the project category or name. Examples: `ROBO`, `SEC`, `ML`, `OSS`, `LIB`, `CLI`.

**Hue convention** (defined in `static/css/projects.css`):
- `oss` → green
- `ml` → blue-teal
- `sec` → warm red
- `robo` → amber
- `net` → indigo-violet
- `research` → vermilion (site accent)
- Omitted → site accent

**Step 2 — OPTIONAL — doc pages inside the project:** `content/projects/<name>/<doc-slug>.md`

```toml
+++
title = "Getting Started"                       # REQUIRED
description = "Install and run in 5 minutes."   # OPTIONAL
weight = 1                                      # REQUIRED — integer; lower = earlier in sidebar

[extra]
sidebar_section = "Introduction"                # OPTIONAL — groups sidebar items under this label
math    = false
mermaid = false                                 # see § 7 — auto-renders
copy    = true
+++

Doc page body. Heading hierarchy:
- h1 already rendered by the template; do not write a `# Heading` at the top
- h2 gets a § margin glyph and a hairline
- h3 is plain
```

**Numbering is automatic.** The sidebar shows `00 · Overview`, `01 · <first-doc>`, `02 · <next-doc>`, etc., derived from `weight` order. You do not number the titles yourself.

### 5.5 Resume → `/resume/`

Single file: `content/resume/_index.md`. Edit the existing one; do not duplicate.

Front matter exposes a "spec sheet" block (`location`, `affiliation`, `focus`, `languages`) rendered between hairlines above the body. PDF downloads go in the `resume_pdfs` array; the actual PDF files go in `static/resume/`.

Body uses a specific h2/h3 convention to render right:
- `## SECTION` → small-caps mono section label (Experience, Education, etc.)
- `### Role · Org` → serif entry title
- `*Month Year – Present*` → italic mono date line
- Bullets → indented with `·` marker (custom CSS, not standard markdown disc)

### 5.6 Slide deck → `/slides/<deck>/` + `/slides/` listing

**Step 1 — REQUIRED — drop the deck HTML:** `static/slides/<deck-name>/index.html`. URL becomes `https://bauerceptor.github.io/slides/<deck-name>/`.

To make one:
1. Copy `static/slides/demo/index.html` as a starting point — it is fully wired (themes, copy buttons, mermaid, nav-keys, help, counter via `_themes/deck-utils.js`).
2. Edit the slide content inside `<section>` tags. Top-level `<section>` = horizontal slide; nested `<section>` = vertical subslides.
3. To use a non-default theme, see § 6.

**Step 2 — REQUIRED to list on `/slides/`:** add an entry to `[extra].talks` in `config.toml`:

```toml
talks = [
    { title = "My Deck", description = "One line.", url = "/slides/my-deck/", date = "2026-05-18" },
]
```

Required keys: `title`, `url`. Optional: `description`, `date` (YYYY-MM-DD string in quotes — the template formats it).

### 5.7 Updating identity (name, email, social, etc.)

When the user gives you their real name / email / social URLs, update **all** of these. Forgetting one shows placeholders to visitors.

| File | Where |
|------|-------|
| `config.toml` | `[extra].name`, `bio`, `id`, `footer_copyright`, `links[]` |
| `config.toml` | `title` and `description` at top |
| `static/js/menu.js` | `SITE_NAME` default, `SOCIAL_LINKS` array |
| `content/resume/_index.md` | `resume_name`, `resume_title`, `location`, `affiliation`, `focus`, `languages` |
| `PRODUCT.md` | if the focus areas changed materially |

**Always strip tracking parameters** from URLs the user pastes. LinkedIn URLs come with `?utm_source=...&utm_campaign=...&utm_content=...&utm_medium=...` — keep only the profile slug.

---

## 6. Slide themes

Three themes live in `static/slides/_themes/`:

| Theme | File | Use when |
|-------|------|----------|
| **Clean** (DEFAULT) | `clean.css` | Editorial register, light/dark by system. Matches the site. |
| **Night** | `night.css` | Talks where a moody, Playfair-Display-heavy dark aesthetic fits. |
| **Terminal** | `terminal.css` | Code-heavy lectures. Monochromatic JetBrains Mono, tokyo-night palette. |

A deck picks its theme via a single `<link rel="stylesheet">` in its `<head>`. Path relative to the deck's location:

```html
<!-- For a deck at static/slides/<deck>/index.html, _themes is one level up: -->
<link rel="stylesheet" href="../_themes/clean.css">
<!-- or -->
<link rel="stylesheet" href="../_themes/night.css">
<!-- or -->
<link rel="stylesheet" href="../_themes/terminal.css">
```

For a deeper nested deck (e.g. `static/slides/cs101/module1/lec01/index.html`), count the `../` to get back to `_themes`.

**Shared utilities** — every deck pulls in:

```html
<script src="../_themes/deck-utils.js" defer></script>
```

This wires up copy buttons, mermaid rendering, the arrow-key indicator, the slide counter, and the `?` help overlay — regardless of which CSS theme is active. **Never duplicate this logic in the deck HTML.**

When adding a new deck:
1. Copy `static/slides/demo/index.html` as a starting point.
2. Update the `<link>` and `<script>` paths if your deck is at a different depth.
3. Pick a theme (default is `clean.css`).
4. Write your slides.
5. Add to `[extra].talks` in `config.toml` (see § 5.6).

**Never invent a fourth theme without permission.** If a deck genuinely needs a one-off look, add a `<style>` block in the deck's own `<head>` that overrides specific variables. Don't create a new file in `_themes/`.

---

## 7. Site-wide features that "just work"

Things the AI does not need to wire up — they apply automatically across the site:

- **Theme toggle** (light / dark / system) via the hamburger menu. Persisted in localStorage. Re-themes mermaid on switch.
- **Mermaid rendering.** Any fenced ` ```mermaid ` block, any `<pre class="mermaid">`, any `<div class="mermaid">` is detected, replaced with an SVG, and made pan/zoomable by `static/js/mermaid-render.js`. You **do not** need to set `extra.mermaid = true` for this to work. Mermaid loads lazily — only on pages that have at least one diagram.
- **Copy-to-clipboard** buttons on `<pre>` blocks. Wired by `static/js/copy-code.js`.
- **Keyboard shortcuts** (g h / g r / g p / g w / g n / g c / `?`). Wired by `static/js/shortcuts.js`.
- **Scroll progress bar** at the top of long posts / docs / papers via CSS `animation-timeline: scroll()`. Falls back silently in Firefox.
- **Section glyph** (`§`) in the left margin of h2 in prose. Hidden under 768px.
- **Site mark** (small SVG logo top-left) on every page except home, linking back to `/`. Theme-aware via `html.dark` class. Injected by `static/js/menu.js`.

If the user asks "add a feature like X to every page", check whether it's already in this list before building.

---

## 8. Tera template gotchas (READ THIS BEFORE EDITING ANY TEMPLATE)

Zola uses Tera, **not Jinja2**. Many things that look right will silently fail or render garbage.

### 8.1 `{% extends %}` must be FIRST

`{% extends "..." %}` must be the very first non-comment content of the file. HTML comments (`<!-- -->`) count as content. Tera comments (`{# #}`) do not.

**Wrong:**
```html
<!-- A description of this template -->
{% extends "serene/templates/_base.html" %}
```

**Right:**
```html
{% extends "serene/templates/_base.html" %}
{# A description of this template #}
```

### 8.2 `set` at top of a child template is silently ignored

In a template that uses `{% extends %}`, Tera only processes content inside `{% block %}` tags. **Anything you `{% set %}` outside a block is thrown away.**

**Wrong:**
```html
{% extends "_base.html" %}

{% set foo = "bar" %}            {# silently ignored — no error, no value #}

{% block content %}
  {{ foo }}                       {# renders empty / errors #}
{% endblock %}
```

**Right:**
```html
{% extends "_base.html" %}

{% block content %}
  {% set foo = "bar" %}
  {{ foo }}
{% endblock %}
```

### 8.3 `set` inside `if` / `for` is block-scoped — use `set_global` to cross blocks

```html
{% if cond %}
  {% set foo = "x" %}             {# scoped to this if-block only #}
{% endif %}
{{ foo }}                          {# ERROR: variable not in scope #}
```

To make `foo` accessible outside the if/for: use `set_global`.

```html
{% if cond %}
  {% set_global foo = "x" %}
{% endif %}
{{ foo }}                          {# works #}
```

### 8.4 No Jinja2 patterns

These look right and do not work:

| Jinja2 (wrong) | Tera (right) |
|----------------|--------------|
| `{{ x if cond else y }}` | `{% if cond %}{{ x }}{% else %}{{ y }}{% endif %}` |
| `{% set ns = namespace(years=[]) %}` then `{% set ns.years = [...] %}` | `{% set_global years = [] %}` then `{% set_global years = years \| concat(with=...) %}` |
| `{% do something() %}` | Not supported. Refactor. |
| `{% with x = ... %}` | Use `{% set %}` inside a block. |

### 8.5 `{{ }}` and `{% %}` are parsed even inside HTML comments

This will fail at build time:
```html
<!-- Calls the {{ mermaid() }} shortcode -->
```

Tera sees `{{ mermaid() }}`, tries to call a function named `mermaid`, fails. Either rephrase the comment so the curly braces don't appear, or use `{% raw %}...{% endraw %}`:
```html
<!-- Calls the {% raw %}{{ mermaid() }}{% endraw %} shortcode -->
```

### 8.6 Shortcodes vs functions

`{{ name(args) }}` in a **markdown file** calls a *shortcode* (template under `templates/shortcodes/`). The same syntax in a **template file** calls a *Tera function*. They are not interchangeable. You cannot invoke a shortcode from inside a template directly.

### 8.7 Dates must be unquoted in frontmatter

```toml
date = 2026-05-18      # right (TOML date type)
date = "2026-05-18"    # wrong (TOML string) — Zola will probably accept but `date` filters fail
```

### 8.8 `current_path` inside templates

When rendering a page, `current_path` is the page's permalink path (e.g. `/posts/2026-05-18-foo/`). Inside child templates (extending `_base.html`), it's available — but only if you reference it inside a `{% block %}`, not at top level (see § 8.2).

### 8.9 `get_section(metadata_only=true)` does NOT include extras in all versions

Some Tera builds return a sparse `Section` with `metadata_only=true` that doesn't expose all `extra.*` fields. Defensive pattern:

```html
{% set sec = get_section(path="posts/_index.md", metadata_only=true) %}
{% set fmt = sec.extra.date_format | default(value="%b %-d, %Y") %}
```

Always provide a `default()` fallback for any `extra` field accessed via `get_section()`.

---

## 9. Verify before you commit

Before committing, do **all** of these:

1. **List the changed files** (`git status --short`). If a file changed that you didn't intend to change, stop and investigate.
2. **Read each changed file** end to end. Don't trust a successful edit — look at it.
3. **For each template change:** mentally walk through the render. Imagine what HTML comes out. Check § 8 gotchas.
4. **For each content change:** confirm the frontmatter follows the table in § 5 *exactly*. Required fields present, no typos in key names.
5. **For each CSS change:** confirm you used design tokens, not raw colors.
6. **For each JS change:** confirm you used `var` (not ES6 `let`/`const` — actually `let`/`const` are fine; the rest of the codebase uses ES5-flavored JS for consistency with menu.js, but ES6 is supported by all evergreen browsers). Check for missing semicolons, unclosed braces.
7. **If `config.toml` changed:** confirm TOML syntax is valid (no trailing commas in inline tables, quoted strings, dates unquoted).
8. **If you can run `zola build` locally:** do it. The error messages are clear enough to fix in one pass.

---

## 10. Git workflow

### Commit messages

Lowercase, imperative, one line if possible. Examples:

```
add reveal.js demo deck with custom arrow-key indicator
fix tera scoping: move set inside block (extends ignores top-level)
bump zola to 0.22.1 to satisfy serene's min_version
restore class nav link; rename ML→AI throughout
```

No conventional-commits prefixes (`feat:`, `fix:`, `chore:`) unless the user is already using them.

### Co-author lines

**Do not add `Co-Authored-By:` to commits.** This repo's owner has previously asked for this explicitly. The git user is configured; trust it.

### Push

After every commit on `main`, push immediately:

```bash
git push origin main
```

Watch the CI run (`https://github.com/bauerceptor/bauerceptor.github.io/actions`). If it fails, fix in a follow-up commit.

### What not to do

- Don't `git add .` or `git add -A` — be specific about which files you add.
- Don't `git rebase` without explicit instruction.
- Don't `git push --force` without explicit instruction.
- Don't `git commit --amend` once a commit has been pushed.
- Don't `git checkout -- <file>` to discard changes without confirming first.

---

## 11. CSS / design conventions

The design system is documented in `DESIGN.md`. Quick reference:

### Always use tokens, never raw values

```css
/* WRONG */
color: #333;
background: rgba(0,0,0,0.05);
margin-bottom: 16px;
font-size: 14px;

/* RIGHT */
color: var(--fg);
background: var(--bg-2);
margin-bottom: var(--sp-4);
font-size: var(--text-sm);
```

### The full token list

Defined in `templates/_custom_css.html`. Don't redeclare them anywhere else.

- Colors: `--bg`, `--bg-2`, `--fg`, `--fg-2`, `--fg-3`, `--rule`, `--accent`, `--accent-fg`
- Fonts: `--font-serif`, `--font-sans`, `--font-mono`
- Type scale: `--text-xs` through `--text-4xl` (1.333 ratio)
- Spacing scale: `--sp-1` through `--sp-10` (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px)

### Motion conventions

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for almost everything
- Duration: 150-220ms for micro-interactions; 320-420ms for entrance / overlay; never longer than 700ms
- Never animate `width`, `height`, `padding`, `margin`, `top`, `left`. Animate `transform` and `opacity` only.
- Always respect `prefers-reduced-motion` — already handled globally by `_custom_css.html`.

### Absolute bans (from DESIGN.md)

- No animated gradient text (`background-clip: text` + gradient)
- No side-stripe colored borders (`border-left: 3px solid <color>`) on cards / callouts
- No bento grids of identical-sized cards
- No "hero with eyebrow + gradient title + CTA row + social row" template
- No custom cursors
- No background blur orbs
- No marquee text strips
- No modal as first thought
- No em dashes in source code authored by you

### Font use map

| Where | Font |
|-------|------|
| Hero names, page titles, paper titles, serif body on /research | `--font-serif` (Newsreader) |
| UI text, sans body everywhere else | `--font-sans` (Inter) |
| Labels, kickers, metadata, code, tabular numbers | `--font-mono` (JetBrains Mono) |

---

## 12. Common errors and exact fixes

| Error message | What it means | How to fix |
|---------------|---------------|------------|
| `Failed to load theme serene` / `theme.toml not found` | Either the submodule isn't checked out, OR Zola is older than `0.22.1`. The error wording is misleading in the version-mismatch case. | First check `git submodule status` — if it shows `-9da76cc...`, run `git submodule update --init --recursive`. If submodule is checked out, the user's Zola is too old: install 0.22.1+. |
| `unknown variant 'css', expected 'inline' or 'class'` | Someone wrote `style = "css"` in `[markdown.highlighting]`. | Set `style = "class"`. |
| `unknown field 'highlight_code'` | Old Zola syntax. | Remove the line; `[markdown.highlighting]` section is enough to enable highlighting. |
| `Theme 'GitHub Light' does not exist` | Theme name is wrong. Zola's built-ins are lowercase, hyphenated. | Use `github-light` / `github-dark`. |
| `Variable 'X' not found in context` while rendering a template | Either `X` was `set` outside a block (§ 8.2), or `set` inside an `if` that's now out of scope (§ 8.3), or `X` is on `section.extra` but you used `get_section(metadata_only=true)` without a `default()` fallback (§ 8.9). | Apply the relevant fix from § 8. |
| `Function 'X' not found` | `{{ X() }}` somewhere triggered Tera to look for a function. Often inside an HTML comment (§ 8.5). | Rephrase the comment, or wrap with `{% raw %}...{% endraw %}`. |
| `Failed to render section …` `Reason: Filter call 'date' failed` | The format argument was undefined (e.g. `section.extra.date_format` not set on this section). | Provide a `default(value="%b %-d, %Y")` fallback. |
| `Page has taxonomy 'tags' which is not defined` | Missing top-level `taxonomies` declaration in `config.toml`. | Already declared; check it wasn't removed. |
| Empty `themes/serene/` directory | Submodule not initialized. | `git submodule update --init --recursive`. |
| Build "succeeded" but Pages shows Jekyll output | GitHub Pages source is set to "Deploy from a branch" instead of "GitHub Actions". | User must change this in repo Settings → Pages → Source. AI cannot do this. |

---

## 13. If your task isn't covered here

1. Re-read § 1 (hard rules) — your task might be ruled out.
2. Re-read § 2 (read these first) — your task might be guided by `PRODUCT.md` / `DESIGN.md`.
3. Look at how similar things are done in the repo. Match the existing pattern. **Don't invent a new pattern when the codebase already has one.**
4. If still unclear, ask the human a *specific* question. Show them the 2-3 options you're considering and the trade-offs. Don't ask vague open-ended questions like "how should I approach this?".
5. After the task is done, if you established a new pattern or convention, add it to this file.

---

## 14. The single rule that overrides everything

**Match the existing code.** If your output would feel out of place next to what's already in this repo — wrong fonts, wrong spacing, wrong tone, wrong file naming, wrong commit style — you've gone wrong. Re-read the relevant file in the existing codebase, then re-do your output.
