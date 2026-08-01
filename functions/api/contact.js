// POST /api/contact
// Verifies a Cloudflare Turnstile token, validates the submitted fields,
// then emails a notification to the site owner using Cloudflare Email Service
// (the SEND_EMAIL binding configured in wrangler.toml).
//
// Required environment variables / secrets (set in the Cloudflare Pages
// dashboard under Settings > Environment variables, or via `wrangler pages secret put`):
//   TURNSTILE_SECRET_KEY   - secret key for your Turnstile widget
//   CONTACT_EMAIL_TO       - the inbox that should receive enquiries
//   CONTACT_EMAIL_FROM     - a sender address on a domain onboarded to Email Service
//
// See SETUP.md for the full walkthrough.

const MAX_FIELD_LENGTH = 3000;
const ALLOWED_SERVICES = new Set([
  'Graphic design',
  'Printing',
  'Large format printing',
  'Corporate branding',
  'Signage and displays',
  'Event branding',
  'Promotional materials',
  'Digital and social media design',
  'Something else',
]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function onRequestPost({ request, env }) {
  try {
    // --- Same-origin guard -------------------------------------------------
    const origin = request.headers.get('origin');
    const url = new URL(request.url);
    if (origin && new URL(origin).host !== url.host) {
      return json({ ok: false, error: 'Invalid origin.' }, 403);
    }

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return json({ ok: false, error: 'Unsupported content type.' }, 415);
    }

    const body = await request.json();

    // --- Honeypot: bots tend to fill every field, including hidden ones ---
    if (body.website) {
      // Silently pretend success so bots don't learn to skip this field.
      return json({ ok: true });
    }

    // --- Required fields -----------------------------------------------
    const name = String(body.name || '').trim();
    const contact = String(body.email || '').trim();
    const service = String(body.service || '').trim();
    const message = String(body.message || '').trim();
    const token = String(body.turnstileToken || '').trim();

    if (!name || !contact) {
      return json({ ok: false, error: 'Name and a way to reach you are required.' }, 400);
    }
    if (name.length > 200 || contact.length > 200 || message.length > MAX_FIELD_LENGTH) {
      return json({ ok: false, error: 'One of the fields is too long.' }, 400);
    }
    if (service && !ALLOWED_SERVICES.has(service)) {
      return json({ ok: false, error: 'Invalid service selection.' }, 400);
    }
    if (!token) {
      return json({ ok: false, error: 'Please complete the verification challenge.' }, 400);
    }

    // --- Verify Turnstile token server-side -----------------------------
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: request.headers.get('cf-connecting-ip') || undefined,
      }),
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return json({ ok: false, error: 'Verification failed. Please try again.' }, 403);
    }

    // --- Send the notification email ------------------------------------
    if (env.SEND_EMAIL && env.CONTACT_EMAIL_TO && env.CONTACT_EMAIL_FROM) {
      const subject = `New enquiry from ${name} — omalographics.com`;
      const text = [
        `New contact form submission`,
        ``,
        `Name: ${name}`,
        `Reach them at: ${contact}`,
        `Service: ${service || 'Not specified'}`,
        ``,
        `Message:`,
        message || '(no message provided)',
      ].join('\n');

      const html = `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Reach them at:</strong> ${escapeHtml(contact)}</p>
        <p><strong>Service:</strong> ${escapeHtml(service || 'Not specified')}</p>
        <p><strong>Message:</strong><br>${escapeHtml(message || '(no message provided)').replace(/\n/g, '<br>')}</p>
      `.trim();

      await env.SEND_EMAIL.send({
        to: [{ email: env.CONTACT_EMAIL_TO }],
        from: { email: env.CONTACT_EMAIL_FROM, name: 'Omalo Graphics Website' },
        subject,
        text,
        html,
      });
    } else {
      // Misconfiguration — don't fail the visitor's request silently without a trace.
      console.error('Email not sent: missing SEND_EMAIL binding or CONTACT_EMAIL_TO/FROM env vars.');
      return json({ ok: false, error: 'The enquiry could not be delivered. Please try again shortly.' }, 500);
    }

    return json({ ok: true });
  } catch (err) {
    console.error('contact function error:', err);
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, 500);
  }
}

// Reject any method other than POST.
export async function onRequestGet() {
  return json({ ok: false, error: 'Method not allowed.' }, 405);
}
