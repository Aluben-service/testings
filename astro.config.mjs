// @ts-nocheck
import { defineConfig } from 'astro/config';
import node from "@astrojs/node";

import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from '@mercuryworkshop/libcurl-transport';
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
import { createRequire } from "node:module";
import { viteStaticCopy } from "vite-plugin-static-copy";
import compressor from "astro-compressor";
import compress from "astro-compress";
import playformCompress from "@playform/compress";

import svelte from "@astrojs/svelte";

//import react from "@astrojs/react";

//stolen from holy unbcloker
const { handleUpgrade } = await import("./runtime.js");

// https://astro.build/config
export default defineConfig({

    vite: {
        plugins: [
            viteStaticCopy({
                targets: [
                    {
                        src: `${uvPath}/*`.replace(/\\/g, "/"),
                        dest: "uv",
                        overwrite: false,
                    },
                    {
                        src: `${epoxyPath}/*`.replace(/\\/g, "/"),
                        dest: "epoxy",
                        overwrite: false,
                    },
                    {
                        src: `${baremuxPath}/*`.replace(/\\/g, "/"),
                        dest: "baremux",
                        overwrite: false,
                    },
                    {
                        src: `${libcurlPath}/*`.replace(/\\/g, "/"),
                        dest: "libcurl",
                        overwrite: false,
                    },
                    {
                        src: `${bareModulePath}/*`.replace(/\\/g, "/"),
                        dest: "baremod",
                        overwrite: false,
                    },
                ],
            }),
        ],
    },
    integrations: [{
        name: "stolen from holy unblocker",
        hooks: {
            "astro:server:setup": (opts) => {
                const { httpServer } = opts.server;
                // start a wisp server while letting HMR run
                // @ts-ignore
                const astroHMR = httpServer._events.upgrade;
                // @ts-ignore
                httpServer._events.upgrade = (
                    /** @type {import("http").IncomingMessage} */ req,
                    /** @type {import("net").Socket} */ socket,
                    /** @type {Buffer} */ head,
                ) => {
                    if (req.url === "/") astroHMR(req, socket, head);
                    else handleUpgrade(req, socket, head);
                };
            },
        },
		}, compress({ JavaScript: true }), compressor({
        fileExtensions: [".js", ".ts", ".webp", ".png", ".jpg", ".html"],
        gzip: true, // enable Gzip compression
        brotli: true, // enable Brotli compression
		}), // react()
    playformCompress(), svelte()],
    output: "server",
    adapter: node({
        mode: "middleware",
    }),
    prefetch: true,
});