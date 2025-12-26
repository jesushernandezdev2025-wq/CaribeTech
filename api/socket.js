import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🚀 Iniciando Socket.IO");

    const io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*",
      },
    });

    io.on("connection", socket => {
      console.log("🟢 Conectado:", socket.id);

      // MENSAJE DESDE USUARIO
      socket.on("user-message", data => {
        io.emit("dashboard-message", data);
      });

      // MENSAJE DESDE DASHBOARD
      socket.on("support-message", data => {
        io.emit("user-reply", data);
      });

      socket.on("disconnect", () => {
        console.log("🔴 Desconectado:", socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
