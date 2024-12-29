const form = document.getElementById("proxyForm");
const address = document.getElementById("search");
const searchEngine = localStorage.getItem("searchEngine") || "https://search.brave.com/search?q=%s" || "https://google.com/search?q=%s";
const controls = document.getElementById("controls");
const frame = document.getElementById("web");
const suggestions = document.getElementById("suggestions");
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await registerSW();
  await enter();
});

async function enter() {
  const url = search(address.value, searchEngine);
  frame.style.display = "block";
  controls.style.display = "block";
  const wispUrl = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/wisp/`;
  if (await connection.getTransport() !== "/baremod/index.mjs") {
    await connection.setTransport("/baremod/index.mjs", ["https://tomp.app/bare"]);
  }
  frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
  address.value = "";
  suggestions.style.display = "none";
}

window.action = (action, frameID) => {
  const frame = document.getElementById(frameID);
  if (frame) {
    const contentWindow = frame.contentWindow;
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
