(async () => {
const uvRandomPath = "PGtWY2ZzjT";
const demoMode = false;
const rammerheadEnabled = true;
const scramjetEnabled = true;
const uvEnabled = true;
const defaultService = "uv";

const currentScript = document.currentScript;

window.chemical = {
  loaded: false,
  demoMode,
  transport:
    currentScript.dataset.transportStore !== undefined
      ? localStorage.getItem("@chemical/transport") ||
        currentScript.dataset.transport ||
        "libcurl"
      : currentScript.dataset.transport || "libcurl",
  wisp:
    currentScript.dataset.wispStore !== undefined
      ? localStorage.getItem("@chemical/wisp") ||
        currentScript.dataset.wisp ||
        `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/wisp/`
      : currentScript.dataset.wisp ||
        `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/wisp/`,
};

async function rammerheadEncode(baseUrl, decode = false) {
  const mod = (n, m) => ((n % m) + m) % m;
  const baseDictionary =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~-";
  const shuffledIndicator = "_rhs";

  const generateDictionary = () => {
    let str = "";
    const split = baseDictionary.split("");
    while (split.length > 0) {
      str += split.splice(Math.floor(Math.random() * split.length), 1)[0];
    }
    return str;
  };

  class StrShuffler {
    constructor(dictionary = generateDictionary()) {
      this.dictionary = dictionary;
    }

    shuffle(str) {
      if (str.startsWith(shuffledIndicator)) {
        return str;
      }
      let shuffledStr = "";
      for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
        const idx = baseDictionary.indexOf(char);
        if (char === "%" && str.length - i >= 3) {
          shuffledStr += char;
          shuffledStr += str.charAt(++i);
          shuffledStr += str.charAt(++i);
        } else if (idx === -1) {
          shuffledStr += char;
        } else {
          shuffledStr += this.dictionary.charAt(
            mod(idx + i, baseDictionary.length)
          );
        }
      }
      return shuffledIndicator + shuffledStr;
    }

    unshuffle(str) {
      if (!str.startsWith(shuffledIndicator)) {
        return str;
      }

      str = str.slice(shuffledIndicator.length);

      let unshuffledStr = "";
      for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
        const idx = this.dictionary.indexOf(char);
        if (char === "%" && str.length - i >= 3) {
          unshuffledStr += char;
          unshuffledStr += str.charAt(++i);
          unshuffledStr += str.charAt(++i);
        } else if (idx === -1) {
          unshuffledStr += char;
        } else {
          unshuffledStr += baseDictionary.charAt(
            mod(idx - i, baseDictionary.length)
          );
        }
      }
      return unshuffledStr;
    }
  }

  function get(url) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.send();

      request.onerror = () => {
        reject(new Error("Cannot communicate with the server"));
      };
      request.onload = () => {
        if (request.status === 200) {
          resolve(request.responseText);
        } else {
          reject(new Error(`Unexpected server response: ${request.responseText}`));
        }
      };
    });
  }

  const api = {
    async newsession() {
      return await get("/newsession");
    },
    async sessionexists(id) {
      const res = await get(`/sessionexists?id=${encodeURIComponent(id)}`);
      if (res === "exists") return true;
      if (res === "not found") return false;
      throw new Error(`Unexpected response from server: ${res}`);
    },
    async shuffleDict(id) {
      console.log("Shuffling", id);
      const res = await get(`/api/shuffleDict?id=${encodeURIComponent(id)}`);
      return JSON.parse(res);
    },
  };

  const localStorageKey = "rammerhead_sessionids";
  const localStorageKeyDefault = "rammerhead_default_sessionid";
  const sessionIdsStore = {
    get() {
      const rawData = localStorage.getItem(localStorageKey);
      if (!rawData) return [];
      try {
        const data = JSON.parse(rawData);
        if (!Array.isArray(data)) throw "getout";
        return data;
      } catch (e) {
        return [];
      }
    },
    set(data) {
      if (!data || !Array.isArray(data)) throw new TypeError("must be array");
      localStorage.setItem(localStorageKey, JSON.stringify(data));
    },
    getDefault() {
      const sessionId = localStorage.getItem(localStorageKeyDefault);
      if (sessionId) {
        var data = sessionIdsStore.get();
        data.filter((e) => e.id === sessionId);
        if (data.length) return data[0];
      }
      return null;
    },
    setDefault(id) {
      localStorage.setItem(localStorageKeyDefault, id);
    },
  };

  function addSession(id) {
    var data = sessionIdsStore.get();
    data.unshift({ id: id, createdOn: new Date().toLocaleString() });
    sessionIdsStore.set(data);
  }

  async function getSessionId() {
    var id = localStorage.getItem("session-string");
    const exists = await api.sessionexists(id);
    if (!exists) {
      console.log("Session validation failed");
      const newId = await api.newsession();
      addSession(newId);
      localStorage.setItem("session-string", newId);
      console.log(newId);
      console.log("^ new id");
      return newId;
    }
    return id;
  }

  const id = await getSessionId();
  const shuffleDict = await api.shuffleDict(id);
  const shuffler = new StrShuffler(shuffleDict);
  
  if (decode) {
    return shuffler.unshuffle(baseUrl.split(id + "/")[1]);
  } else {
    return "/" + id + "/" + shuffler.shuffle(baseUrl);
  }
}

async function encodeService(url, service) {
  switch (service) {
    case "uv":
      if (uvEnabled) {
        return (
          window.location.origin +
          __uv$config.prefix +
          __uv$config.encodeUrl(url)
        );
      }
      break;
    case "rh":
      if (rammerheadEnabled) {
        return window.location.origin + (await rammerheadEncode(url));
      }
      break;
    case "scramjet":
      if (scramjetEnabled) {
        return window.location.origin + chemical.scramjet.encodeUrl(url);
      }
      break;
  }
}

