// @ts-check
import { defineConfig } from 'astro/config';
import node from "@astrojs/node";

import compress from "astro-compress";

//stolen from holy unbcloker
const { handleUpgrade } = await import("./runtime.js");

// https://astro.build/config
export default defineConfig({
  integrations: [
    {
    name: "stolen from holy unblocker",
    hooks: {
      "astro:server:setup": (opts) => {
        const { httpServer } = opts.server;
        // start a wisp server while letting HMR run
        // @ts-ignore
        const astroHMR = httpServer._events.upgrade;
        // @ts-ignore
        httpServer._events.upgrade = (/** @type {import("http").IncomingMessage} */ req, /** @type {import("net").Socket} */ socket, /** @type {Buffer} */ head) => {
          if (req.url === "/") astroHMR(req, socket, head);
          else handleUpgrade(req, socket, head);
        };
      },
    },
  }, compress()],
  output: "server",
  adapter: node({
    mode: "middleware",
  }),
});
