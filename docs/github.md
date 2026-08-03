# GitHub Configuration & Backend Guide — LIZZDO

This document details the **GitHub repository architecture**, branching strategy, permissions, and GitHub OAuth App configuration required for Decap CMS and Cloudflare Pages integration.

---

## 1. Repository Overview & Strategy

The codebase for LIZZDO is hosted as a Git repository on GitHub:
- **Repository Name**: `LIZZDO/lizzdo-website`
- **Visibility**: Private (recommended for proprietary studio code & assets) or Public
- **Default Production Branch**: `main`

---

## 2. Directory Structure & Content Tracking

All code, styling, components, and site content reside in a single Git repository:

```text
/
├── .github/                      # GitHub Actions & issue templates (if applicable)
├── public/                       # Assets served directly at root URL
│   ├── admin/                    # Decap CMS frontend interface & configuration
│   └── uploads/                  # Media files uploaded via Decap CMS
├── src/
│   └── content/                  # Git-backed JSON & Markdown database
│       ├── blog/                 # Article entries
│       ├── clients/              # Client profiles & review ratings
│       ├── faq/                  # Accordion questions & answers
│       ├── pages/                # Single page content copy
│       ├── portfolio/            # Portfolio showcase items
│       ├── services/             # Studio service specifications
│       ├── settings/             # Site global settings
│       ├── store/                # Digital store product entries
│       └── team/                 # Studio team profiles
└── wrangler.jsonc                # Cloudflare Pages / Worker config
```

---

## 3. GitHub OAuth App Setup for Decap CMS

Decap CMS requires a **GitHub OAuth Application** to allow non-technical content editors to log into `/admin` using their GitHub account and commit changes directly to the repository without providing personal access tokens.

### Step-by-Step GitHub OAuth App Creation Guide

1. Log into your GitHub account and navigate to **Settings** -> **Developer Settings** -> **OAuth Apps**.
2. Click **New OAuth App**.
3. Fill out the application registration form with these exact settings:

| Setting Field | Value |
|---|---|
| **Application Name** | `LIZZDO CMS Authenticator` |
| **Homepage URL** | `https://lizzdo.com` |
| **Application Description** | OAuth authentication service for LIZZDO Decap CMS |
| **Authorization Callback URL** | `https://lizzdo-cms-auth.lets3do.workers.dev/callback` |

> ⚠️ **CRITICAL**: The Authorization Callback URL must match the endpoint on your Cloudflare Worker OAuth Proxy (`https://lizzdo-cms-auth.lets3do.workers.dev/callback`).

4. Click **Register Application**.
5. Copy the generated **Client ID** (e.g., `Iv1.1234567890abcdef`).
6. Click **Generate a new client secret** and copy the **Client Secret**.

---

## 4. Configuring Decap CMS with GitHub Backend

In `public/admin/config.yml`, configure the backend block:

```yaml
backend:
  name: github
  repo: LIZZDO/lizzdo-website
  branch: main
  base_url: https://lizzdo-cms-auth.lets3do.workers.dev
  auth_endpoint: /auth
```

### Explanation of Parameters:
- `name: github`: Specifies the GitHub API backend driver for Decap CMS.
- `repo: LIZZDO/lizzdo-website`: The target GitHub repository path (`Owner/Repository`).
- `branch: main`: The Git branch where content commits will be written.
- `base_url`: The domain of the Cloudflare Worker running the OAuth proxy script.
- `auth_endpoint: /auth`: The route on the Cloudflare Worker that initiates the GitHub OAuth handshake.

---

## 5. Required GitHub OAuth Scopes

The Cloudflare Worker requests the following OAuth scopes during login:
- `repo`: Required to grant write access to read, update, create, and delete content files and upload media assets in private or public repositories.
- `user`: Required to retrieve basic user profile information (email and avatar) for display inside the Decap CMS header bar.

---

## 6. Repository Branching & Protection Rules

### Main Branch Protection Strategy
To ensure system stability, set up branch protection rules on `main` via **GitHub Settings** -> **Branches**:

1. **Require status checks to pass before merging**:
   - Require `Cloudflare Pages - Build Check` to pass.
2. **Allow Decap CMS automated commits**:
   - Ensure the Decap CMS OAuth bot or account has bypass write access to push direct commits to `main`.

---

## 7. Git Workflow for Developers

### Local Development & Feature Branching
```bash
# Clone the repository
git clone https://github.com/LIZZDO/lizzdo-website.git
cd lizzdo-website

# Install dependencies
npm install

# Create a feature branch
git checkout -b feature/new-3d-model-viewer

# Test changes locally
npm run dev

# Commit and push
git add .
git commit -m "feat: added Interactive 3D Model Viewer component"
git push origin feature/new-3d-model-viewer
```
