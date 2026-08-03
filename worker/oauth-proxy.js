/**
 * LIZZDO Decap CMS GitHub OAuth Proxy
 * Hosted on Cloudflare Workers
 *
 * Required Environment Variables in Cloudflare Worker Secrets:
 * - GITHUB_CLIENT_ID: Client ID from GitHub OAuth App
 * - GITHUB_CLIENT_SECRET: Client Secret from GitHub OAuth App
 * - OAUTH_ENDPOINT: (Optional) Defaults to https://github.com/login/oauth/access_token
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/$/, "") || "/";

    // Handle CORS OPTIONS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Route 1: Initial Auth Redirect (/auth or /auth/)
    if (pathname === "/auth") {
      const clientId = env.GITHUB_CLIENT_ID || "";
      const redirectUri = `${url.origin}/callback`;
      const scope = url.searchParams.get("scope") || "repo,user";

      if (!clientId || clientId === "GITHUB_CLIENT_ID") {
        return new Response("Configuration Error: GITHUB_CLIENT_ID missing in Worker secrets.", {
          status: 500,
          headers: { ...CORS_HEADERS, "Content-Type": "text/plain" },
        });
      }

      const authUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
        clientId
      )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

      return Response.redirect(authUrl, 302);
    }

    // Route 2: GitHub OAuth Callback Handler (/callback or /callback/)
    if (pathname === "/callback") {
      const code = url.searchParams.get("code");
      const errorParam = url.searchParams.get("error");
      const errorDescription = url.searchParams.get("error_description");

      if (errorParam) {
        return new Response(`GitHub OAuth Error: ${errorDescription || errorParam}`, {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "text/plain" },
        });
      }

      if (!code) {
        return new Response("Missing authorization code from GitHub", {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "text/plain" },
        });
      }

      try {
        const tokenEndpoint = env.OAUTH_ENDPOINT || "https://github.com/login/oauth/access_token";
        const tokenResponse = await fetch(tokenEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "LIZZDO-CMS-OAuth-Worker",
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code: code,
          }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error || !tokenData.access_token) {
          const errMsg = tokenData.error_description || tokenData.error || "Failed to acquire token from GitHub";
          const errorHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>LIZZDO CMS Auth Error</title>
              <style>
                body { font-family: system-ui, sans-serif; background: #0f172a; color: #f87171; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                .box { text-align: center; border: 1px solid #ef4444; padding: 2rem; border-radius: 1rem; background: #1e293b; max-width: 480px; }
              </style>
            </head>
            <body>
              <div class="box">
                <h2>Authentication Failed</h2>
                <p>${errMsg}</p>
                <p style="color: #94a3b8; font-size: 0.875rem;">Please check GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Worker settings.</p>
              </div>
            </body>
            </html>
          `;
          return new Response(errorHtml, {
            status: 400,
            headers: { ...CORS_HEADERS, "Content-Type": "text/html;charset=UTF-8" },
          });
        }

        const token = tokenData.access_token;

        const responseHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Authorizing Decap CMS</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; background: #090d16; color: #38bdf8; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .box { text-align: center; border: 1px solid #0284c7; padding: 2.5rem; border-radius: 1rem; background: #0f172a; box-shadow: 0 0 40px rgba(56,189,248,0.15); }
              .spinner { width: 32px; height: 32px; border: 3px solid rgba(56,189,248,0.2); border-top-color: #38bdf8; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 1rem auto 0; }
              @keyframes spin { to { transform: rotate(360deg); } }
            </style>
          </head>
          <body>
            <div class="box">
              <h2 style="margin: 0 0 0.5rem; color: #f8fafc;">Authentication Successful</h2>
              <p style="margin: 0; color: #94a3b8;">Connecting to Decap CMS dashboard...</p>
              <div class="spinner"></div>
            </div>
            <script>
              (function() {
                var provider = "github";
                var token = ${JSON.stringify(token)};
                var authData = JSON.stringify({ token: token, provider: provider });
                var successMessage = "authorization:" + provider + ":success:" + authData;

                function postToOpener(targetOrigin) {
                  if (window.opener && !window.opener.closed) {
                    try {
                      window.opener.postMessage(successMessage, targetOrigin || "*");
                    } catch (e) {
                      console.error("Error posting message to opener:", e);
                    }
                  }
                }

                function handleMessage(e) {
                  console.log("Decap CMS message received:", e.data);
                  postToOpener(e.origin);
                  cleanupAndClose();
                }

                function cleanupAndClose() {
                  window.removeEventListener("message", handleMessage, false);
                  setTimeout(function() {
                    if (window.opener && !window.closed) {
                      window.close();
                    }
                  }, 500);
                }

                window.addEventListener("message", handleMessage, false);

                if (window.opener) {
                  // 1. Send Netlify Authenticator handshake message
                  window.opener.postMessage("authorizing:" + provider, "*");

                  // 2. Immediately broadcast token success message to opener
                  postToOpener("*");

                  // 3. Retry broadcasts at progressive intervals in case opener was re-focusing
                  setTimeout(function() { postToOpener("*"); }, 200);
                  setTimeout(function() { postToOpener("*"); }, 600);
                  setTimeout(function() { postToOpener("*"); }, 1200);

                  // 4. Fallback auto-close after 3.5 seconds
                  setTimeout(function() {
                    if (!window.closed) {
                      window.close();
                    }
                  }, 3500);
                }
              })();
            </script>
          </body>
          </html>
        `;

        return new Response(responseHtml, {
          headers: { ...CORS_HEADERS, "Content-Type": "text/html;charset=UTF-8" },
        });
      } catch (err) {
        return new Response(`OAuth Proxy Server Exception: ${err.message}`, {
          status: 500,
          headers: { ...CORS_HEADERS, "Content-Type": "text/plain" },
        });
      }
    }

    // Default status response for root / health check
    return new Response("LIZZDO Decap CMS OAuth Proxy Worker is Operational", {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "text/plain" },
    });
  },
};
