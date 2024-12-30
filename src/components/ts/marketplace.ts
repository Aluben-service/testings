import { setupDatabase, isInstalled, addPlugin, removePlugin } from "@ts/plugins.ts";

const installButtons = document.getElementsByClassName("btn-install");

// Function to set up the database and install/uninstall buttons
async function initialize() {
    console.log("Initializing database and buttons...");
    setupDatabase(); // Set up the database

    const installButtons = document.querySelectorAll("[data-plugin]");

    for (const btn of installButtons) {
        const pluginData = btn.getAttribute("data-plugin");
        if (!pluginData) {
            console.error("Missing plugin data for button", btn);
            continue;
        }

        const plugin = JSON.parse(pluginData);
        const installed = await isInstalled(plugin.name);

        btn.textContent = `${installed ? "Uninstall" : "Install"}`;

        // Add click event listener for installation/uninstallation
        btn.addEventListener("click", async () => {
            if (btn.textContent.startsWith("Install")) {
                console.log("Installing plugin:", plugin);
                await addPlugin(plugin);
            } else {
                console.log(`Uninstalling plugin "${plugin.name}"`);
                await removePlugin(plugin.name);
            }

            // Update button text after action
            const updatedInstalled = await isInstalled(plugin.name);
            btn.textContent = `${updatedInstalled ? "Uninstall" : "Install"} ${plugin.name}`;
        });
    }
}

// Listen for both DOMContentLoaded and astro:after-swap events
document.addEventListener("DOMContentLoaded", initialize);
document.addEventListener("astro:after-swap", initialize);
