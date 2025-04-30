const express = require('express');
const router = express.Router();
const AutenticacionControlador = require('../controladores/AutenticacionControlador');
router.post('/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const controlador = new AutenticacionControlador();
    const resultado = await controlador.iniciarSesion(correo, contrasena);
    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error en la autenticación:', error);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

module.exports = router;