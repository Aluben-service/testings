
function search(input: string, template: string) {
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

	const searchInput = document.getElementById("search") as HTMLInputElement;
const suggestionsDiv = document.getElementById("suggestions") as HTMLElement;
let debounceTimeout: ReturnType<typeof setTimeout>;
const cache: Map<string, Suggestion[]> = new Map();

interface Suggestion {
	phrase: string;
}

searchInput.addEventListener("input", (e: Event) => {
	clearTimeout(debounceTimeout);
	debounceTimeout = setTimeout(async () => {
		const query = (e.target as HTMLInputElement).value;
		if (query.length > 0) {
			if (cache.has(query)) {
				displaySuggestions(cache.get(query)!);
			} else {
				const response = await fetch(
					`/api/suggestions?q=${encodeURIComponent(query)}`,
				);
				const data: Suggestion[] = await response.json();
				cache.set(query, data);
				displaySuggestions(data);
			}
		} else {
			suggestionsDiv.innerHTML = "";
		}
	}, 300);
});

function displaySuggestions(data: Suggestion[]): void {
	suggestionsDiv.style.display = "block";
	suggestionsDiv.innerHTML = "";
	const fragment = document.createDocumentFragment();

	for (const suggestion of data.slice(0, 5)) {
		const div = document.createElement("div");
		div.className = "suggestion";
		div.textContent = suggestion.phrase;
		div.onclick = async () => {
			searchInput.value = suggestion.phrase;
			suggestionsDiv.style.display = "none";
		};
		fragment.appendChild(div);
	}

	suggestionsDiv.appendChild(fragment);
}

document.addEventListener("click", (e: MouseEvent) => {
	if (!suggestionsDiv.contains(e.target as Node) && e.target !== searchInput) {
		suggestionsDiv.innerHTML = "";
	}
});

export { search };
