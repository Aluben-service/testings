import ky from 'ky';

export async function GET({ request }) {
    const url = new URL(request.url);
    const blocklistUrl = url.searchParams.get('url');

    // Ensure the 'url' parameter is provided
    if (!blocklistUrl) {
        return new Response('Query parameter "url" is required', {
            status: 400
        });
    }

    try {
        const response = await ky.get(blocklistUrl).text();
        return new Response(response, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
        });
    } catch (error) {
        return new Response('Error fetching blocklist', {
            status: 500
        });
    }
}
