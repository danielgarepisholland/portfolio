# Portfolio Site

Static portfolio site prepared for Cloudflare Pages.

## Production Model

The site has two separate content systems:

- GitHub + Cloudflare Pages: HTML, CSS, JavaScript, fonts, local SVGs, and the photo manifest.
- Cloudflare R2: high-resolution photos and other large media files.

Code/design changes require a Git commit and push. New R2 media uploads do not require a site redeploy unless captions, story groupings, or layout rules change.

## Key Files

- `index.html`: homepage
- `creative.html`: photography, reporting, and brand work
- `archive.html`: project/archive page
- `styles.css`: full visual system
- `main.js`: R2 gallery loading and photo rendering
- `content/photo-manifest.json`: captions, story grouping, source notes, and future Paly Voice links
- `fonts/`: self-hosted typefaces
- `assets/`: local SVGs and static assets

## Local Preview

```bash
cd "/Users/dgarepis/Documents/New project/portfolio-site"
python3 -m http.server 4176 --bind 127.0.0.1
```

Then open:

```txt
http://127.0.0.1:4176/
```

## Deployment Workflow

Normal production flow:

```bash
git status
git add .
git commit -m "Update portfolio"
git push origin main
```

Cloudflare Pages should be connected to the GitHub repo and set to deploy `main`.

Cloudflare Pages settings:

- Framework preset: `None`
- Build command: blank
- Build output directory: `.`
- Production branch: `main`

Manual emergency deploy:

```bash
npx wrangler pages deploy . --project-name <pages-project-name> --branch main
```

## R2 Photo System

The live site fetches the current R2 photo list from:

```txt
https://r2-asset-index.danielgarepisholland.workers.dev/assets?prefix=photos/&limit=1000
```

The site then matches R2 filenames against `content/photo-manifest.json`.

When adding a new image:

1. Upload the image to R2 under `photos/`.
2. Add or update a matching manifest entry in `content/photo-manifest.json`.
3. Commit and push only if captions/story metadata changed.

Example manifest entry:

```json
{
  "pattern": "udiststreetfar1",
  "title": "University District street fair crowd",
  "caption": "Replace with the final caption.",
  "story": "public-realm",
  "source": "Paly Voice",
  "url": "https://palyvoice.com/..."
}
```
