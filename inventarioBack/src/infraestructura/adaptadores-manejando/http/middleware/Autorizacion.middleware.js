// en autorizacion.middleware.js
import { UsuarioRol } from "../../../aplicacion/dominio/valueObjects/usuario/UsuarioRol.js"; // Asumiendo que tienes este enum

export function soloAdmin(req, res, next) {
  if (req.usuario && req.usuario.rol === UsuarioRol.ADMINISTRADOR) {
    next();
  } else {
    res
      .status(403)
      .json({ mensaje: "Acceso prohibido. Se requiere rol de administrador." });
  }
}
export function soloCliente(req, res, next) {
  if (req.usuario && req.usuario.rol === UsuarioRol.INVITADO) {
    next();
  }
}
export function tieneRol(rolesPermitidos) {
  return (req, res, next) => {
    if (req.usuario && rolesPermitidos.includes(req.usuario.rol)) {
      next();
    } else {
      res
        .status(403)
        .json({
          mensaje: `Acceso prohibido. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(
            ", "
          )}`,
        });
    }
  };
}
