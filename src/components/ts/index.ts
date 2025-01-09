
import { search } from "@utils/search.ts";
import { registerSW } from "@utils/registerSW.ts";


async function initialize() {
	const form = document.getElementById("proxyForm") as HTMLFormElement;
	const address = document.getElementById("search") as HTMLInputElement;
	const searchEngine: string =
		localStorage.getItem("searchEngine") ||
		"https://search.brave.com/search?q=%s" ||
		"https://google.com/search?q=%s";
	const controls = document.getElementById("controls") as HTMLElement;
	const frame = document.getElementById("web") as HTMLIFrameElement;
	const suggestions = document.getElementById("suggestions") as HTMLElement;
	const connection = new self.BareMux.BareMuxConnection("/baremux/worker.js");

	form.addEventListener("submit", async (event: Event) => {
		event.preventDefault();
		await registerSW();
		await enter();
	});

	async function enter(): Promise<void> {
		const url = search(address.value, searchEngine);
		frame.style.display = "block";
		controls.style.display = "block";

		const wispUrl = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/wisp/`;

		if ((await connection.getTransport()) !== "/libcurl/index.mjs") {
			await connection.setTransport("/libcurl/index.mjs", [{ wisp: wispUrl }]);
		}

	
		frame.src = self.__uv$config.prefix + self.__uv$config.encodeUrl(url);

		address.value = "";
		suggestions.style.display = "none";
	}

	window.action = (action: string, frameID: string): void => {
		const frame = document.getElementById(frameID) as HTMLIFrameElement | null;
		if (frame) {
			const contentWindow = frame.contentWindow;
			if (!contentWindow) return;

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
					controls.style.display = "none";
					break;
			}
		}
	};



}

document.addEventListener("astro:after-swap", initialize);
document.addEventListener("DOMContentLoaded", initialize);
