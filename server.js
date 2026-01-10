// ========================================
// SERVIDOR WEBSOCKET PARA CARIBETECH
// ========================================

import { WebSocketServer } from "ws";
import http from "http";

// Servidor HTTP base (necesario para Vercel)
const server = http.createServer();

const wss = new WebSocketServer({ server });

let clients = {};    // clientes navegando en la web
let agents = {};     // agentes en el dashboard

function broadcastToAgent(data) {
  Object.values(agents).forEach((ws) => {
    ws.send(JSON.stringify(data));
  });
}

function sendToClient(clientId, data) {
  if (clients[clientId]) {
    clients[clientId].send(JSON.stringify(data));
  }
}

wss.on("connection", (ws, req) => {
  const url = req.url;

  // ---------------------------
  // CLIENTE WEB
  // ---------------------------
  if (url.includes("/client")) {
    const clientId = Math.random().toString(36).substring(2, 10);
    clients[clientId] = ws;

    ws.send(JSON.stringify({ type: "welcome", clientId }));

    ws.on("message", (msg) => {
      const data = JSON.parse(msg);

      if (data.type === "new_message") {
        broadcastToAgent({
          type: "new_message",
          chatId: clientId,
          text: data.text,
        });
      }
    });

    ws.on("close", () => {
      delete clients[clientId];
    });
  }

  // ---------------------------
  // AGENTE (DASHBOARD)
  // ---------------------------
  else if (url.includes("/support")) {
    const agentId = Math.random().toString(36).substring(2, 10);
    agents[agentId] = ws;

    ws.on("message", (msg) => {
      const data = JSON.parse(msg);

      if (data.type === "support_reply") {
        sendToClient(data.chatId, {
          type: "support_reply",
          text: data.text,
        });
      }
    });

    ws.on("close", () => {
      delete agents[agentId];
    });
  }
});

// Puerto para local
server.listen(3000, () => {
  console.log("Servidor WebSocket activo en puerto 3000");
});
