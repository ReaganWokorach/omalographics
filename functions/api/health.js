// GET /api/health
// Lightweight health-check endpoint.
//  - Used by the companion uptime-monitor Worker (see /uptime-monitor) to
//    confirm the site is up and functions are executing.
//  - Also available for any separate app/service you incorporate later to
//    verify this site is reachable before depending on it.

export async function onRequestGet() {
  return new Response(
    JSON.stringify({
      ok: true,
      status: 'healthy',
      service: 'omalo-graphics-website',
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    }
  );
}
