# Nginx vhosts

One file per subdomain, proxying to the matching Docker Compose service on the VPS's loopback interface.

| File | Domain | Upstream |
|---|---|---|
| `thomasboue.com.conf` | thomasboue.com | 127.0.0.1:8080 (`frontend`, production profile) |
| `api.thomasboue.com.conf` | api.thomasboue.com | 127.0.0.1:3000 (`backend`, production profile) |
| `dev.thomasboue.com.conf` | dev.thomasboue.com | 127.0.0.1:8081 (`frontend-staging`, staging profile) |
| `api.dev.thomasboue.com.conf` | api.dev.thomasboue.com | 127.0.0.1:3001 (`backend-staging`, staging profile) |

These listen on plain HTTP (port 80) only — they don't assume how TLS is terminated today (Cloudflare proxy mode vs. certbot/Origin CA at the VPS). Check the VPS's current config for `thomasboue.com` before installing these, and add whichever TLS `server` block or `certbot --nginx` step matches your existing setup.

## Install on the VPS

```bash
sudo cp infra/nginx/*.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/thomasboue.com.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.thomasboue.com.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/dev.thomasboue.com.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.dev.thomasboue.com.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Cutover sequencing — read before touching production

Today the live frontend reaches the API through a path prefix (`thomasboue.com/api`), not a subdomain. Moving to `api.thomasboue.com` is a real change to how the deployed frontend talks to the backend, not just documentation. Do these **in order**, or the live contact form and GitHub widget will start calling a URL that isn't ready yet:

1. Add DNS records in Cloudflare for `api.thomasboue.com`, `dev.thomasboue.com`, `api.dev.thomasboue.com` (`thomasboue.com` already exists).
2. Install and enable all four vhosts above, `nginx -t`, reload. At this point `api.thomasboue.com` works *in parallel* with whatever routes the API today — nothing on the live site changes yet.
3. Only then update the real `.env` on the VPS (`/opt/apps/Portfolio/.env`): `VITE_API_BASE_URL=https://api.thomasboue.com`. Add the staging equivalents (`VITE_API_BASE_URL_STAGING=https://api.dev.thomasboue.com`, `CORS_ORIGIN_STAGING=https://dev.thomasboue.com`, `POSTGRES_DB_STAGING=portfolio_staging`) at the same time — they're additive and don't affect the production profile.
4. Deploy — the rebuilt frontend image bakes in the new API URL.

Steps 1–2 are harmless to do at any time. Don't do step 3 until `api.thomasboue.com` actually resolves and proxies correctly.
