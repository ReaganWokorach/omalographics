# Setup Guide — Omalo Graphics Website on Netlify

This site is fully built and tested, but a few things need setup only you
can do (Netlify account, form notification email, domain linking). Everything
below is one-time. Follow it top to bottom before going live.

You're buying the domain through **Cloudflare Registrar** but hosting on
**Netlify** — that's a completely normal split (registrar and host don't
have to be the same company) and is covered in step 4.

---

## 1. Deploy the site to Netlify

1. Push this folder to a GitHub/GitLab/Bitbucket repo (or use Netlify's
   drag-and-drop deploy for a one-off, though Git is better long-term since
   every push auto-deploys).
2. Netlify dashboard → **Add new site → Import an existing project**,
   connect the repo.
3. Build settings (Netlify should auto-detect these from `netlify.toml`,
   but confirm):
   - **Build command:** leave empty — nothing to build. HTML/CSS/JS are
     already committed as-is (CSS/JS are pre-minified).
   - **Publish directory:** `.` (the repo root)
4. Deploy. Your site is live at `<random-name>.netlify.app` right away —
   you can rename that subdomain (Site configuration → General → Site
   details → Change site name) or skip straight to the custom domain in
   step 4.

---

## 2. Turn on form notifications (this is the whole "backend")

Netlify Forms handles this site's contact form natively — no serverless
function, no API keys, no email service to configure. Here's why it just
works: `contact.html`'s `<form>` tag carries a `data-netlify="true"`
attribute, and Netlify scans the published HTML for that at deploy time,
registers a form named **"contact"**, and from then on every submission is
captured automatically.

To get emailed when someone submits:

1. Netlify dashboard → your site → **Forms** (in the left sidebar once the
   site's deployed and the form has been detected).
2. You should see **"contact"** listed as a detected form. If it's not
   there, re-deploy — form detection only happens during a deploy, not
   retroactively.
3. **Forms → Notifications → Add notification → Email notification.**
4. Enter the inbox you actually want enquiries sent to (Gmail, Workspace,
   whatever you check). Netlify sends every new submission there
   automatically going forward — no confirmation email/DNS step required,
   since Netlify sends the notification itself rather than sending "as"
   your domain.
5. That's it. No environment variables, no account IDs, no tokens.

> **Note on spam protection:** the form has a hidden honeypot field
> (`website`), wired up two ways — `data-netlify-honeypot="website"` on the
> `<form>` tag makes Netlify silently drop any submission that fills it
> (bots tend to fill every field they find; real visitors never see it),
> and the same check also happens client-side in `js/script.js` for a fast,
> no-network-request rejection. Between the two, this covers basic and
> moderate bot traffic without needing a CAPTCHA. If you start getting
> spam that gets past this, Netlify's paid tiers offer a reCAPTCHA option
> you can add to the form later.

---

## 3. Test the contact form before launch

Once step 2 is done and the site is deployed:

1. Open your live URL → Contact page → submit the form yourself with a
   real message.
2. Confirm the email notification arrives at the inbox you set in step 2.4.
3. If it doesn't arrive:
   - Netlify dashboard → **Forms → contact** — you should see your test
     submission listed there even if the email notification didn't fire.
     If the submission itself is missing, the form wasn't detected
     correctly (see the troubleshooting note below).
   - If the submission is listed but no email arrived, double-check the
     notification email address in Forms → Notifications, and check spam.

**If the "contact" form never shows up under Forms at all:** the most
common cause is the hidden `form-name` input going missing from
`contact.html`, or `data-netlify="true"` being removed from the `<form>`
tag — both are required for Netlify's HTML scan to register the form.
Check `contact.html` still has:
```html
<form ... name="contact" data-netlify="true" data-netlify-honeypot="website">
  <input type="hidden" name="form-name" value="contact">
```

---

## 4. Point your domain at Netlify (bought via Cloudflare Registrar)

Since the domain is registered at Cloudflare but the site lives on Netlify,
you have two options. **Option A is simpler and recommended** unless you
have a specific reason to keep Cloudflare's DNS/CDN features.

### Option A — Use Netlify DNS (recommended)

This moves DNS management to Netlify (registration stays with Cloudflare —
those are separate things). Netlify then auto-provisions and renews the TLS
certificate for you with zero manual record entry.

1. Netlify dashboard → your site → **Domain management → Add a domain**,
   enter `omalographics.com`.
2. Netlify offers to set it up with **Netlify DNS** — accept this. It shows
   you a set of nameservers, something like:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```
   (Netlify will show your actual assigned ones — use those, not this
   example.)
3. Cloudflare dashboard → **Domain Registration → your domain → Manage
   DNS/Nameservers** (or **Domains → your domain → DNS/Nameservers**) →
   change from Cloudflare's nameservers to the four Netlify ones from
   step 2.
4. Nameserver changes typically take a few hours to propagate globally
   (occasionally up to 24–48 hours). Netlify's dashboard will show the
   domain status change from "Awaiting DNS propagation" to verified once
   it's done, and HTTPS provisions automatically right after.
5. Back in Netlify, add `www.omalographics.com` too if you want both the
   bare domain and `www` to work — Netlify will offer to set up a redirect
   from one to the other.

### Option B — Keep Cloudflare DNS, just point records at Netlify

Use this only if you need Cloudflare-specific features (their CDN/WAF/
proxying) alongside Netlify hosting. You manage the TLS certificate
yourself in this setup, and it's more moving parts for no benefit on a
site like this — Option A is genuinely simpler here.

1. Netlify dashboard → your site → **Domain management → Add a domain**,
   enter your domain. Netlify will show you the target values.
2. Cloudflare dashboard → **DNS → Records** for your domain, add:
   - An **A record** for `@` (root) pointing at Netlify's load balancer IP
     (Netlify's dashboard shows the current one — this can change, which
     is part of why Option A avoids the hassle).
   - A **CNAME record** for `www` pointing at your `<site>.netlify.app`
     address.
3. **Important:** set both records' proxy status to **DNS only** (grey
   cloud, not orange) in Cloudflare — if Cloudflare proxies traffic first,
   Netlify can't issue a TLS certificate for the domain and you'll get
   certificate errors.
4. Wait for propagation, then confirm in Netlify's Domain management that
   the domain shows as verified with HTTPS active.

---

## 5. After you edit `css/styles.css` or `js/script.js`

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

## 6. If you add new external resources later

The Content-Security-Policy in `_headers` only allows scripts/styles/images/
fonts from a specific, tight list of origins (itself, Google Fonts,
Google Maps). If you embed something new — a video, a booking widget,
another analytics tool, Netlify's optional reCAPTCHA for forms — it will be
**silently blocked** by the browser until you add its origin to the
matching directive in `_headers`. Check the browser console for a "Refused
to ... because it violates the following Content Security Policy directive"
message if something you add stops working.

---

## 7. Quick pre-launch checklist

- [ ] Site deployed on Netlify and loading at the `.netlify.app` URL (step 1)
- [ ] "contact" form appears under Forms in the Netlify dashboard (step 2)
- [ ] Email notification configured and pointed at an inbox you actually check (step 2)
- [ ] Test submission received by email (step 3)
- [ ] Domain nameservers/DNS records point at Netlify, HTTPS shows as active (step 4)
- [ ] Replace the social media `href="#"` placeholders in the footer with your real profile links
- [ ] Replace the placeholder phone numbers / email on the Contact page and in the footer with your real ones
- [ ] If you get a real street address for the Kampala location, swap it in on the Contact page (locations list + map) and in the footer
