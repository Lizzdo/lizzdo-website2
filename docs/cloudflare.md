# Cloudflare Pages & Cloudflare DNS Deployment Guide — LIZZDO

This document covers configuring and deploying the **LIZZDO** static single-page application on **Cloudflare Pages** and routing custom domain traffic through **Cloudflare DNS**.

---

## 1. Cloudflare Pages Architecture

Cloudflare Pages is a Jamstack platform that deploys static sites directly from a Git repository to Cloudflare's global edge network spanning 300+ cities worldwide.

### Benefits for LIZZDO:
- **Global CDN Caching**: Near-zero latency page loads for 3D models, textures, and assets.
- **Automated Continuous Integration**: Built-in webhook listeners build every commit pushed to `main`.
- **Free Unlimited Bandwidth & SSL**: Automated TLS 1.3 certificate provisioning and wildcard subdomains.
- **Instant Rollbacks**: Revert to any previous deployment with a single click.

---

## 2. Connecting GitHub Repository to Cloudflare Pages

1. Log into the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation bar, select **Workers & Pages** -> **Overview**.
3. Click **Create Application** -> Select **Pages** -> Click **Connect to Git**.
4. Log into GitHub and authorize Cloudflare to access `LIZZDO/lizzdo-website`.
5. Select the `LIZZDO/lizzdo-website` repository and click **Begin setup**.

---

## 3. Build Settings Configuration

Configure the build parameters on Cloudflare Pages as follows:

| Setting Field | Configuration Value | Explanation |
|---|---|---|
| **Project Name** | `lizzdo-website` | Subdomain created on `.pages.dev` |
| **Production Branch** | `main` | Primary branch monitored for automatic deployments |
| **Framework Preset** | `None` | Custom Vite setup |
| **Build Command** | `npm run build` | Runs sitemap generator, Vite build, and 404 fallback creation |
| **Build Output Directory**| `dist` | Directory where Vite writes production compiled assets |

---

## 4. Environment Variables on Cloudflare Pages

Configure environment variables under **Settings** -> **Environment Variables**:

| Variable Name | Value | Scope |
|---|---|---|
| `NODE_VERSION` | `20.0.0` | Build environment Node engine version |
| `GEMINI_API_KEY` | `(Your Gemini API Key)` | Server-side Gemini AI service key |
| `APP_URL` | `https://lizzdo.com` | Production canonical site URL |

---

## 5. Single Page Application (SPA) Routing & Fallbacks

Because React Router handles client-side route navigation (`/services`, `/portfolio`, `/blog`, `/admin`), direct page refreshes on non-root paths would return a `404 Not Found` error unless configured to serve `index.html`.

LIZZDO handles SPA routing through two complementary mechanisms:

### Method 1: `wrangler.jsonc` Assets Rules
```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "lizzdo-website",
  "compatibility_date": "2024-11-01",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  },
  "compatibility_flags": [
    "nodejs_compat"
  ]
}
```
`not_found_handling: "single-page-application"` instructs Cloudflare Workers Assets to serve `index.html` with an HTTP status code of `200` for all non-static URL requests without needing custom `_redirects` rules (which can cause infinite loop errors in Cloudflare Workers Assets).

### Method 2: `dist/404.html` SPA Fallback
The build command creates `dist/404.html` copied from `dist/index.html` to serve as the SPA fallback on GitHub Pages and static web servers.

---

## 6. Edge Security Headers (`public/_headers`)

Cloudflare Pages enforces security and caching headers via `/public/_headers`:

```text
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/uploads/*
  Cache-Control: public, max-age=2592000, stale-while-revalidate=86400

/admin/*
  Cache-Control: no-cache, no-store, must-revalidate
```

---

## 7. Custom Domain Setup on Cloudflare DNS

1. In Cloudflare Pages, go to **Custom Domains** -> Click **Set up a Custom Domain**.
2. Enter your custom domain: `lizzdo.com`.
3. Click **Continue**.
4. Repeat for `www.lizzdo.com`.
5. Cloudflare automatically configures the necessary DNS CNAME alias records in Cloudflare DNS:

| Type | Name | Target | Proxy Status |
|---|---|---|---|
| `CNAME` | `@` | `lizzdo-website.pages.dev` | Proxied (Orange Cloud) |
| `CNAME` | `www` | `lizzdo-website.pages.dev` | Proxied (Orange Cloud) |

---

## 8. Deployment Verification & Rollbacks

### Verifying Deployments
- Check deployment status under **Workers & Pages** -> **lizzdo-website** -> **Deployments**.
- Every deployment produces a preview URL (e.g., `https://<hash>.lizzdo-website.pages.dev`).

### Rolling Back a Deployment
If an invalid commit or broken content breaks production:
1. Navigate to **Deployments** in Cloudflare Pages.
2. Locate the most recent stable deployment.
3. Click the **three dots (...)** menu on the right -> Select **Rollback to this deployment**.
4. The production edge network immediately reverts to that build without requiring a new Git commit.
