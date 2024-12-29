const swAllowedHostnames = ["localhost", "127.0.0.1"];

async function registerSW() {
	if (
		location.protocol !== "https:" &&
		!swAllowedHostnames.includes(location.hostname)
	)
		throw new Error("Service workers cannot be registered without https.");

	if (!navigator.serviceWorker)
		throw new Error("Your browser doesn't support service workers.");

	navigator.serviceWorker
		.register("sw.js", {
			scope: "/service/",
		})
		.then(async () => {
			const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
			const wispServer =
				localStorage.getItem("wispServer") ||
				`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/wisp/` ||
				"wss://tomp.app/wisp" ||
				"https://gointerstellar.app/fq/";
			console.log("wispServer", wispServer);
			await connection.setTransport("/baremod/index.mjs", ["https://tomp.app/bare"]);
			console.log("Transport was epoxy");
		});
}

const errRegisterSW = async () => {
	if (
		location.protocol !== "https:" &&
		!swAllowedHostnames.includes(location.hostname)
	)
		throw new Error("Service workers cannot be registered without https.");

	if (!navigator.serviceWorker)
		throw new Error("Your browser doesn't support service workers.");

	navigator.serviceWorker
		.register("sw.js", {
			scope: "/service/",
		})
		.then(async () => {
			const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
			const wispServer =
				localStorage.getItem("wispServer") ||
				`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/wisp/` ||
				"wss://tomp.app/wisp" ||
				"https://gointerstellar.app/fq/";
			console.log("wispServer", wispServer);
			await connection.setTransport("/baremod/index.mjs", ["https://tomp.app/bare"]);
			console.log("Transport was epoxy");
		});
	alert("Press reload!");
}