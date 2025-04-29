const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("¡Hola Mundo desde el backend con Express!");
});

app.post("/api/login", (req, res) => {
  const { correo, contraseña } = req.body; // Obtener datos del cuerpo de la solicitud

  console.log("Intento de login recibido:", correo, contraseña);

  if (correo === "usuario@valido.com" && contraseña === "passwordcorrecto") {
    res.status(200).json({
      message: "Login exitoso",
      usuario: { nombre: "Usuario Válido" },
    });
  } else {
    res.status(401).json({ message: "Credenciales inválidas" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
