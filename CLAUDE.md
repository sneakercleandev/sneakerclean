# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sneakerclean** — a single-page landing site for a Russian-language shoe and sneakers cleaning service located in Minsk, Belarus.

## Development

No build tools. Serve with any static file server and open in a browser:

```bash
python -m http.server 8080
# or
npx serve .
```

## File Map

| File | Purpose |
|---|---|
| `index.html` | Entire page markup — all sections live here |
| `css/style.css` | All styles — design tokens at the top, then one block per section |
| `js/main.js` | All JS — navbar scroll, fade-up observer, examples slider, order form |
| `images/` | `case1–7.jpg` (slider), `log_orig.jpg` (logo), `услуги1–4.jpg` (services) |

## Architecture

**Single HTML file, no build step, no backend.** CDN dependencies loaded at runtime:
- Bootstrap 5.3.3 (CSS + JS bundle)
- Bootstrap Icons 1.11.3
- Google Fonts: Cormorant Garamond (display/headings) + Jost (body)
- jQuery 3.7.1 (loaded but currently unused — available for future use)

**Page sections in order:** `#menu` → `#about` (hero) → `#examples` → `#order` → `#footer`

### CSS conventions

All colour, spacing, and type values are defined as CSS custom properties at the top of `style.css`:

```
--bg / --bg-2 / --bg-card   background layers (darkest to lightest)
--accent / --accent-dim      teal brand colour (#00e5be)
--text-primary/secondary/muted
--border                     rgba white at 7% opacity
--radius / --radius-lg       12px / 20px
--section-py                 7rem section vertical padding
--transition                 0.35s cubic-bezier easing
```

Always use these tokens. Never hardcode colours or spacing that matches an existing token.

### JS conventions

`main.js` is structured as three independent IIFEs after the two top-level scroll/fade listeners:

1. **Examples slider** — custom multi-card slider (not Bootstrap carousel). Card widths are calculated in JS from `.ex-viewport` clientWidth and a hardcoded `GAP_PX = 20` that **must stay in sync** with the CSS `gap: 1.25rem` on `.ex-track`. Visible card count: 3 (≥992px) / 2 (≥576px) / 1 (mobile).

2. **Service toggle** — mutually exclusive `.svc-btn` buttons; selected value written to `#serviceValue` hidden input.

3. **File upload label** — updates `#fileUploadText` with chosen file names on `<input type="file">` change.

### Scroll animation

Add `class="fade-up"` to any element that should animate in on scroll. The `IntersectionObserver` in `main.js` adds `.visible` once the element crosses the 12% threshold, then stops observing it.

### Navbar mobile behaviour

On `< 992px`, `#mainNav` is `position: absolute; top: 100%` so it overlays page content instead of pushing it down. `.nav-contacts` (phone + social icons) lives **outside** `#mainNav` and is always visible.

## Language

All user-facing content is in **Russian**. Keep new UI text in Russian.
