# Troubleshooting & Security Reference Manual — LIZZDO

This document provides step-by-step diagnostic solutions for common operational issues, build failures, authentication errors, routing glitches, and security best practices.

---

## 1. Troubleshooting Decap CMS & OAuth Login

### Issue 1: "Failed to load settings" or "Connecting to GitHub..." spinner hangs forever

#### Root Causes:
1. Invalid callback URL in GitHub OAuth App settings.
2. Incorrect `base_url` or `repo` in `public/admin/config.yml`.
3. Cloudflare Worker auth proxy missing environment variables.

#### Solutions:
- **Check GitHub OAuth Settings**:
  - Open GitHub -> **Developer Settings** -> **OAuth Apps** -> Select `LIZZDO CMS Authenticator`.
  - Verify **Authorization Callback URL** is strictly `https://lizzdo-cms-auth.lets3do.workers.dev/callback` (no trailing slash, exact HTTPS protocol).
- **Check `public/admin/config.yml`**:
  - Verify repository path: `repo: LIZZDO/lizzdo-website` (case-sensitive).
  - Verify worker URL: `base_url: https://lizzdo-cms-auth.lets3do.workers.dev`.
- **Check Cloudflare Worker Variables**:
  - Open Cloudflare -> **Workers** -> `lizzdo-cms-auth` -> **Settings** -> **Variables and Secrets**.
  - Confirm `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are properly bound.

---

### Issue 2: "API_ERROR: Not Found" or "Permission Denied" when publishing

#### Root Causes:
1. The GitHub user account logged into Decap CMS lacks write/collaborator permissions on `LIZZDO/lizzdo-website`.
2. The GitHub OAuth App token scope did not request `repo` access.

#### Solutions:
- Open GitHub -> `LIZZDO/lizzdo-website` -> **Settings** -> **Collaborators**.
- Grant write or admin access to the team member's GitHub account.
- Ask the user to log out of `/admin`, clear browser cache, and re-authenticate.

---

## 2. Troubleshooting Cloudflare Pages Build Failures

### Issue 1: `Command "npm run build" failed`

#### Common Root Causes:
1. TypeScript compilation errors (`tsc --noEmit` check in sitemap or build).
2. Missing dependencies or syntax errors in JSON files edited via Decap CMS.
3. Node version mismatch on Cloudflare Pages.

#### Diagnostic Steps:
1. Open Cloudflare Dashboard -> **Workers & Pages** -> `lizzdo-website` -> **Deployments**.
2. Click the failed build to view full execution logs.
3. If logs report `JSON.parse` error in `src/content/...`:
   - An editor entered invalid JSON or left a required field blank.
   - Open GitHub -> Inspect the last commit on `main` -> Fix or revert the broken JSON entry.
4. Set Node Version in Cloudflare Pages Environment Variables:
   - `NODE_VERSION` = `20.0.0`

---

### Issue 2: "Module not found" or "Cannot resolve import"

#### Solution:
- Ensure all custom imports in React use correct relative paths or `@/` aliases configured in `vite.config.ts` and `tsconfig.json`.
- Ensure case sensitivity matches across operating systems (macOS/Windows vs Linux Cloudflare build runners).

---

## 3. Troubleshooting SPA 404 Routing Errors

### Issue: Direct navigation or refreshing `/services/3d-modeling` returns a 404 Error page

#### Root Cause:
Single-page React Router apps require the web server to fallback to `index.html` for unknown subpaths.

#### Solutions:
- Verify `public/_redirects` contains:
  ```text
  /* /index.html 200
  ```
- Verify `wrangler.jsonc` has:
  ```json
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
  ```
- Verify `package.json` build script includes SPA fallback creation:
  ```json
  "build": "node generate-sitemap.cjs && vite build && cp dist/index.html dist/404.html"
  ```

---

## 4. Troubleshooting Missing Images or Content

### Issue: Images uploaded in Decap CMS display as broken links on the live site

#### Root Cause:
Mismatch between `media_folder` and `public_folder` paths in `public/admin/config.yml`.

#### Correct Configuration:
```yaml
media_folder: "public/uploads"
public_folder: "/uploads"
```
- `media_folder` tells Decap CMS where to commit files in the Git repository (`public/uploads/my-image.png`).
- `public_folder` tells Decap CMS what path to put in JSON files (`/uploads/my-image.png`).
- In React components, `<img src={data.thumbnail} />` resolves to `https://lizzdo.com/uploads/my-image.png`, which correctly serves the file from `/public/uploads/`.

---

## 5. Security & Access Control Best Practices

1. **Private Repository Protection**:
   - Keep `LIZZDO/lizzdo-website` private.
   - Decap CMS authentication via Worker Proxy provides safe, scoped Git access without exposing raw personal access tokens.
2. **Secrets Management**:
   - Never commit `.env` files or API keys (`GEMINI_API_KEY`, `GITHUB_CLIENT_SECRET`) to Git.
   - Keep `.env.example` as a template with placeholder values.
   - Store all production secrets in Cloudflare Pages & Worker environment variables.
3. **HTTP Security Headers**:
   - Maintain security headers in `public/_headers` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).

---

## 6. Pre-Production Final Deployment Checklist

Before launching or delivering updates to production, verify every item on this checklist:

- [ ] **TypeScript Type-Check**: Run `npm run lint` locally and ensure zero errors.
- [ ] **Production Build Test**: Run `npm run build` and `npm run preview` to verify local production bundle.
- [ ] **Automated Sitemap Test**: Confirm `/public/sitemap.xml` generates properly during build and includes all JSON routes (`services`, `portfolio`, `store`, `blog`).
- [ ] **SPA Fallback Verification**: Confirm `dist/404.html` and `dist/_redirects` exist in build output.
- [ ] **Cloudflare Environment Variables**: Confirm `GEMINI_API_KEY`, `APP_URL`, and `NODE_VERSION=20.0.0` are set.
- [ ] **GitHub OAuth Worker Test**: Confirm login at `https://lizzdo.com/admin` successfully authenticates via `lizzdo-cms-auth.lets3do.workers.dev`.
- [ ] **CMS Publish Test**: Publish a test draft in Decap CMS and verify automatic Git commit and Cloudflare build.
- [ ] **Hostinger DNS Delegation**: Confirm Hostinger domain `lizzdo.com` points to Cloudflare nameservers (`ns1.cloudflare.com`, `ns2.cloudflare.com`).
- [ ] **SSL/TLS Mode**: Confirm Cloudflare SSL mode is set to **Full (Strict)** and **Always Use HTTPS** is enabled.
- [ ] **Mobile & Performance Audit**: Verify 3D particle hero renders smoothly across desktop and mobile browsers.
