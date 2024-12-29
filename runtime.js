import wisp from "wisp-server-node";
import { createServer } from "http";

/**
 * Handles WebSocket upgrade requests
 * @param {import("http").IncomingMessage} req
 * @param {import("net").Socket} socket
 * @param {Buffer} head
 */
export function handleUpgrade(req, socket, head) {
  if (req.url === "/wisp/") {
    wisp.routeRequest(req, socket, head, { logging: true });
  } else {
    console.log("Invalid websocket request at:", req.url);
    socket.end();
  }
}
