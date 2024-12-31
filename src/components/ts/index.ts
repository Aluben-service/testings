import { search } from "@utils/search.ts";


async function initialize() {
const swAllowedHostnames = ["localhost", "127.0.0.1"];

// Type definitions for DOM elements
const form = document.getElementById("proxyForm") as HTMLFormElement | null;
const address = document.getElementById("search") as HTMLInputElement | null;
const controls = document.getElementById("controls") as HTMLElement | null;
const frame = document.getElementById("web") as HTMLIFrameElement | null;
const suggestions = document.getElementById(
	"suggestions",
) as HTMLElement | null;

// Ensure `localStorage` defaults are handled correctly
const searchEngine: string =
	localStorage.getItem("searchEngine") ||
	"https://search.brave.com/search?q=%s" ||
	"https://google.com/search?q=%s";

// BareMux connection instance
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

// Event listener for form submission
form?.addEventListener("submit", async (event: Event) => {
	event.preventDefault();

	await enter();
});

// Enter function to handle search logic and iframe loading
async function enter(): Promise<void> {
	if (!address) return;

	const url = search(address.value, searchEngine);
	if (frame) {
		frame.style.display = "block";
	}
	if (controls) {
		controls.style.display = "block";
	}

	const wispServer =
		localStorage.getItem("wispServer") ||
		`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/wisp/` ||
		"wss://tomp.app/wisp" ||
		"https://gointerstellar.app/fq/";
	console.log("wispServer", wispServer);
	await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispServer }]);
	if (frame) {
		frame.src = self.__uv$config.prefix + self.__uv$config.encodeUrl(url);
	}

	if (address) {
		address.value = "";
	}

	if (suggestions) {
		suggestions.style.display = "none";
	}
}

// Action function for managing iframe actions like back, forward, reload, close
window.action = (action: string, frameID: string): void => {
	const frame = document.getElementById(frameID) as HTMLIFrameElement | null;
	if (frame) {
		const contentWindow = frame.contentWindow;
		if (contentWindow) {
			switch (action) {
				case "back":
					contentWindow.history.back();
					break;
				case "forward":
					contentWindow.history.forward();
					break;
				case "reload":
					contentWindow.location.reload();
					break;
				case "close":
					frame.dataset.open = "false";
					frame.src = "";
					frame.style.display = "none";
					if (controls) {
						controls.style.display = "none";
					}
					break;
			}
		}
	}
};

window.registerSW = async () => {
	if (
		location.protocol !== "https:" &&
		!swAllowedHostnames.includes(location.hostname)
	)
		throw new Error("Service workers cannot be registered without https.");

	if (!navigator.serviceWorker)
		throw new Error("Your browser doesn't support service workers.");

	navigator.serviceWorker.register("sw.js", {
		scope: "/service/",
	});
};

const searchInput = document.getElementById("search");
const suggestionsDiv = document.getElementById("suggestions");
let debounceTimeout;
const cache = new Map();

searchInput.addEventListener("input", (e) => {
	clearTimeout(debounceTimeout);
	debounceTimeout = setTimeout(async () => {
		const query = e.target.value;
		if (query.length > 0) {
			if (cache.has(query)) {
				displaySuggestions(cache.get(query));
			} else {
				const response = await fetch(
					`/api/suggestions?q=${encodeURIComponent(query)}`,
				);
				const data = await response.json();
				cache.set(query, data);
				displaySuggestions(data);
			}
		} else {
			suggestionsDiv.innerHTML = "";
		}
	}, 300);
});

function displaySuggestions(data) {
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
			await enter();
		};
		fragment.appendChild(div);
	}
	suggestionsDiv.appendChild(fragment);
}

document.addEventListener("click", (e) => {
	if (!suggestionsDiv.contains(e.target) && e.target !== searchInput) {
		suggestionsDiv.innerHTML = "";
	}
});
}

document.addEventListener("astro:after-swap", initialize);	
document.addEventListener("DOMContentLoaded", initialize);