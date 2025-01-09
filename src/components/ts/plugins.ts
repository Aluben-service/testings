import {
	isInstalled,
	addPlugin,
	removePlugin,
} from "@utils/plugins";

import localforage from 'localforage';

localforage.createInstance({
	name: "PluginDB",
	storeName: "Plugins", // Corresponds to the "Plugins" object store
});
async function initialize() {

	const buttons = document.querySelectorAll("[data-plugin]");

	for (const btn of buttons) {
		const pluginData = btn.getAttribute("data-plugin");
		if (!pluginData) continue;

		const plugin = JSON.parse(pluginData);
		const updateState = async () => {
			const installed = await isInstalled(plugin.name);
			btn.textContent = installed ? "Uninstall" : "Install";
			btn.addEventListener("click", async () => {
				if (installed) await removePlugin(plugin.name);
				else await addPlugin(plugin);
				await updateState();
			});
		};
		await updateState();
	}
}

document.addEventListener("DOMContentLoaded", initialize);
document.addEventListener("astro:after-swap", initialize);
