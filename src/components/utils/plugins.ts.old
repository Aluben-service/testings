async function setupDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        // Open the database with versioning (this will trigger onupgradeneeded if the version changes)
        const dbRequest = indexedDB.open("PluginDB", 2); // Version 2 to ensure upgrade if needed

        dbRequest.onupgradeneeded = () => {
            const db = dbRequest.result as IDBDatabase;
            const transaction: IDBTransaction | null = dbRequest.transaction;

            // Create the "Plugins" object store if it doesn't exist
            db.createObjectStore("Plugins", { keyPath: "name" });
            console.log("Plugins object store created.");


            if(!transaction) throw new Error("Transaction is null");

            // Ensure the transaction is complete before resolving the promise
            transaction.oncomplete = () => {
                console.log("Database upgrade complete.");
                resolve(db);
            };
        };

        dbRequest.onsuccess = () => {
            const db = dbRequest.result as IDBDatabase;
            resolve(db); // Resolve the promise when the DB is successfully opened
        };

        dbRequest.onerror = (err) => {
            console.error("Error setting up database:", err);
            reject(err); // Reject the promise in case of an error
        };
    });
}

// Function to check if the plugin is installed
async function isInstalled(pluginName: string): Promise<boolean> {
    try {
        const db = await setupDatabase(); // Ensure the database is set up before checking
        const transaction = db.transaction("Plugins", "readonly");
        const store = transaction.objectStore("Plugins");

        const request = store.get(pluginName);
        return new Promise<boolean>((resolve, reject) => {
            request.onsuccess = () => {
                resolve(!!request.result); // If plugin exists in the store, it means it's installed
            };

            request.onerror = () => {
                reject("Error checking plugin installation.");
            };
        });
    } catch (err) {
        console.error("Error checking plugin installation:", err);
        return false; // Return false in case of error
    }
}

// Function to add a plugin to the database
async function addPlugin(plugin: PluginMetaData): Promise<void> {
    try {
        const scriptContent = await fetch(plugin.script).then((res) => res.text());
        plugin.scriptCopy = new TextEncoder().encode(scriptContent); // Encoding the script content

        const db = await setupDatabase(); // Ensure the database is set up
        const transaction = db.transaction("Plugins", "readwrite");
        const store = transaction.objectStore("Plugins");

        const request = store.add(plugin); // Use `put` to add or update the plugin

        request.onsuccess = () => {
            console.log(`Plugin "${plugin.name}" added successfully.`);
        };

        request.onerror = (err) => {
            console.error("Error adding plugin:", err);
        };

        // Wait for the transaction to complete
        await new Promise<void>((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = (err) => reject(err);
        });
    } catch (err) {
        console.error("Error adding plugin:", err);
    }
}

// Function to remove a plugin from the database
async function removePlugin(pluginName: string): Promise<void> {
    try {
        const db = await setupDatabase(); // Ensure the database is set up
        const transaction = db.transaction("Plugins", "readwrite");
        const store = transaction.objectStore("Plugins");

        const request = store.delete(pluginName); // Delete the plugin from the store

        request.onsuccess = () => {
            console.log(`Plugin "${pluginName}" removed successfully.`);
        };

        request.onerror = () => {
            console.error(`Error removing plugin "${pluginName}"`);
        };

        // Wait for the transaction to complete
        await new Promise<void>((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = (err) => reject(err);
        });
    } catch (err) {
        console.error("Error removing plugin:", err);
    }
}
export { setupDatabase, isInstalled, addPlugin, removePlugin };