/* =========================================================
   POST /api/contact
   Cloudflare Pages Function backing the contact form on
   contact.html. Validates the submission, then sends a
   notification email through Cloudflare Email Service using
   the send_email binding's structured send() API.

   Spam defense is the honeypot field only (see the "website"
   check below, mirrored client-side in js/script.js). There
   is no CAPTCHA/bot-verification step on this endpoint.

   Required environment (see SETUP.md):
     - env.SEND_EMAIL            (send_email binding, wrangler.toml)
     - env.CONTACT_EMAIL_TO      (destination inbox)
     - env.CONTACT_EMAIL_FROM    (must be on your Email Service domain)
   ========================================================= */

const JSON_HEADERS = { 'Content-Type': 'application/json' };

function json(body, status) {
  return new Response(JSON.stringify(body), { status: status, headers: JSON_HEADERS });
}

function clean(value) {
  // Strips CR/LF so a crafted field value can't inject extra header lines.
  return String(value || '').replace(/[\r\n]+/g, ' ').trim();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch (err) {
    return json({ error: 'Invalid request body' }, 400);
  }

  // Honeypot: real visitors never see or fill this field. Mirrors the
  // client-side check in js/script.js as defense in depth, in case the
  // request ever reaches this endpoint some other way than the real form.
  if (data.website) {
    return json({ ok: true }, 200);
  }

  const name = clean(data.name).slice(0, 200);
  const email = clean(data.email).slice(0, 200);
  const service = clean(data.service).slice(0, 100);
  const message = String(data.message || '').slice(0, 5000).trim();

  if (!name || !email) {
    return json({ error: 'Missing required fields' }, 400);
  }

  const to = env.CONTACT_EMAIL_TO;
  const from = env.CONTACT_EMAIL_FROM;

  if (!to || !from) {
    return json({ error: 'Server is not configured' }, 500);
  }

  const textBody =
    'New enquiry from the website contact form\n\n' +
    'Name: ' + name + '\n' +
    'Email/phone: ' + email + '\n' +
    'Service: ' + (service || 'Not specified') + '\n\n' +
    'Message:\n' +
    (message || '(no message provided)');

  const htmlBody =
    '<p>New enquiry from the website contact form</p>' +
    '<p><strong>Name:</strong> ' + escapeHtml(name) + '<br>' +
    '<strong>Email/phone:</strong> ' + escapeHtml(email) + '<br>' +
    '<strong>Service:</strong> ' + escapeHtml(service || 'Not specified') + '</p>' +
    '<p><strong>Message:</strong><br>' +
    escapeHtml(message || '(no message provided)').replace(/\n/g, '<br>') + '</p>';

  try {
    await env.SEND_EMAIL.send({
      to: to,
      from: { email: from, name: 'Omalo Graphics Website' },
      subject: 'New enquiry from ' + name,
      text: textBody,
      html: htmlBody
    });
  } catch (err) {
    return json({ error: 'Could not send email' }, 502);
  }

  return json({ ok: true }, 200);
}

export async function onRequestGet() {
  return json({ error: 'Method not allowed' }, 405);
}
