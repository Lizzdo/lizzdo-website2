# GitHub OAuth & Cloudflare Worker Auth Proxy Guide — LIZZDO

This document explains the **GitHub OAuth architecture** and the serverless **Cloudflare Worker OAuth Proxy** required to securely authenticate editors using Decap CMS.

---

## 1. Why an OAuth Proxy is Required

Decap CMS runs entirely inside the editor's web browser as a Single-Page Application (SPA). During the GitHub OAuth 2.0 Web Application Flow:

1. The user clicks **Login with GitHub** in Decap CMS.
2. The user is redirected to GitHub to authorize access.
3. GitHub redirects back with a temporary authorization `code`.
4. Decap CMS must exchange this `code` for an `access_token` by making a POST request to `https://github.com/login/oauth/access_token`.

⚠️ **The Security Problem**: GitHub's token endpoint requires sending both the `client_id` AND the `client_secret`. Client-side JavaScript running in a web browser **cannot** safely hold or hide a `client_secret`. If the client secret were included in frontend code, any user could view source code or open browser DevTools to steal it and compromise the repository.

✅ **The Solution**: A lightweight, serverless **Cloudflare Worker Proxy** holds the `client_secret` in secure encrypted environment variables. It handles the server-to-server token exchange with GitHub and safely posts the resulting token back to the Decap CMS window using the HTML5 `postMessage` API.

---

## 2. OAuth Authentication Flow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Editor as Editor Browser
    participant Decap as Decap CMS (/admin)
    participant Worker as Cloudflare Worker Proxy
    participant GitHub as GitHub OAuth Service
    participant Repo as GitHub REST API

    Editor->>Decap: Open /admin & Click "Login with GitHub"
    Decap->>Worker: Redirect to https://lizzdo-cms-auth.lets3do.workers.dev/auth
    Worker->>GitHub: Redirect to https://github.com/login/oauth/authorize?client_id=...&scope=repo,user
    GitHub-->>Editor: Display GitHub Grant Permission Screen
    Editor->>GitHub: Click "Authorize LIZZDO"
    GitHub->>Worker: Redirect to https://lizzdo-cms-auth.lets3do.workers.dev/callback?code=AUTH_CODE
    Worker->>GitHub: POST https://github.com/login/oauth/access_token (client_id + client_secret + AUTH_CODE)
    GitHub-->>Worker: Return JSON { access_token: "gho_xxxx" }
    Worker-->>Editor: Render HTML page with postMessage('authorization:github:success:{"token":"gho_xxxx"}')
    Editor->>Decap: Handshake completes; Decap CMS stores token in localStorage
    Decap->>Repo: Direct API calls to read/commit JSON content
```

---

## 3. Cloudflare Worker Code (`worker.js`)

Below is the complete, production-ready Cloudflare Worker script that acts as the OAuth Auth Proxy for Decap CMS:

```javascript
/**
 * LIZZDO Decap CMS GitHub OAuth Proxy
 * Hosted on Cloudflare Workers
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Endpoint 1: Initiate OAuth authentication redirect
    if (url.pathname === "/auth") {
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&scope=repo,user`;
      return Response.redirect(authUrl, 302);
    }

    // Endpoint 2: GitHub OAuth callback handler
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        return new Response("Missing authorization code from GitHub", { status: 400 });
      }

      try {
        // Exchange authorization code for access token with GitHub
        const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "LIZZDO-CMS-OAuth-Worker"
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code: code,
          }),
        });

        const tokenData = await tokenResponse.json();
        const token = tokenData.access_token;

        if (!token) {
          return new Response(JSON.stringify(tokenData), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        // Return HTML popup script that posts token back to Decap CMS window
        const responseHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>LIZZDO CMS Authentication Success</title>
            <style>
              body { font-family: system-ui, sans-serif; background: #0b0f19; color: #00f0ff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .box { text-align: center; border: 1px solid #00f0ff; padding: 2rem; border-radius: 1rem; box-shadow: 0 0 20px rgba(0,240,255,0.2); }
            </style>
          </head>
          <body>
            <div class="box">
              <h2>AUTHENTICATION SUCCESSFUL</h2>
              <p>Completing login handshake with Decap CMS...</p>
            </div>
            <script>
              (function() {
                function receiveMessage(e) {
                  window.opener.postMessage(
                    'authorization:github:success:${JSON.stringify({ token: token, provider: "github" })}',
                    e.origin
                  );
                }
                window.addEventListener("message", receiveMessage, false);
                window.opener.postMessage("authorizing:github", "*");
              })();
            </script>
          </body>
          </html>
        `;

        return new Response(responseHtml, {
          headers: { "Content-Type": "text/html;charset=UTF-8" },
        });
      } catch (err) {
        return new Response(`OAuth Proxy Error: ${err.message}`, { status: 500 });
      }
    }

    // Default status endpoint
    return new Response("LIZZDO Decap CMS OAuth Proxy Worker is Operational", { 
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });
  },
};
```

---

## 4. Deploying the Worker on Cloudflare

### Method A: Cloudflare Dashboard (Quickest)

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Select **Workers & Pages** -> **Overview** -> **Create application** -> **Create Worker**.
3. Set the Worker name to `lizzdo-cms-auth`.
4. Click **Deploy**.
5. Click **Edit code**, paste the `worker.js` code above, and click **Save and Deploy**.
6. Navigate to **Settings** -> **Variables and Secrets**:
   - Add Variable: `GITHUB_CLIENT_ID` = `(Your GitHub OAuth Client ID)`
   - Add Secret: `GITHUB_CLIENT_SECRET` = `(Your GitHub OAuth Client Secret)` -> Click **Encrypt & Save**.

### Method B: Wrangler CLI (Developer Workflow)

```bash
# Login to Cloudflare Wrangler
npx wrangler login

# Deploy Worker
npx wrangler deploy --name lizzdo-cms-auth worker.js

# Put secret variables
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

---

## 5. Linking Worker to Decap CMS

Once deployed, update your `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: LIZZDO/lizzdo-website
  branch: main
  base_url: https://lizzdo-cms-auth.lets3do.workers.dev
  auth_endpoint: /auth
```
