# Setup Guide — Omalo Graphics Website on Cloudflare Pages

This site is fully built and tested, but a few things need values only you can
provide (API keys, your inbox address, etc.). Everything below is a one-time
setup. Follow it top to bottom before going live.

---

## 1. Deploy the site to Cloudflare Pages

1. Push this folder to a GitHub/GitLab repo (or use direct upload).
2. In the Cloudflare dashboard: **Compute (Workers & Pages) → Create → Pages
   → Connect to Git**, select the repo.
3. Build settings:
   - **Build command:** leave empty (nothing to build — HTML/CSS/JS are already
     minified and committed).
   - **Build output directory:** `/`
4. Deploy. Your site will be live at `<project>.pages.dev` immediately —
   custom domain comes in step 6.

---

## 2. Turn on Cloudflare Turnstile (spam/bot protection on the contact form)

1. Dashboard → **Turnstile** → **Add widget**.
2. Domain: your site's domain (e.g. `omalographics.com`).
3. Widget mode: **Managed** (recommended).
4. Copy the **Site Key** and **Secret Key** it gives you.
5. Open `contact.html`, find this line near the bottom of the form:
   ```html
   <div class="cf-turnstile" data-sitekey="1x00000000000000000000AA" data-theme="light"></div>
   ```
   Replace `1x00000000000000000000AA` with your real **Site Key**.
   > That placeholder is Cloudflare's public "always passes" test key — it
   > works for testing but provides **no real protection**. Swap it before
   > launch.
6. Add the **Secret Key** as a Pages secret (step 4 below,
   `TURNSTILE_SECRET_KEY`).

---

## 3. Turn on Cloudflare Email Service (for the contact form + uptime alerts)

This lets the site email you directly with no third-party API key.

1. Dashboard → **Compute (Workers & Pages) → Email Service → Email Sending**.
2. Follow the prompts to onboard your domain (this adds a couple of DNS
   records Cloudflare manages automatically if your domain's nameservers are
   already on Cloudflare).
3. Verify the **destination address** you want enquiries sent to (the inbox
   you'll actually read — e.g. your Gmail or Workspace address). You'll get a
   confirmation email to click.
4. That's it — no separate API key needed. The `SEND_EMAIL` binding in
   `wrangler.toml` handles the rest.

---

## 4. Set environment variables & secrets for the main site

Dashboard → your Pages project → **Settings → Environment variables**.

| Name | Type | Value |
|---|---|---|
| `CONTACT_EMAIL_TO` | Plaintext | The inbox you verified in step 3 |
| `CONTACT_EMAIL_FROM` | Plaintext | e.g. `noreply@omalographics.com` (must be on the domain you onboarded to Email Service) |
| `TURNSTILE_SECRET_KEY` | **Secret (encrypt)** | The Secret Key from step 2 |

Set these for both **Production** and **Preview** environments. Redeploy
after saving (env var changes need a new deployment to take effect).

> `wrangler.toml` also has placeholder values for `CONTACT_EMAIL_TO` /
> `CONTACT_EMAIL_FROM` — those are just local-dev fallbacks. The dashboard
> values above are what production actually uses.

---

## 5. Deploy the uptime monitor (separate Worker)

Cloudflare Pages can't run on a schedule — only Workers can — so the uptime
checker is a small separate Worker in `/uptime-monitor`. Deploy it once from
your machine:

```bash
cd uptime-monitor
npx wrangler kv namespace create UPTIME_STATE
```

Copy the `id` it prints into `uptime-monitor/wrangler.toml`, replacing
`REPLACE_WITH_YOUR_KV_NAMESPACE_ID`. Then edit the `[vars]` block in that
same file:

```toml
[vars]
TARGET_URL = "https://www.omalographics.com/api/health"   # your real domain
ALERT_EMAIL_TO = "you@yourdomain.com"                      # where alerts go
ALERT_EMAIL_FROM = "alerts@yourdomain.com"                 # on your onboarded domain
```

Then deploy:

```bash
npx wrangler deploy
```

It will now check the site every 5 minutes and email you only when the
status **changes** (goes down, or recovers) — not on every single check.

---

## 6. Point your domain at the site

Dashboard → your Pages project → **Custom domains → Set up a custom domain**,
add `www.omalographics.com` (and `omalographics.com` with a redirect to
`www`, or vice versa — whichever you prefer as canonical). Cloudflare Pages
issues and renews the TLS certificate automatically.

---

## 7. After you edit `css/styles.css` or `js/script.js`

The site ships minified copies (`styles.min.css`, `script.min.js`) that the
HTML actually loads, for speed. Regenerate them after any edit:

```bash
npm install
npm run minify
```

Commit both the source files and the regenerated `.min` files.

---

## 8. If you add new external resources later

The Content-Security-Policy in `_headers` only allows scripts/styles/images/
fonts from a specific, tight list of origins (itself, Google Fonts, Unsplash,
Cloudflare Turnstile, Google Maps). If you embed something new — a video, a
booking widget, another analytics tool — it will be **silently blocked** by
the browser until you add its origin to the matching directive in `_headers`.
Check the browser console for a "Refused to ... because it violates the
following Content Security Policy directive" message if something you add
stops working.

---

## 9. Quick pre-launch checklist

- [ ] Turnstile site key swapped in `contact.html` (step 2)
- [ ] Turnstile secret key set in Pages dashboard (step 4)
- [ ] Email Service onboarded + destination address verified (step 3)
- [ ] `CONTACT_EMAIL_TO` / `CONTACT_EMAIL_FROM` set in Pages dashboard (step 4)
- [ ] Uptime monitor Worker deployed with real KV namespace + your domain (step 5)
- [ ] Custom domain attached, site loads over `https://` (step 6)
- [ ] Submit the contact form yourself once, confirm you receive the email
- [ ] Replace the social media `href="#"` placeholders in the footer with your real profile links
