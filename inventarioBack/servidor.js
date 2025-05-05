require("dotenv").config();
require("./src/infraestructura/configuracion/firebaseAdmin"); // Ejecuta la inicialización
const express = require("express");
const cors = require("cors"); // Asegúrate de tener cors instalado y configurado
const helmet = require("helmet"); // Añadir helmet para seguridad
const AutenticacionControlador = require("./aplicacion/controladores/AutenticacionControlador");
const app = express();

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.FRONTEND_URL || "*",
  optionsSuccessStatus: 200, // Para navegadores antiguos
};
app.use(cors(corsOptions));

app.use(helmet()); // Añadir cabeceras de seguridad
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("¡Hola Mundo desde el backend con Express!");
});

app.use("/api/login", AutenticacionControlador);

app.use((err, req, res, next) => {
  console.error("Error no controlado:", err.stack);
  const statusCode = err.statusCode || 500;
  res
    .status(statusCode)
    .json({ message: err.message || "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
