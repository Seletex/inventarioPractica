const express = require("express");
const cors = require("cors"); // Asegúrate de tener cors instalado y configurado
const AutenticacionControlador = require("./aplicacion/controladores/AutenticacionControlador");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json());

// Para manejar datos de formularios
app.get("/", (req, res) => {
  res.send("¡Hola Mundo desde el backend con Express!");
});

app.use("/api/login", AutenticacionControlador);

// --- El bloque app.post('/api/login', ...) se ha eliminado ---

// (Opcional pero recomendado) Middleware de manejo de errores global
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
