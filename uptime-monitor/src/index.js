// Uptime monitor for the Omalo Graphics website.
//
// This is a SEPARATE Cloudflare Worker from the Pages site — Cloudflare
// Pages Functions cannot run on a schedule, only Workers can. Deploy this
// from inside the /uptime-monitor folder with `wrangler deploy`.
//
// Every few minutes (see [triggers] in wrangler.toml) it pings the site's
// /api/health endpoint. If the status flips from up->down or down->up, it
// emails an alert. State is stored in KV so it only alerts on a *change*,
// not on every single check (no spam every 5 minutes while it's down).

const STATE_KEY = 'uptime:last-status';
const TIMEOUT_MS = 10000;

export default {
  async fetch() {
    return new Response(
      'Omalo Graphics uptime monitor. This Worker runs on a schedule and does not serve site traffic.',
      { status: 200 }
    );
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(checkSite(env));
  },
};

async function checkSite(env) {
  const targetUrl = env.TARGET_URL || 'https://www.omalographics.com/api/health';
  let isUp = false;
  let detail = '';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timeout);
    isUp = res.ok;
    detail = `HTTP ${res.status}`;
  } catch (err) {
    isUp = false;
    detail = `Request failed: ${err.message || err}`;
  }

  const currentState = isUp ? 'up' : 'down';
  const previousState = env.UPTIME_STATE ? await env.UPTIME_STATE.get(STATE_KEY) : null;

  console.log(`Uptime check: ${currentState} (${detail}); previous: ${previousState || 'unknown'}`);

  if (currentState !== previousState) {
    await sendAlert(env, currentState, detail, targetUrl);
    if (env.UPTIME_STATE) {
      await env.UPTIME_STATE.put(STATE_KEY, currentState);
    }
  }
}

async function sendAlert(env, state, detail, targetUrl) {
  if (!env.SEND_EMAIL || !env.ALERT_EMAIL_TO || !env.ALERT_EMAIL_FROM) {
    console.error('Cannot send alert: missing SEND_EMAIL binding or ALERT_EMAIL_TO/ALERT_EMAIL_FROM vars.');
    return;
  }

  const subject = state === 'down'
    ? 'Website DOWN: omalographics.com'
    : 'Website RECOVERED: omalographics.com';

  const text = [
    state === 'down' ? 'Your website appears to be down.' : 'Your website is back up.',
    '',
    `Target checked: ${targetUrl}`,
    `Result: ${detail}`,
    `Time (UTC): ${new Date().toISOString()}`,
  ].join('\n');

  try {
    await env.SEND_EMAIL.send({
      to: [{ email: env.ALERT_EMAIL_TO }],
      from: { email: env.ALERT_EMAIL_FROM, name: 'Omalo Uptime Monitor' },
      subject,
      text,
    });
  } catch (err) {
    console.error('Failed to send uptime alert email:', err);
  }
}
