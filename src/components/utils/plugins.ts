import localforage from "localforage";


// Set up the LocalForage instance
const pluginStore = localforage.createInstance({
    name: "PluginDB",
    storeName: "Plugins", // Corresponds to the "Plugins" object store
});

// Function to check if the plugin is installed
async function isInstalled(pluginName: string): Promise<boolean> {
    try {
        const plugin = await pluginStore.getItem<PluginMetaData>(pluginName);
        return !!plugin; // Return true if the plugin exists
    } catch (err) {
        console.error("Error checking plugin installation:", err);
        return false;
    }
}

// Function to add a plugin to the database
async function addPlugin(plugin: PluginMetaData): Promise<void> {
    try {
        const scriptContent = await fetch(plugin.script).then((res) => res.text());
        plugin.scriptCopy = new TextEncoder().encode(scriptContent); // Encoding the script content

        await pluginStore.setItem(plugin.name, plugin); // Add or update the plugin
        console.log(`Plugin "${plugin.name}" added successfully.`);
    } catch (err) {
        console.error("Error adding plugin:", err);
    }
}

// Function to remove a plugin from the database
async function removePlugin(pluginName: string): Promise<void> {
    try {
        await pluginStore.removeItem(pluginName); // Remove the plugin by its key
        console.log(`Plugin "${pluginName}" removed successfully.`);
    } catch (err) {
        console.error("Error removing plugin:", err);
    }
}

export { isInstalled, addPlugin, removePlugin };
