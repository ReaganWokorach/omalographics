# Setup Guide — Omalo Graphics Website on Netlify

This site is fully built and tested, but a few things need values only you can
provide (your inbox address, your real social links, etc.). Everything below
is a one-time setup. Follow it top to bottom before going live.

---

## 1. Deploy the site to Netlify

1. Push this folder to a GitHub/GitLab/Bitbucket repo (or drag-and-drop the
   folder straight into the Netlify dashboard for a manual deploy).
2. In the Netlify dashboard: **Add new site → Import an existing project**,
   select the repo.
3. Build settings:
   - **Build command:** leave empty (nothing to build — HTML/CSS/JS are
     already minified and committed).
   - **Publish directory:** `/`
4. Deploy. Your site will be live at `<your-site-name>.netlify.app`
   immediately — custom domain comes in step 3.

---

## 2. Turn on form notifications (for the contact form)

The contact form uses **Netlify Forms** — Netlify detects the form
automatically at build time (it looks for `data-netlify="true"` on the
`<form>` tag in `contact.html`, which is already there) and stores every
submission in your dashboard. No API key, backend, or extra service needed.

1. Dashboard → your site → **Forms**. After your first deploy, a form named
   `contact` should appear here automatically. If it doesn't show up, trigger
   a fresh deploy (Netlify only scans HTML on deploy, not live edits).
2. **Forms → Settings and usage → Form notifications → Add notification →
   Email notification.** Enter the inbox you want enquiries sent to. This is
   the only step required to actually get the emails.
3. Submissions also stay visible in the dashboard under **Forms → contact**
   even without email notifications on.
4. Built-in spam filtering (Akismet) is on by default for every Netlify
   Forms site. The form also has a hidden honeypot field (`website`) as a
   second, simple layer — real visitors never see or fill it, so any
   submission with it filled is silently discarded.

---

## 3. Point your domain at the site

Dashboard → your site → **Domain management → Add a custom domain**, add
`www.omalographics.com` (and `omalographics.com` with a redirect to `www`,
or vice versa — whichever you prefer as canonical). Netlify issues and
renews the TLS certificate automatically.

---

## 4. After you edit `css/styles.css` or `js/script.js`

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

## 5. If you add new external resources later

The Content-Security-Policy in `_headers` only allows scripts/styles/images/
fonts from a specific, tight list of origins (itself, Google Fonts, Google
Maps). If you embed something new — a video, a booking widget, an analytics
tool — it will be **silently blocked** by the browser until you add its
origin to the matching directive in `_headers`. Check the browser console
for a "Refused to ... because it violates the following Content Security
Policy directive" message if something you add stops working.

---

## 6. Quick pre-launch checklist

- [ ] Form notification email set up in Forms settings (step 2)
- [ ] Submit the contact form yourself once, confirm the submission appears
      under Forms and (if configured) the notification email arrives
- [ ] Custom domain attached, site loads over `https://` (step 3)
- [ ] Replace the social media `href="#"` placeholders in the footer with
      your real profile links
- [ ] Replace the placeholder phone numbers / email on the Contact page and
      in the footer with your real ones
- [ ] If you get a real street address for the Kampala location, swap it in
      on the Contact page (locations list + map) and in the footer
