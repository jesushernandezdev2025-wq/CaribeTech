import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import connectLiveReload from "connect-livereload";

dotenv.config();

const app = express();
app.use(express.json());

// Necesario para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🟦 Activar LiveReload (para que el navegador se refresque solo)
app.use(connectLiveReload());

// 📌 Servir TODO CaribeTech como estático
// Esto incluye css, js, img, pages, src, etc.
app.use(express.static(path.join(__dirname, "..")));

// 📌 Página principal → carga.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../pages/carga.html"));
});

// 📌 Ruta POST para el formulario
app.post("/api/contact", async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: "Faltan datos del formulario." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `Nuevo mensaje de ${nombre}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\nMensaje:\n${mensaje}`,
    });

    res.json({ message: "Mensaje enviado correctamente." });

  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ error: "Error al enviar el correo." });
  }
});

// 🟢 Iniciar servidor
app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Servidor disponible en:
  👉 PC: http://localhost:${process.env.PORT}
  👉 Red local: http://10.0.0.35:${process.env.PORT}
  `);
});
