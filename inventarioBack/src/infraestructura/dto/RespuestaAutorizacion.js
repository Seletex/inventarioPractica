/**
 * @class RespuestaAutorizacion
 * @description Data Transfer Object para la respuesta de una autenticación exitosa.
 *              Contiene el token de acceso y el rol del usuario.
 */
class RespuestaAutorizacion {
  /**
   * @param {string} token - El token de autenticación (ej. JWT).
   * @param {string} rol - El rol asignado al usuario autenticado.
   * @throws {Error} Si el token o el rol son nulos, indefinidos o cadenas vacías.
   */
  constructor(token, rol) {
    if (!token || typeof token !== 'string' || token.trim() === '') {
      throw new Error("El 'token' es requerido para RespuestaAutorizacion.");
    }
    if (!rol || typeof rol !== 'string' || rol.trim() === '') {
      throw new Error("El 'rol' es requerido para RespuestaAutorizacion.");
    }
    this.token = token.trim(); 
    this.rol = rol.trim();
  }
}

module.exports = RespuestaAutorizacion;
