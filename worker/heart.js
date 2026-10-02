// Cloudflare Worker behind the heart on sotepedia.hu.
// Stores one number in Workers KV (binding: HEARTS). No IPs, no cookies, nothing else.
//   GET  /count -> { "count": n }
//   POST /add   -> { "count": n + 1 }

const ORIGINS = ['https://sotepedia.hu', 'https://www.sotepedia.hu', 'http://localhost:8000'];

export default {
    async fetch(request, env) {
        const origin = request.headers.get('Origin');
        const headers = {
            'Access-Control-Allow-Origin': ORIGINS.includes(origin) ? origin : ORIGINS[0],
            'Vary': 'Origin',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Content-Type': 'application/json',
        };
        if (request.method === 'OPTIONS') return new Response(null, { headers });

        const path = new URL(request.url).pathname;
        let count = parseInt(await env.HEARTS.get('count'), 10) || 0;

        if (request.method === 'POST' && path === '/add') {
            count += 1;
            await env.HEARTS.put('count', String(count));
        } else if (!(request.method === 'GET' && path === '/count')) {
            return new Response('{}', { status: 404, headers });
        }
        return new Response(JSON.stringify({ count }), { headers });
    },
};
