const jwt = require("jsonwebtoken");
// Importar la clave secreta (validación ya hecha en ServicioJWT)
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Genera un hash de una contraseña usando bcrypt.
 * @param {string} contraseñaPlana - La contraseña sin hashear.
 * @returns {Promise<string>} El hash de la contraseña.
 */
async function hashearContraseña(contraseñaPlana) {
function verificarToken(req, res, next) {
  // 1. Extraer token (equivalente a tokenExists y obtener el token)
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1];

  if (!token) {
    // No hay token
    return res
      .status(401)
      .json({ mensaje: "Acceso denegado. No se proporcionó token." });
  }

  jwt.verify(token, JWT_SECRET, (err, usuarioDecodificado) => {
    if (err) {
      console.error("Error al verificar token:", err.message);
      // Manejo de errores JWT específicos (ExpiredJwtException, etc.) se refleja en err.message
      return res.status(403).json({ mensaje: "Token inválido o expirado." }); // Prohibido
    }

    if (!usuarioDecodificado || !usuarioDecodificado.rol) {
        console.warn("Token válido pero no contiene la información de rol esperada.");
        return res.status(403).json({ mensaje: "Token inválido (faltan datos de autorización)." });
    }

    // 4. Establecer contexto (equivalente a setAuthentication)
    req.usuario = usuarioDecodificado; // Adjuntar payload a la solicitud
    next(); // Pasar al siguiente middleware o ruta
  });
}


/**
 * Middleware factory que crea un middleware para verificar si el usuario tiene AL MENOS UNO de los roles especificados.
 * @param {string[]} rolesPermitidos - Array de roles permitidos para la ruta.
 * @returns {function} Middleware de Express.
 */
function tieneRol(rolesPermitidos = []) {
  return (req, res, next) => {
    // Asegurarse de que verificarToken se ejecutó antes y req.usuario existe
    if (!req.usuario || !req.usuario.rol) {
      console.warn(
        "Intento de acceso a ruta protegida por rol sin usuario autenticado o sin rol."
      );
      return res
        .status(403)
        .json({
          mensaje:
            "Acceso prohibido. Rol no especificado o usuario no autenticado.",
        });
    }

    const rolUsuario = req.usuario.rol;
    const tienePermiso = rolesPermitidos.some(
      (rol) => rol.toUpperCase() === rolUsuario.toUpperCase()
    );

    if (!tienePermiso) {
      console.warn(
        `Acceso denegado para rol '${rolUsuario}'. Roles permitidos: ${rolesPermitidos.join(
          ", "
        )}`
      );
      return res
        .status(403)
        .json({
          mensaje: `Acceso prohibido. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(
            ", "
          )}`,
        });
    }

    next(); // El usuario tiene uno de los roles permitidos
  };
}

// --- 5. Exportar ---
module.exports = {
  verificarToken, // Middleware para autenticación
  tieneRol, // Middleware factory para autorización por roles
  esAdmin: tieneRol(['Administrador']), // O 'ADMIN' si usas el valor interno
  esAdministrativo: tieneRol(['UsuarioAdministrativo']), // O 'ADMINISTRATIVO'
  esConsultor: tieneRol(['Consultor']), // O 'CONSULTOR'
};}
