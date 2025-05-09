// en autenticacion.middleware.js
import jwt from 'jsonwebtoken'; 
import { JWT_SECRET } from '../config/env.config.js'; // Tu clave secreta

export function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token.' });
  }

  jwt.verify(token, JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({ mensaje: 'Token inválido o expirado.' });
    }
    req.usuario = usuario; 
    next(); 
  });
}
