# Setting up the landing page

`coding-guard.memoryai.dev` is the canonical landing.

## Step 1 — DNS

In Cloudflare (or your DNS provider for `memoryai.dev`):

```
Type   Name                Target               Proxy
CNAME  coding-guard        ch270035.github.io   On
CNAME  cg                  ch270035.github.io   On
```

`cg.memoryai.dev` works as a short alias (no separate redirect needed if both CNAMEs resolve to the same Pages site).

## Step 2 — GitHub Pages

In the repo settings:

1. Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main` / folder `/docs`
4. Custom domain: `coding-guard.memoryai.dev`
5. Enforce HTTPS: ✓

GitHub will issue a Let's Encrypt cert automatically (~1-2 min).

## Step 3 — Verify

```bash
curl -I https://coding-guard.memoryai.dev/
# Expect: 200 OK, served from GitHub Pages
```

## Optional — Cloudflare Pages alternative

If you prefer Cloudflare Pages over GitHub Pages:

1. Cloudflare dashboard → Workers & Pages → Create
2. Connect to GitHub repo `CH270035/memoryai-coding-guard`
3. Build output directory: `docs`
4. Custom domain: `coding-guard.memoryai.dev`

Cloudflare gives faster Asia/SEA latency than GitHub Pages.
