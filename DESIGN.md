# Design system

Editorial-technical register. Print-influenced. Restrained, content-forward.

## Color

OKLCH everywhere. No `#000` or `#fff`. Every neutral tinted toward the warmth of the page.

### Light theme
| Token | Value | Use |
|---|---|---|
| `--bg` | `oklch(98% 0.008 80)` | Page background — warm paper cream |
| `--bg-2` | `oklch(95% 0.010 80)` | Inset surfaces |
| `--fg` | `oklch(22% 0.015 75)` | Primary text — warm near-black |
| `--fg-2` | `oklch(45% 0.012 75)` | Secondary, captions |
| `--fg-3` | `oklch(65% 0.008 75)` | Tertiary, metadata |
| `--rule` | `oklch(86% 0.008 80)` | Hairline dividers |
| `--accent` | `oklch(54% 0.18 35)` | Vermilion. Links, focus, single emphasis. |

### Dark theme
| Token | Value | Use |
|---|---|---|
| `--bg` | `oklch(15% 0.012 270)` | Deep indigo-ink |
| `--bg-2` | `oklch(19% 0.014 270)` | Inset surfaces |
| `--fg` | `oklch(93% 0.008 70)` | Warm off-white |
| `--fg-2` | `oklch(70% 0.010 70)` | Secondary |
| `--fg-3` | `oklch(50% 0.012 70)` | Tertiary |
| `--rule` | `oklch(26% 0.014 270)` | Hairlines |
| `--accent` | `oklch(72% 0.16 40)` | Vermilion, brightened for dark |

### Strategy: Restrained
One accent (vermilion), used for ≤10% of color weight. Everything else is tinted neutral. No semantic color ramps (no red-for-error / green-for-success). Status uses uppercase mono labels with hairline borders, not colored badges.

## Typography

Three families, no more.

| Family | Role | Source |
|---|---|---|
| Newsreader | Display + serif body for research pages | Google Fonts (variable, opsz 6–72) |
| Inter | UI + body sans for everything else | Google Fonts (variable) |
| JetBrains Mono | Labels, metadata, code | Google Fonts |

### Scale (1.333 ratio)
```
--text-xs:  0.75rem
--text-sm:  0.875rem
--text-md:  1rem        (body)
--text-lg:  1.125rem
--text-xl:  1.5rem
--text-2xl: 2rem
--text-3xl: 2.66rem
--text-4xl: 3.55rem     (hero name)
```

### Rules
- Body line length capped at 65ch (research/prose) or 72ch (UI lists).
- Hero name uses Newsreader at `clamp(2.5rem, 7vw, 4.5rem)`, weight 500, optical size 60.
- Labels are uppercase JetBrains Mono, 0.72rem, letter-spacing 0.08em.
- Numbers in lists use `font-variant-numeric: tabular-nums` so years column-align.

## Spacing

```
--sp-1:  4px
--sp-2:  8px
--sp-3:  12px
--sp-4:  16px
--sp-5:  24px
--sp-6:  32px
--sp-7:  48px
--sp-8:  64px
--sp-9:  96px
--sp-10: 128px
```

Vary spacing for rhythm. Section padding is larger than item padding by 3–4 steps.

## Layout primitives

- `.wrap` — `max-width: 65ch`, `margin-inline: auto`, `padding-inline: clamp(1rem, 4vw, 2rem)`.
- `.row-meta` — `display: flex; justify-content: space-between; align-items: baseline; gap: var(--sp-5);` for label + right-aligned metadata.
- `.rule` — `border-top: 1px solid var(--rule)` (hairline).
- No cards on home. Lists with hairline separators instead.
- No drop shadows. Depth comes from typography contrast.

## Motion

- ease curve: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo)
- duration: 150–220ms on micro-interactions only
- Never animate layout properties (width, height, padding, margin)
- `prefers-reduced-motion: reduce` → disable all animations

## Anti-patterns (absolute)

These are banned in this project, no exceptions:
- Animated gradient text (`background-clip: text` + gradient).
- Side-stripe borders (colored `border-left`/`border-right` > 1px on cards/callouts).
- Bento grids of identical-sized cards.
- "Hero" with eyebrow label, gradient title, two CTAs, social row.
- Custom cursors.
- Background blur orbs.
- Marquee text strips.
- Modal as first thought.
- Em dashes — use commas, colons, parens.
