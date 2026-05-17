# bauerceptor.github.io

Personal site for Hassan Aziz. Built with [Zola](https://www.getzola.org/) and the [Serene](https://github.com/isunjn/serene) theme (pinned at `v5.6.3`), with a custom editorial layer ("lab notebook" style) on top.

Live at **https://bauerceptor.github.io**.

Companion class site lives at `bauerceptor/zola-class` and is linked from the hamburger menu.

---

## Sections

| Path        | What it is                                  | Template                            |
|-------------|---------------------------------------------|-------------------------------------|
| `/`         | Home — hero + selected work + recent writing| `templates/home.html`              |
| `/research/`| Publication list grouped by year            | `templates/research/section.html`  |
| `/projects/`| Project list with sigils + docs sidebar     | `templates/projects/section.html`  |
| `/posts/`   | Long-form writing                           | `templates/blog.html` + `post.html`|
| `/notes/`   | Short notes, references, speaker notes      | `templates/blog.html` + `post.html`|
| `/resume/`  | Single-page CV with PDF download            | `templates/resume/page.html`       |
| `/slides/`  | Listing page for all decks (links open in new tab) | `templates/slides.html`        |
| `/404.html` | Custom 404 page                             | `templates/404.html`               |

---

## First-time setup

**Required, run once.**

### 1. Clone with submodules

The Serene theme is a git submodule, so use `--recurse-submodules`. Without it the build will fail with `theme.toml not found`.

```bash
git clone --recurse-submodules git@github.com:bauerceptor/bauerceptor.github.io.git
cd bauerceptor.github.io
```

If you forgot the flag: `git submodule update --init --recursive`.

### 2. Install Zola **0.22.1 or newer**

The Serene theme requires `min_version = "0.22.1"`. Anything older will fail with a misleading "theme.toml not found" error.

```bash
# macOS
brew install zola

# Arch
sudo pacman -S zola

# Other: download a binary from https://github.com/getzola/zola/releases
```

The CI build pins `zola@0.22.1` in `.github/workflows/deploy.yml`. Bump that pin deliberately when you upgrade locally.

### 3. Serve locally

```bash
zola serve
# → http://127.0.0.1:1111 with live reload
```

### 4. Enable GitHub Pages

In the repo's web UI: **Settings → Pages → Source → GitHub Actions**.
Without this, GitHub falls back to its legacy Jekyll auto-builder, which fails on the Serene theme files.

---

## Configuring your identity

**Required.** Open `config.toml` and edit:

| Field (in `[extra]`) | Purpose                                                |
|----------------------|--------------------------------------------------------|
| `name`               | Used as homepage title, hero name, and footer.         |
| `bio`                | One-paragraph hero lede on the home page.              |
| `id`                 | Short identifier (slug-form).                          |
| `links`              | Social links — see the array in `config.toml`.         |
| `footer_copyright`   | Footer text on home page.                              |

`title` and `description` at the top of `config.toml` also feed `<title>` and `<meta name="description">`.

**Then mirror the same change in `static/js/menu.js`:** edit the `SITE_NAME` default and `SOCIAL_LINKS` array. The hamburger menu is built by JavaScript, not Tera templates, so config.toml doesn't reach it.

---

## Adding content

Every content file goes under `content/<section>/`. Zola picks up new files on the next serve / build automatically.

### Blog post → `/posts/`

**File:** `content/posts/YYYY-MM-DD-your-slug.md`

```toml
+++
title = "Your post title"
date = 2026-05-18                       # REQUIRED
description = "One sentence for cards and previews."   # OPTIONAL

[taxonomies]                            # OPTIONAL
tags = ["ai", "robotics"]

[extra]                                 # all OPTIONAL — overrides /posts/_index.md defaults
math    = false                         # true = KaTeX
mermaid = false                         # true = mermaid diagrams
copy    = true                          # copy-to-clipboard buttons on <pre>
comment = false                         # giscus comments (needs setup)
toc     = true                          # show "On this page" right rail
+++

Your markdown content here. H2 (##) gets a § margin glyph on doc pages.
```

The on-this-page rail uses `page.toc`, which is built from your `##` headings. Hides automatically under 1024px wide.

### Note → `/notes/`

Same shape as a post, file goes in `content/notes/`. The page is rendered with the same `templates/post.html`, just with a different body class (`section-notes`).

Useful tag conventions: `speaker-notes` for talk notes, `reference` for living reference docs.

### Research paper → `/research/`

**File:** `content/research/your-paper-slug.md`. See `content/research/demo-paper.md` for a complete example.

```toml
+++
title = "Your Paper Title"
date = 2026-01-15                        # REQUIRED — used for sort order

[extra]
year     = 2026                          # REQUIRED — groups in year-buckets on /research/
authors  = ["Hassan Aziz", "Co-Author"]  # OPTIONAL but recommended
venue    = "NeurIPS 2026"                # OPTIONAL — italic byline
venue_note = "Oral presentation"         # OPTIONAL — appended after venue
status   = "Published"                   # OPTIONAL — "Published" | "Preprint" | "Under Review"
featured = true                          # OPTIONAL — shows on home page's "Selected research"
equal_contribution = 2                   # OPTIONAL — first N authors get * superscript
abstract = "Your abstract..."            # OPTIONAL — italic block on paper page

# Link buttons — all OPTIONAL, render only if set:
paper_url  = "https://..."
arxiv_url  = "https://arxiv.org/abs/..."
code_url   = "https://github.com/..."
slides_url = "/slides/<deck>/index.html"
video_url  = "https://..."
poster_url = "https://..."

bibtex = """
@inproceedings{aziz2026title,
  title     = {...},
  author    = {...},
  booktitle = {NeurIPS},
  year      = {2026}
}
"""                                       # OPTIONAL — renders the BibTeX block at the bottom
+++

Markdown body — extended notes, contribution summary, related work.
```

### Project → `/projects/<name>/`

**Two-step:** create the project folder, then add doc pages inside it.

**Step 1 — REQUIRED — project overview:** `content/projects/<name>/_index.md`

```toml
+++
title = "Project Name"
description = "One-sentence elevator pitch."
sort_by = "weight"
template = "projects/single-section.html"   # REQUIRED — pins the layout
insert_anchor_links = "right"

[extra]
category = "Open Source"   # OPTIONAL — string, any value
sigil    = "ROBO"          # OPTIONAL — 2–4 char monospace badge (uppercase)
hue      = "robo"          # OPTIONAL — color accent: oss | ml | sec | robo | net | research
status   = "Active"        # OPTIONAL — string, any value
language = "Rust · Python" # OPTIONAL
repo     = "https://github.com/..."  # OPTIONAL
+++

Markdown overview — what this project is and why it exists.
```

**Hue → color map** (defined in `static/css/projects.css`):

| Hue         | Color used        | Suggested for            |
|-------------|-------------------|--------------------------|
| `oss`       | green             | Open-source software     |
| `ml`        | blue-teal         | AI / ML work             |
| `sec`       | warm red          | Security                 |
| `robo`      | amber             | Robotics                 |
| `net`       | indigo-violet     | Networking               |
| `research`  | vermilion         | Research code            |
| (omit)      | site accent       | anything else            |

**Step 2 — OPTIONAL — doc pages** inside the project folder:

`content/projects/<name>/getting-started.md`

```toml
+++
title = "Getting Started"
description = "Install and run in 5 minutes."   # OPTIONAL
weight = 1                                       # REQUIRED — controls sidebar order (lower = higher up)

[extra]
sidebar_section = "Introduction"   # OPTIONAL — groups sidebar items under a label
math    = false
mermaid = true                     # OPTIONAL — enables mermaid diagrams on this page
copy    = true
+++

Doc page content. H2 gets a § margin glyph; on-this-page TOC appears at 1024px+.
```

Sidebar entries get auto-numbered (`00 · Overview`, `01 · Getting Started`, `02 · API Reference`…), so weight order matters.

### Resume → `/resume/`

Edit `content/resume/_index.md`. Front matter:

```toml
[extra]
resume_name  = "Hassan Aziz"
resume_title = "Your one-line role"

location    = "City, Country"          # OPTIONAL — spec sheet rows
affiliation = "Lab / institution"
focus       = "AI, robotics, ..."
languages   = "English, Urdu, ..."

resume_pdfs = [                        # OPTIONAL — one or many download buttons
    { path = "/resume/hassan-aziz-cv.pdf", label = "Download CV" },
]
```

Body is plain Markdown:
- `## Heading` → small-caps mono section labels (Experience, Education, etc.)
- `### Heading` → entry title (Role · Org, Degree · University)
- `*italic*` → mono date line
- Bullets → indented with a `·` marker

PDF files go in `static/resume/` (e.g. `static/resume/hassan-aziz-cv.pdf`).

### Slide deck → `/slides/<deck>/`

**Step 1 — REQUIRED — drop the HTML file.** Reveal.js decks are self-contained HTML files. Place yours at:

```
static/slides/<deck-name>/index.html
```

Zola serves it as-is. URL becomes `https://bauerceptor.github.io/slides/<deck-name>/`.

The `static/slides/demo/index.html` deck is a fully-styled template — copy the folder and edit. It includes:
- Custom arrow-key indicator (bottom-right) that highlights live based on available routes
- GitHub Light / Dark syntax highlighting that auto-flips with system preference
- Copy-to-clipboard button on every `<pre>`
- JetBrains Mono with ligatures
- `?` for the shortcuts overlay

#### Shared slide themes

The same theme files live in both this repo and `zola-class`, under
`static/slides/_themes/`:

| Theme      | File          | Look                                                                                  |
|------------|---------------|---------------------------------------------------------------------------------------|
| `clean`    | `clean.css`   | **Default.** Editorial serif (Newsreader) + Inter; auto-switches by system theme.    |
| `night`    | `night.css`   | Tokyo-night dark, Playfair Display titles, Nanum Gothic body, lime accent.            |
| `terminal` | `terminal.css`| All JetBrains Mono, neovim-aligned, `# / ## / ###` heading prefixes.                  |

Each deck links one theme + the shared helpers script:

```html
<!-- adjust the ../ count to match your deck's directory depth -->
<link rel="stylesheet" href="../_themes/clean.css">
<script src="../_themes/deck-utils.js" defer></script>
```

`deck-utils.js` adds copy buttons on every `<pre>`, renders mermaid
fences as SVG (lazy-loaded only when the deck has any), draws an
arrow-key indicator and a slide counter, and wires `?` to a help
overlay. It detects existing inline copy buttons and skips double-up.

**Step 2 — REQUIRED to list it on `/slides/`.** Add an entry to the `talks` array in `config.toml` under `[extra]`:

```toml
talks = [
    { title = "Reveal.js · Demo deck", description = "One-line description.", url = "/slides/demo/", date = "2026-05-18" },
    { title = "Your next talk",         description = "...",                   url = "/slides/your-deck/", date = "2026-06-01" },
]
```

Required per entry: `title`, `url`. Optional: `description`, `date` (YYYY-MM-DD string).

Without this entry the deck still works at its direct URL, but it won't appear on the `/slides/` listing page or in the hamburger menu's "Slides" link. The `/slides/` page reads this array directly. Clicks open in a new tab via `target="_blank"`.

**Step 3 — OPTIONAL — embed a deck inline in a post or project page** via the shortcode:

```
{{ slides(src="/slides/your-deck/index.html") }}
{{ slides(src="/slides/your-deck/index.html", height="600", title="Talk title") }}
```

Defined in `templates/shortcodes/slides.html`.

---

## Hamburger menu

The hamburger menu (top-right on every page) is built by JS, not Tera. To add or remove items, edit **two** files:

1. `static/js/menu.js` — `NAV_LINKS` (nav rows) and `SOCIAL_LINKS` (bottom of the panel).
2. `config.toml` `[extra].sections` — for Tera templates that reference it.

Keep them in sync manually. The class link uses `external: true` so it gets the `↗` indicator.

---

## Design system

### Tokens

All design tokens (colors, fonts, type scale, spacing) live in `templates/_custom_css.html`. Auto-switches light / dark via `prefers-color-scheme` (also overridable via the menu toggle).

| Token                       | What it controls                  |
|-----------------------------|-----------------------------------|
| `--bg`, `--bg-2`            | Page + inset surface backgrounds  |
| `--fg`, `--fg-2`, `--fg-3`  | Text from primary → muted         |
| `--rule`                    | Hairline dividers                 |
| `--accent`                  | Single accent (vermilion). Used for hover, focus, active states. |
| `--font-serif`              | Newsreader (headlines, research body) |
| `--font-sans`               | Inter (UI + body)                 |
| `--font-mono`               | JetBrains Mono (labels, code)     |

To change the accent color: edit `--accent` in both the `:root` and `html.dark` blocks of `templates/_custom_css.html`. Use OKLCH.

### Fonts

3 fonts only, all from Google Fonts (`templates/_custom_font.html`). To add a font:

1. Add the family to the `<link>` URL.
2. Add a CSS variable to `templates/_custom_css.html`.
3. Reference the variable in your CSS.

### Favicon

The site ships two SVG favicons that swap automatically with the user's system theme:

```
static/img/bauerceptor-light.svg   ← shown when system is in light mode
static/img/bauerceptor-dark.svg    ← shown when system is in dark mode
```

Wiring lives in `templates/_head_extend.html`:

```html
<link rel="icon" type="image/svg+xml" href="/img/bauerceptor-light.svg" media="(prefers-color-scheme: light)">
<link rel="icon" type="image/svg+xml" href="/img/bauerceptor-dark.svg"  media="(prefers-color-scheme: dark)">
<link rel="icon" type="image/svg+xml" href="/img/bauerceptor-light.svg">   <!-- fallback -->
```

**To replace:**
1. Drop your new SVGs at the same paths (or rename and update the `href`s in `_head_extend.html`).
2. The `-light` file should render well against light backgrounds (typically a dark icon); the `-dark` file should render well against dark backgrounds (typically a light icon).
3. Keep SVG. Browsers cache favicons aggressively — a hard reload (`Cmd-Shift-R`) is usually needed to see the change.

For raster fallbacks (`.ico` / `.png` for older browsers), add them in `_head_extend.html` after the SVG `<link>`s.

### Syntax highlighting

Configured in `config.toml`:

```toml
[markdown.highlighting]
style = "class"
light_theme = "github-light"
dark_theme  = "github-dark"
```

Zola generates `/github-light.css` and `/github-dark.css` automatically. `_head_extend.html` loads them with `prefers-color-scheme` media queries.

To switch themes: change `light_theme` / `dark_theme` to any of Zola's built-in themes (`monokai`, `solarized-dark`, `one-dark`, `dracula`, `gruvbox-dark`, `inspired-github`, etc.) and rebuild.

---

## Optional features

Each is off by default; enable per-page in front matter or globally in section `_index.md`.

| Feature                | Enable how                                       | Notes                                         |
|------------------------|--------------------------------------------------|-----------------------------------------------|
| **KaTeX math**         | `extra.math = true`                              | Posts only. Use `$inline$` or `$$display$$`.  |
| **Mermaid diagrams**   | `extra.mermaid = true`                           | Posts and project docs.                       |
| **Giscus comments**    | `extra.comment = true` + uncomment giscus block in `config.toml` | Needs giscus.app setup first.       |
| **Anonymous reactions**| `extra.reaction = true` + set `reaction_endpoint`| Requires a working API endpoint.              |
| **On-this-page TOC**   | `extra.toc = true` (default on)                  | Built from `##` headings. Hidden < 1024px.    |
| **Outdate alert**      | `extra.outdate_alert = true`                     | Shows a banner if post is older than N days.  |
| **Scroll progress bar**| Always on for docs, posts, papers, resume.       | Uses `animation-timeline: scroll()`. Falls back silently in Firefox. |

---

## Keyboard shortcuts (site-wide)

Press `?` (Shift + `/`) anywhere for the help panel. The G-prefix shortcuts:

| Keys  | Goes to    |
|-------|------------|
| `g h` | Home       |
| `g r` | Research   |
| `g p` | Projects   |
| `g w` | Writing    |
| `g n` | Notes      |
| `g c` | Resume (CV)|

Doesn't fire while typing in a text field. Configured in `static/js/shortcuts.js`.

---

## Updating Serene

The theme is pinned at `v5.6.3` via `.gitmodules`. When upgrading:

```bash
cd themes/serene
git fetch --tags
git checkout vX.Y.Z
cd ../..
git add themes/serene
git commit -m "chore: bump serene to vX.Y.Z"
```

Then check that your custom templates still extend Serene's `_base.html` correctly. Files most likely to need attention if Serene changes:

- `templates/_custom_css.html`, `_custom_font.html`, `_head_extend.html` (Serene hooks)
- `templates/home.html`, `blog.html`, `post.html` (full overrides)
- `templates/research/*`, `projects/*`, `resume/*` (full overrides)

If the build fails after a Serene bump, compare with Serene's `templates/_base.html` to see if a block name or variable changed.

---

## Deployment

Push to `main`. CI builds with the pinned Zola version and deploys to GitHub Pages (Actions, not the legacy Jekyll builder).

Pipeline lives in `.github/workflows/deploy.yml`:
1. Checkout with submodules
2. Install Zola (cached by taiki-e/install-action)
3. `zola build`
4. Upload + deploy artifact

If a build fails, the Actions tab shows the error. Most common causes:
- Forgot to clone submodules → "theme.toml not found"
- Zola version below the theme's `min_version` → also "theme.toml not found" (misleading)
- A `set` statement at the top of a child template that uses `{% extends %}` → it's silently ignored; move it inside a `{% block %}`
- Invalid Tera syntax (Jinja2-isms don't work — no `namespace()`, no Python-style ternary)

---

## File structure

```
bauerceptor.github.io/
├── config.toml                       # Site config + [extra] for the homepage
├── PRODUCT.md                        # Brand register + voice (impeccable skill context)
├── DESIGN.md                         # Token system + design laws (impeccable skill context)
├── .gitmodules                       # Serene submodule, pinned at v5.6.3
│
├── content/
│   ├── _index.md                     # Homepage entry (template = "home.html")
│   ├── posts/                        # Blog posts
│   │   └── _index.md
│   ├── notes/                        # Notes / speaker notes
│   │   └── _index.md
│   ├── research/                     # One .md per paper
│   │   └── _index.md
│   ├── projects/                     # One folder per project
│   │   └── demo-project/
│   │       ├── _index.md             # Project overview
│   │       ├── getting-started.md    # Doc pages (weight = 1, 2, …)
│   │       └── api-reference.md
│   └── resume/
│       └── _index.md
│
├── templates/                        # All overrides of Serene's templates
│   ├── _custom_css.html              # Design tokens (Serene hook)
│   ├── _custom_font.html             # Google Fonts links (Serene hook)
│   ├── _head_extend.html             # Per-page <head>: scripts + section CSS
│   ├── 404.html                      # Custom 404 page
│   ├── home.html                     # Homepage
│   ├── blog.html                     # /posts and /notes listing
│   ├── post.html                     # Individual post / note
│   ├── research/
│   │   ├── section.html              # Listing
│   │   └── page.html                 # Individual paper
│   ├── projects/
│   │   ├── section.html              # Listing
│   │   ├── single-section.html       # Project overview (with sidebar)
│   │   └── page.html                 # Doc page (with sidebar + TOC)
│   ├── resume/
│   │   └── page.html
│   └── shortcodes/
│       └── slides.html               # {{ slides(src="...") }}
│
├── static/
│   ├── css/
│   │   ├── home.css                  # Homepage
│   │   ├── blog-notes.css            # Shared prose (posts + notes)
│   │   ├── posts.css                 # Listing + single post structure
│   │   ├── notes.css                 # Notes-only touches
│   │   ├── research.css              # Research listing + paper page
│   │   ├── projects.css              # Docs sidebar + project list
│   │   ├── resume.css                # Resume page
│   │   ├── menu.css                  # Hamburger overlay
│   │   └── copy-btn.css              # Copy-to-clipboard button
│   ├── js/
│   │   ├── menu.js                   # Hamburger menu (NAV_LINKS + SOCIAL_LINKS here)
│   │   ├── theme-toggle.js           # Light / dark / system cycle
│   │   ├── copy-code.js              # Copy-to-clipboard buttons on <pre>
│   │   └── shortcuts.js              # g h, g r, g p, … keyboard shortcuts
│   ├── slides/
│   │   └── demo/                     # Reveal.js deck template — copy + edit
│   │       └── index.html
│   ├── resume/                       # Drop PDF files here
│   └── img/                          # Drop images here (avatar.webp, etc.)
│
├── themes/
│   └── serene/                       # Submodule, pinned at v5.6.3
│
└── .github/
    └── workflows/
        └── deploy.yml                # CI pipeline (pinned Zola version here)
```

---

## Common pitfalls

- **`zola serve` fails with theme.toml missing** → either the submodule wasn't cloned (`git submodule update --init --recursive`), or Zola is older than `0.22.1` (upgrade).
- **Build fails after editing a template** → check that `{% extends %}` is the very first non-comment content in the file, and any `{% set %}` you need across blocks is *inside* a `{% block %}` (top-level sets are silently ignored in child templates).
- **Hamburger menu still shows placeholders** → you edited `config.toml` but forgot `static/js/menu.js`.
- **Section glyph (§) missing in mobile prose** → intentional. Hidden under 768px because there's no margin to put it in.
- **Slide deck looks wrong after editing** → reveal.js content scripts run on `Reveal.on('ready')`; if you add new code blocks without re-initializing, syntax highlighting and copy buttons won't attach. Reload the page.
