# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sneakerclean** — a single-page landing site for a Russian-language shoe and sneakers cleaning service. The entire site lives in `index.html` as a self-contained file with CSS located in `css/` and JavaScript located in `js/`. `images/` directory contains images and icons.

## Architecture

The site is a **single HTML file** (`index.html`) with no build step, no bundler, and no backend for now.

**External CDN dependencies** (loaded at runtime):
- Bootstrap 5.3.3 (CSS + JS bundle)
- Bootstrap Icons 1.11.3
- Google Fonts: Cormorant Garamond + Jost
- jQuery 3.7.1

**Scroll animation**: `.fade-up` elements become `.visible` via `IntersectionObserver`.

## Development

No build tools required. Open `index.html` directly in a browser or serve with any static file server:

```bash
# Python
python -m http.server 8080

# Node (if npx available)
npx serve .
```

All markup edits go into `index.html`. CSS edits go to  `css/style.css`. JS edits go to `js/main.js` (directories already exist).

## Language

All user-facing content is in **Russian**. Keep new UI text in Russian.
