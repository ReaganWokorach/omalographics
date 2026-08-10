# Setup Guide — Omalo Graphics Website on Cloudflare Pages

This site is fully built and tested, but a few things need values only you
can provide (API keys, your inbox address, etc.). Everything below is a
one-time setup. Follow it top to bottom before going live.

Since you're buying your domain through Cloudflare Registrar, it'll already
sit on Cloudflare's own nameservers by default — which is exactly what
Email Service (step 3) requires anyway, so that part needs no extra setup.

---

## 1. Deploy the site to Cloudflare Pages

1. Push this folder to a GitHub/GitLab repo (or use direct upload).
2. In the Cloudflare dashboard: **Compute & AI → Workers & Pages → Create →
   Pages → Connect to Git**, select the repo.
3. Build settings:
   - **Build command:** leave empty (nothing to build — HTML/CSS/JS are already
     minified and committed).
   - **Build output directory:** `/`
4. Deploy. Your site will be live at `<project>.pages.dev` immediately —
   custom domain comes in step 6. The Pages Function in `functions/api/
   contact.js` deploys automatically along with the static site, no extra
   configuration needed for that part.

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
   `TURNSTILE_SECRET_KEY`) — this is what `functions/api/contact.js` uses
   to actually verify the token server-side. The widget alone proves
   nothing without this check.

---

## 3. Turn on Cloudflare Email Service (for the contact form)

This lets the site email you directly with no third-party API key.

1. Dashboard → **Compute & AI → Email Service → Email Sending**.
2. Select **Onboard Domain** and choose your domain. Cloudflare adds a
   couple of DNS records automatically (SPF, DKIM, DMARC) since your domain
   is already on Cloudflare DNS.
3. DNS changes usually complete within 5–15 minutes, but can take up to 24
   hours to fully propagate.
4. Verify the **destination address** you want enquiries sent to (the inbox
   you'll actually read — e.g. your Gmail or Workspace address). You'll get
   a confirmation email to click.
5. That's it — no separate API key needed. The `SEND_EMAIL` binding in
   `wrangler.toml` handles the rest, and `functions/api/contact.js` sends
   through it using Email Service's structured `send()` API.

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

## 5. Test the contact form before launch

Once steps 2–4 are done and redeployed:

1. Open your `.pages.dev` URL → Contact page → submit the form yourself
   with a real message.
2. Confirm the email arrives at the inbox you set as `CONTACT_EMAIL_TO`.
3. If it doesn't arrive, check **Workers & Pages → your project →
   Functions → Real-time Logs** while you submit again — errors from
   `functions/api/contact.js` (bad Turnstile key, unverified sender, etc.)
   show up there immediately.

---

## 6. Point your domain at the site

Dashboard → your Pages project → **Custom domains → Set up a custom domain**,
add `www.omalographics.com` (and `omalographics.com` with a redirect to
`www`, or vice versa — whichever you prefer as canonical). Cloudflare Pages
issues and renews the TLS certificate automatically, and since the domain
is already on Cloudflare DNS (bought via Cloudflare Registrar), this step
is just a couple of clicks with no external DNS changes needed.

---

## 7. After you edit `css/styles.css` or `js/script.js`

The site ships minified copies (`styles.min.css`, `script.min.js`) that the
HTML actually loads, for speed. Regenerate them after any edit:

```bash
npm install
npm run minify
```

Commit both the source files and the regenerated `.min` files, and bump the
`?v=` number on the affected `<link>`/`<script>` tags across all HTML pages
so visitors' browsers don't keep serving a cached, out-of-date copy.

---

## 8. If you add new external resources later

The Content-Security-Policy in `_headers` only allows scripts/styles/images/
fonts from a specific, tight list of origins (itself, Google Fonts,
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
- [ ] Submitted the contact form yourself once, confirmed you receive the email (step 5)
- [ ] Custom domain attached, site loads over `https://` (step 6)
- [ ] Replace the social media `href="#"` placeholders in the footer with your real profile links
- [ ] Replace the placeholder phone numbers / email on the Contact page and in the footer with your real ones
- [ ] If you get a real street address for the Kampala location, swap it in on the Contact page (locations list + map) and in the footer
