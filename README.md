# bauerceptor.github.io — Main Site

Personal website built with [Zola](https://www.getzola.org/) and the
[Serene](https://github.com/isunjn/serene) theme (pinned at v5.6.3).

Live at: `https://bauerceptor.github.io`

---

## Areas

| Path | Purpose | Font |
|------|---------|------|
| `/` | Artistic homepage | Quattrocento (title), Source Sans 3 |
| `/posts/` | Blog and long-form writing | Source Sans 3 |
| `/notes/` | Notes, references, speaker notes | Source Sans 3 |
| `/research/` | Publications and papers | Frank Ruhl Libre |
| `/projects/` | Project documentation (EasyDocs sidebar) | Mulish |
| `/resume/` | CV with PDF download | Carme |

The companion class site lives in `bauerceptor/zola-class` and is linked
from the hamburger menu on every page.

---

## First-time setup

### 1. Clone with submodules

```bash
git clone --recurse-submodules https://github.com/bauerceptor/bauerceptor.github.io
cd bauerceptor.github.io
```

### 2. Install Zola

```bash
# macOS
brew install zola

# Or download from https://github.com/getzola/zola/releases
# Pin version: use zola 0.19.2 (same as the CI workflow)
```

### 3. Serve locally

```bash
zola serve
# → http://127.0.0.1:1111
```

### 4. Fill in placeholders

Open `config.toml` and replace every `PLACEHOLDER` value:

- `name` — your real name
- `links` — your GitHub handle, email, Twitter, etc.
- `id` — a short identifier shown on the homepage
- `bio` — 2–3 sentences about yourself

---

## Adding content

### New blog post

Create `content/posts/YYYY-MM-DD-your-title.md`:

```toml
+++
title = "Your Title"
date = 2025-03-01
description = "One sentence for search and social cards."

[taxonomies]
tags = ["tag1", "tag2"]

[extra]
lang    = "en"
math    = false      # true = KaTeX, "mathjax" = MathJax
mermaid = false
copy    = true
comment = false
+++

Your content here.
```

### New note (or speaker note)

Same structure, file goes in `content/notes/`.
Use tag `speaker-notes` to mark talk notes, or `reference` for living
reference docs.

### New research paper

Create `content/research/your-paper-slug.md`. See `demo-paper.md` for
the full front matter reference including all link types (paper, arXiv,
code, slides, video, poster, PDF).

Key fields:

```toml
[extra]
year     = 2025
status   = "Published"   # or "Preprint" or "Under Review"
venue    = "NeurIPS 2025"
featured = true          # shows on homepage
authors  = ["Your Name", "Co-Author"]
abstract = "..."
bibtex   = """@inproceedings{...}"""
```

### New project

1. Create `content/projects/my-project/_index.md` (the overview page)
2. Add doc pages: `content/projects/my-project/getting-started.md`, etc.
3. Control sidebar order with `weight = 1`, `weight = 2`, … in front matter
4. Group sidebar entries with `extra.sidebar_section = "Group Label"`

Example doc page front matter:

```toml
+++
title = "Getting Started"
weight = 1

[extra]
sidebar_section = "Introduction"
copy    = true
mermaid = true
+++
```

### Resume

Edit `content/resume/_index.md` in Markdown.
Place PDF files in `static/resume/` (e.g. `static/resume/resume-1.pdf`).
Update the `resume_pdfs` list in the file's front matter to point to them.

### Slides (for research talks)

Place your Reveal.js HTML files anywhere under `static/slides/`:

```
static/slides/neurips-2025/index.html
static/slides/my-talk/index.html
```

Embed in any Markdown page using the shortcode:

```
{{ slides(src="/slides/neurips-2025/index.html") }}
{{ slides(src="/slides/neurips-2025/index.html", height="600", title="NeurIPS Talk") }}
```

---

## Customisation

### Colours

Open `templates/_custom_css.html`. Change `--primary-color` for both
light and dark mode. That one value controls link colours, borders, and
section accents across the whole site.

### Fonts

Fonts are loaded in `templates/_custom_font.html` from Google Fonts.
Font assignments (which font applies where) are in `templates/_custom_css.html`
via `body.section-*` selectors and the `.home-title` class.

### Homepage hero

In `config.toml` under `[extra]`:
- `name` controls the hero title (first word plain, rest gradient)
- `bio` controls the subtitle paragraph

### Code highlight themes

Zola generates `/giallo-light.css` and `/giallo-dark.css` based on the
`light_theme` and `dark_theme` values in `config.toml [markdown.highlighting]`.
`theme-toggle.js` swaps them by toggling the `media` attribute on the
`<link>` tags.

To try different themes: change the theme names in `config.toml`,
rebuild, and the new CSS files are generated automatically.
Available theme names: check Zola's documentation for the Giallo
built-in theme list.

### Hamburger menu

To add or remove links from the overlay menu, edit the `NAV_LINKS` array
in `static/js/menu.js`. **Copy the same change to the class site's
`static/js/menu.js`.** This is the one file that must be kept in sync
manually between both repos.

---

## Updating Serene

Serene is pinned at v5.6.3 via `.gitmodules`.

To update to a newer release:

```bash
cd themes/serene
git fetch --tags
git checkout vX.Y.Z   # the new tag
cd ../..
git add themes/serene
git commit -m "chore: update serene to vX.Y.Z"
```

**Before updating**, check Serene's changelog for any template changes
that could conflict with your overrides in `templates/`. The files you've
customised are:

- `templates/_custom_css.html`
- `templates/_custom_font.html`
- `templates/_head_extend.html`
- `templates/home.html`
- `templates/research/section.html`
- `templates/research/page.html`
- `templates/projects/section.html`
- `templates/projects/page.html`
- `templates/resume/page.html`

---

## Deployment

Push to `main`. The GitHub Actions workflow (`.github/workflows/deploy.yml`)
builds with Zola 0.19.2 and deploys to GitHub Pages automatically.

**One-time setup:** Go to repo Settings → Pages → Source: set to
"GitHub Actions".

---

## File structure reference

```
bauerceptor.github.io/
├── config.toml                  ← Site settings; fill in placeholders
├── .gitmodules                  ← Serene submodule pinned at v5.6.3
│
├── templates/
│   ├── _custom_css.html         ← CSS variables & font assignments (Serene hook)
│   ├── _custom_font.html        ← Google Fonts <link> tags (Serene hook)
│   ├── _head_extend.html        ← Per-page <head> extras (highlight sheets, section CSS)
│   ├── home.html                ← Full homepage override
│   ├── research/
│   │   ├── section.html         ← Publication list grouped by year
│   │   └── page.html            ← Individual paper page
│   ├── projects/
│   │   ├── section.html         ← Project card grid
│   │   └── page.html            ← EasyDocs sidebar doc page
│   ├── resume/
│   │   └── page.html            ← BelResume-style CV page
│   └── shortcodes/
│       └── slides.html          ← {{ slides(src="...") }} shortcode
│
├── static/
│   ├── css/
│   │   ├── home.css             ← Homepage styles
│   │   ├── menu.css             ← Hamburger overlay (keep in sync with repo2)
│   │   ├── copy-btn.css         ← Copy button (keep in sync with repo2)
│   │   ├── research.css         ← Research section styles
│   │   ├── projects.css         ← EasyDocs sidebar layout
│   │   └── resume.css           ← Resume page styles
│   ├── js/
│   │   ├── menu.js              ← Hamburger menu (keep in sync with repo2)
│   │   ├── theme-toggle.js      ← Light/dark/system cycle
│   │   └── copy-code.js         ← Copy-to-clipboard toggle
│   ├── slides/                  ← Drop Reveal.js HTML files here
│   ├── resume/                  ← PDF files (resume-1.pdf, etc.)
│   └── img/
│       └── avatar.webp          ← Your avatar (referenced in config.toml)
│
├── content/
│   ├── _index.md                ← Homepage entry (template = "home.html")
│   ├── posts/                   ← Blog posts
│   ├── notes/                   ← Notes and speaker notes
│   ├── research/                ← Papers (one .md per paper)
│   ├── projects/
│   │   └── demo-project/        ← Example project with doc pages
│   └── resume/
│       └── _index.md            ← Resume content in Markdown
│
└── .github/
    └── workflows/
        └── deploy.yml
```
