const jwt = require("jsonwebtoken");
const { TOKEN_EXPIRATION_TIME_DEFAULT } = require("../jwt/Constantes");
// Cargar la clave secreta desde las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error(
    "FATAL ERROR: JWT_SECRET no está definida en las variables de entorno."
  );
  process.exit(1); // Detener la aplicación si no hay secreto
}

/**
 * @class ServicioJWT
 * @description Encapsula la lógica para generar y verificar JSON Web Tokens (JWT).
 */
class ServicioJWT {
  /**
   * Genera un token JWT firmado.
   * @param {object} payload - Objeto con la información a incluir en el token (ej. { id: userId, rol: userRole }).
   * @param {string} [expiresIn=TOKEN_EXPIRATION_TIME_DEFAULT] - Tiempo de expiración del token (ej. '1h', '7d', '30m').
   * @returns {string} El token JWT firmado.
   * @throws {Error} Si el payload está vacío o no es un objeto o le faltan.
   */
  generarToken(payload, expiresIn = TOKEN_EXPIRATION_TIME_DEFAULT) {
    if (
      !payload ||
      typeof payload !== "object" ||
      !payload.id ||
      !payload.rol
    ) {
      throw new Error(
        'El payload debe ser un objeto y contener al menos "id" y "rol" para generar el token.'
      );
    }
    const finalPayload = {
      ...payload,
      iss: "tu-aplicacion",
      aud: "tu-audiencia",
    }; // Si quieres añadir más claims, úsalo abajo
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn });
    } catch (error) {
      console.error("Error al generar el token JWT:", error);
      throw new Error("No se pudo generar el token de autenticación."); // Error más genérico hacia afuera
    }
  }

  /**
   * Verifica un token JWT y devuelve el payload decodificado.
   * @param {string} token - El token JWT a verificar.
   * @returns {object} El payload decodificado si el token es válido.
   *  @throws {Error} Si no se proporciona token, o si es inválido, expirado o la firma no coincide.
   */
  verificarToken(token) {
    if (!token) {
      throw new Error("No se proporcionó token para verificar.");
    }
    try {
      // jwt.verify lanza su propio error si la verificación falla (ej. TokenExpiredError, JsonWebTokenError)
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      console.error("Error al verificar el token JWT:", error.message);
      // Re-lanzar un error más específico o el mismo error para que sea manejado externamente
      throw new Error(`Token inválido o expirado: ${error.message}`);
    }
  }
}

module.exports = ServicioJWT;
