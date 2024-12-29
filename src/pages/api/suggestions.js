import ky from 'ky';

const cache = new Map();
const CACHE_TTL = 300000; // Cache time-to-live of 5 minutes
const REQUEST_TIMEOUT = 1000; // Timeout of 1000 milliseconds

export async function GET({ request }) {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('q');

    if (!searchQuery) {
        return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const cachedResponse = cache.get(searchQuery);
    if (cachedResponse && (Date.now() - cachedResponse.timestamp < CACHE_TTL)) {
        return new Response(JSON.stringify(cachedResponse.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const response = await ky.get(`https://duckduckgo.com/ac/?q=${encodeURIComponent(searchQuery)}`, { timeout: REQUEST_TIMEOUT }).json();

        cache.set(searchQuery, { data: response, timestamp: Date.now() });
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
