async function setupDatabase() {
    return new Promise((resolve, reject) => {
        const dbRequest = indexedDB.open("PluginDB", 2); // Increment version number

        dbRequest.onupgradeneeded = (event) => {
            const db = event.target.result;
            const transaction = event.target.transaction;

            if (!db.objectStoreNames.contains("Plugins")) {
                db.createObjectStore("Plugins", { keyPath: "name" });
                console.log("Plugins object store created.");
            }

            transaction.oncomplete = () => {
                console.log("Database setup complete.");
                resolve(db);
            };
        };

        dbRequest.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };

        dbRequest.onerror = (err) => {
            console.error("Error setting up database:", err);
            reject(err);
        };
    });
}


// Add or update a plugin
async function addPlugin(plugin) {
    try {
        const db = await setupDatabase();
        const transaction = db.transaction("Plugins", "readwrite");
        const store = transaction.objectStore("Plugins");

        await new Promise((resolve, reject) => {
            const request = store.add(plugin);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        console.log(`Plugin "${plugin.name}" added successfully.`);
    } catch (err) {
        console.error("Error adding plugin:", err);
    }
}

// List all plugins
async function listPlugins() {
    try {
        const db = await setupDatabase();
        const transaction = db.transaction("Plugins", "readonly");
        const store = transaction.objectStore("Plugins");

        const plugins = await new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        console.log("Plugins in DB:", plugins);
        return plugins;
    } catch (err) {
        console.error("Error listing plugins:", err);
        return [];
    }
}

// Remove a plugin
async function removePlugin(pluginName) {
    try {
        const db = await setupDatabase();
        const transaction = db.transaction("Plugins", "readwrite");
        const store = transaction.objectStore("Plugins");

        await new Promise((resolve, reject) => {
            const request = store.delete(pluginName);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        console.log(`Plugin "${pluginName}" removed successfully.`);
    } catch (err) {
        console.error("Error removing plugin:", err);
    }
}

