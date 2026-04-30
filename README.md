# Portfolio Site

Static portfolio scaffold prepared for Cloudflare Pages.

## Files

- `index.html`
- `styles.css`
- `main.js`
- `fonts/`

## Current behavior

- Self-hosts `DM Sans` and `Cormorant Garamond`
- Pulls a working photo gallery from:
  - `https://r2-asset-index.danielgarepisholland.workers.dev/assets?prefix=photos/&limit=12`

## Cloudflare Pages setup

1. Create a new Pages project.
2. Use `portfolio-site` as the project directory.
3. Framework preset:
   - `None`
4. Build command:
   - leave blank
5. Build output directory:
   - `.`

Because this is a plain static site, Pages can serve it directly.
