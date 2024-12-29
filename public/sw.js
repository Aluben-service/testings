importScripts('/epoxy/index.js');
importScripts('/libcurl/index.js');
importScripts('/baremod/index.js');
importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts('/uv/uv.sw.js');
importScripts('/workerware/index.js');

const ww = new WorkerWare({
    debug: true,
});


const uv = new UVServiceWorker();

// Function to load plugins from IndexedDB
async function loadPlugins() {
    try {
        const dbRequest = indexedDB.open("PluginDB", 2);

        dbRequest.onsuccess = () => {
            const db = dbRequest.result;
            const transaction = db.transaction("Plugins", "readonly");
            const store = transaction.objectStore("Plugins");

            store.getAll().onsuccess = event => {
                const plugins = event.target.result;
                for (plugin of plugins) {

                    switch (plugin.type) {
                        case "serviceWorker": {
                            const scriptContent = new TextDecoder().decode(plugin.scriptCopy);
                            eval(scriptContent); // Be cautious with eval for untrusted content

                            if (plugin.entryNamespace && plugin.entryFunction) {
                                const func = self[plugin.entryNamespace][plugin.entryFunction];

                                ww.use({
                                    function: func,
                                    events: plugin.events,
                                    name: plugin.name,
                                });

                            }
                            break;
                        }

                        
                    }
                }
            };
        };

        dbRequest.onerror = () => {
            console.error("Failed to access IndexedDB for plugins.");
        };
    } catch (err) {
        console.error(`Error loading plugins: ${err}`);
    }
}

// Load plugins from IndexedDB
loadPlugins();

self.addEventListener('fetch', (event) => {
    event.respondWith((async () => {
        const mwResponse = await ww.run(event)();
        if (mwResponse.includes(null)) {
            return;
        }
        if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
            return await uv.fetch(event);
        }
        return await fetch(event.request);
    })());
});