window.chemical.encode = async function (url, config) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    config = {
      service: defaultService,
      autoHttps: false,
    };
  }

  if (config.service === undefined) {
    config.service = defaultService;
  }

  if (config.autoHttps === undefined) {
    config.autoHttps = false;
  }

  if (demoMode) {
    return "/chemical.demo.html";
  }

  if (url.match(/^https?:\/\//)) {
    return await encodeService(url, config.service);
  } else if (
    config.autoHttps === true &&
    url.includes(".") &&
    !url.includes(" ")
  ) {
    return await encodeService("https://" + url, config.service);
  } else if (config.searchEngine) {
    return await encodeService(
      config.searchEngine.replace("%s", encodeURIComponent(url)),
      config.service
    );
  } else {
    return await encodeService(url, config.service);
  }
};

window.chemical.decode = async function (url, config) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    config = {
      service: defaultService,
    };
  }

  switch (config.service) {
    case "uv":
      if (uvEnabled) {
        return __uv$config.decodeUrl(url.split(__uv$config.prefix)[1]);
      }
      break;
    case "rh":
      if (rammerheadEnabled) {
        return await rammerheadEncode(
          url.split(window.location.origin)[1],
          true
        );
      }
      break;
    case "scramjet":
      if (scramjetEnabled) {
        return $scramjet.codec.decode(url.split($scramjet.config.prefix)[1]);
      }
      break;
  }
};

window.chemical.setStore = function (key, value) {
  const allowed = ["transport", "wisp", "service", "autoHttps", "searchEngine"];

  if (allowed.includes(key)) {
    localStorage.setItem("@chemical/" + key, String(value));
    if (key === "transport") {
      window.chemical.setTransport(value);
    }
    if (key === "wisp") {
      window.chemical.setWisp(value);
    }
    window.dispatchEvent(
      new CustomEvent("chemicalStoreChange", {
        detail: { key, value },
      })
    );
  }
};

window.chemical.getStore = function (key) {
  const value =
    key === "autoHttps"
      ? localStorage.getItem("@chemical/" + key) === "true"
      : localStorage.getItem("@chemical/" + key);

  const defaults = {
    transport: window.chemical.transport,
    wisp: window.chemical.wisp,
    service: "uv",
    autoHttps: false,
  };

  return value || defaults[key];
};

function getTransport(transport) {
  switch (transport) {
    default:
    case "libcurl":
      return "/libcurl/index.mjs";
    case "epoxy":
      return "/epoxy/index.mjs";
  }
}

window.chemical.setTransport = async function (newTransport) {
  newTransport = newTransport || currentScript.dataset.transport || "libcurl";
  await window.chemical.connection.setTransport(getTransport(newTransport), [
    { wisp: window.chemical.wisp },
  ]);
  window.chemical.transport = newTransport;
};

window.chemical.setWisp = async function (wisp) {
  wisp =
    wisp ||
    currentScript.dataset.wisp ||
    (location.protocol === "https:" ? "wss" : "ws") +
      "://" +
      location.host +
      "/wisp/";
  await window.chemical.connection.setTransport(
    getTransport(window.chemical.transport),
    [{ wisp: wisp }]
  );
  window.chemical.wisp = wisp;
};

async function registerSW() {
  if ("serviceWorker" in navigator) {
    await navigator.serviceWorker.register("/chemical.sw.js");
  } else {
    console.error("Service worker failed to register.");
  }
}

async function loadScript(src) {
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject();
    };
    document.head.appendChild(script);
  });
}

function setupFetch() {
  const client = new window.BareMux.BareClient();
  window.chemical.fetch = client.fetch.bind(client);

  window.chemical.getSuggestions = async function (query) {
    if (!query) {
      return [];
    }

    try {
      const DDGSuggestions = await window.chemical.fetch(
        "https://duckduckgo.com/ac/?q=" + query + "&type=list"
      );
      const suggestions = await DDGSuggestions.json();
      return suggestions[1].slice(0, 9);
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  window.chemical.createDataURL = async function (url) {
    return new Promise(async (resolve, _reject) => {
      try {
        const response = await window.chemical.fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = function () {
          resolve(reader.result);
        };

        reader.readAsDataURL(blob);
      } catch {
        resolve(undefined);
      }
    });
  };
}

await loadScript("/baremux/index.js");
if (uvEnabled) {
  await loadScript(`/${uvRandomPath}/${uvRandomPath}.bundle.js`);
  await loadScript(`/${uvRandomPath}/${uvRandomPath}.config.js`);
}
if (scramjetEnabled) {
  await loadScript("/scramjet/scramjet.shared.js");
  await loadScript("/scramjet/scramjet.controller.js");
  chemical.scramjet = new ScramjetController({
    prefix: "/~/scramjet/",
    files: {
      wasm: "/scramjet/scramjet.wasm.js",
      worker: "/scramjet/scramjet.worker.js",
      client: "/scramjet/scramjet.client.js",
      shared: "/scramjet/scramjet.shared.js",
      sync: "/scramjet/scramjet.sync.js",
    },
  });
  chemical.scramjet.init("/chemical.sw.js");
}
window.chemical.connection = new window.BareMux.BareMuxConnection(
  "/baremux/worker.js"
);
await window.chemical.setTransport(window.chemical.transport);
setupFetch();
await registerSW();
window.chemical.loaded = true;
window.dispatchEvent(new Event("chemicalLoaded"));

})();