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

const searchInput = document.getElementById('search');
const suggestionsDiv = document.getElementById('suggestions');
let debounceTimeout;
const cache = new Map();

searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
        const query = e.target.value;
        if (query.length > 0) {
            if (cache.has(query)) {
                displaySuggestions(cache.get(query));
            } else {
                const response = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                cache.set(query, data);
                displaySuggestions(data);
            }
        } else {
            suggestionsDiv.innerHTML = '';
        }
    }, 300);
});

function displaySuggestions(data) {
    suggestionsDiv.style.display = 'block';
    suggestionsDiv.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (const suggestion of data.slice(0, 5)) {
        const div = document.createElement('div');
        div.className = 'suggestion';
        div.textContent = suggestion.phrase;
        div.onclick = async () => {
            searchInput.value = suggestion.phrase;
            suggestionsDiv.style.display = 'none';
            await enter();
        };
        fragment.appendChild(div);
    }
    suggestionsDiv.appendChild(fragment);
}

document.addEventListener('click', (e) => {
    if (!suggestionsDiv.contains(e.target) && e.target !== searchInput) {
        suggestionsDiv.innerHTML = '';
    }
});