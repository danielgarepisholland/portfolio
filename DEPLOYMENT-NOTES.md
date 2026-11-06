# Deployment notes: Pages -> Worker with static assets

Migrated 2026-11-05. Written so the same recipe can be reused for the lilyflower.app zone.

## Current setup
- Worker `portfolio` (account 9d52c01a6245901d08daccd8c30ada34), static assets only, no script.
- `wrangler.jsonc`: name `portfolio`, compatibility_date `2026-04-30`, `assets.directory` `./dist`.
- `dist/` is generated (git-ignored). Build/copy command:
  `rm -rf dist && mkdir -p dist && cp -r index.html creative.html archive.html styles.css main.js mothers-day.html mothers-day.css mothers-day.js assets content fonts dist/`
- Deploy: `npx wrangler deploy` (wrangler login as danielgarepisholland@gmail.com).
- Custom domain: `garepis.net` (zone 3cf4bcf910fc6d46fcf671e8ee309040) attached to Worker `portfolio`
  (domain id 254db5d7a566d88e63bcece37b119107deff5152). Cloudflare manages the DNS record
  (shows as a proxied AAAA `100::`) and the Let's Encrypt certificate.
- workers.dev URL and preview URLs are disabled (`workers_dev: false`, `preview_urls: false`
  in wrangler.jsonc). To test before attaching a domain, temporarily set `workers_dev: true`.
- Git auto-deploy: Workers Builds trigger on repo danielgarepisholland/portfolio, branch main,
  build/deploy commands as in the section below. Verified working 2026-11-05.
- Gallery data: separate Worker `r2-asset-index` (untouched) reading R2 bucket `photos-1`;
  images served from the bucket's r2.dev public URL. r2.dev is rate-limited and not meant for
  production; consider a custom domain on the bucket (e.g. photos.garepis.net) later.
  Bucket `mothers-day` also exists with its own r2.dev URL.

## What was changed at cutover
1. Removed garepis.net from Pages project `portfolio` custom domains.
2. Deleted proxied CNAME garepis.net -> portfolio-3li.pages.dev.
3. Added garepis.net as Worker custom domain (API: PUT /accounts/{id}/workers/domains
   with hostname, service, zone_id).
Brief downtime between steps 2 and 3 (seconds).
Rollback: delete the Worker domain, recreate the CNAME, re-add the domain to Pages.

## Behavior notes
- `.html` URLs 307-redirect to clean URLs (`/creative.html` -> `/creative`), the default
  asset-serving behavior, same as Pages.
- Per-file limit 25 MiB; the podcast mp3 was 25,035,411 bytes (~23.9 MiB) and was re-encoded 2026-11-05 to mono 64 kbps (14.3 MB).
- Do not copy README, .git, or untracked private folders into dist/.
- Old Pages project `portfolio` (portfolio-3li.pages.dev) was deleted 2026-11-05 after the
  Worker ran cleanly; rollback to Pages is no longer possible.

## Reusing for lilyflower.app
- New repo/folder: add `wrangler.jsonc` with its own name and `assets.directory`.
- `npx wrangler deploy`, then attach the domain from the dashboard (Workers & Pages >
  Worker > Settings > Domains) or via the Workers domains API with that zone's id.
- Delete any conflicting existing DNS record for the hostname first.
- Git auto-deploy: Settings > Builds, build command = the dist copy command above,
  deploy command = `npx wrangler deploy`.
