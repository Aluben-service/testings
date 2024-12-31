/**
 * Converts input into a valid search URL
 * @param {string} input - User input to search for
 * @param {string} template - Search query template with %s placeholder
 * @returns {string} Fully qualified search URL
 */
function search(input, template) {
    if (!input || typeof input !== 'string') {
        throw new Error('Invalid search input');
    }

    try {
        const directUrl = new URL(input);
        return directUrl.toString();
    } catch {}

    try {
        const httpsUrl = new URL(`https://${input}`);
        if (httpsUrl.hostname.includes('.')) {
            return httpsUrl.toString();
        }
    } catch {}

    return template.replace('%s', encodeURIComponent(input));
}



export { search };