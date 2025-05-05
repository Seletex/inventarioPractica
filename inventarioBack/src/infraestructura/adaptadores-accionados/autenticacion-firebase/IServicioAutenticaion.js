
/**
 * @typedef {object} UsuarioAutenticado
 * @property {string} id - El identificador único del usuario (ej: UID de Firebase).
 * @property {string} email - El correo electrónico del usuario.
 * @property {string} [nombre] - El nombre del usuario (opcional).
 * @property {string[]} [roles] - Roles o permisos del usuario (opcional).
 * @property {object} [claims] - Claims adicionales del token (opcional).
 */

/**
 * @interface IServicioAutenticacion
 * @description Define el contrato para las operaciones de autenticación y verificación de identidad.
 *              Cualquier adaptador de autenticación (Firebase Auth, JWT, etc.) debe implementar esta interfaz.
 */
class IServicioAutenticacion {
    /**
     * Verifica un token de identidad (ej: ID Token de Firebase, JWT) y devuelve los datos del usuario autenticado.
     * @abstract
     * @param {string} token - El token de identidad a verificar.
     * @returns {Promise<UsuarioAutenticado>} Una promesa que se resuelve con los datos del usuario si el token es válido.
     * @throws {Error} Si el método no es implementado por la subclase.
     * @throws {Error} Si el token es inválido, expirado o no se puede verificar.
     */
    async verificarToken(token) {
      throw new Error("Método 'verificarToken' no implementado.");
    }
  
    /**
     * Crea un nuevo usuario en el sistema de autenticación.
     * @abstract
     * @param {object} datosUsuario - Datos para crear el usuario.
     * @param {string} datosUsuario.email - Correo electrónico del nuevo usuario.
     * @param {string} datosUsuario.password - Contraseña para el nuevo usuario.
     * @param {string} [datosUsuario.nombre] - (Opcional) Nombre para mostrar del usuario.
     * @param {string} [datosUsuario.telefono] - (Opcional) Número de teléfono.
     * @returns {Promise<UsuarioAutenticado>} Una promesa que se resuelve con los datos del usuario recién creado.
     * @throws {Error} Si el método no es implementado por la subclase.
     * @throws {Error} Si ocurre un error durante la creación (ej: email ya existe).
     */
    async crearUsuario(datosUsuario) {
      throw new Error("Método 'crearUsuario' no implementado.");
    }
  
    /**
     * Obtiene los datos de un usuario por su ID.
     * @abstract
     * @param {string} userId - El ID del usuario a buscar.
     * @returns {Promise<UsuarioAutenticado | null>} Una promesa que se resuelve con los datos del usuario o null si no se encuentra.
     * @throws {Error} Si el método no es implementado por la subclase.
     * @throws {Error} Si ocurre un error al buscar el usuario.
     */
    async obtenerUsuarioPorId(userId) {
      throw new Error("Método 'obtenerUsuarioPorId' no implementado.");
    }
  
    /**
     * (Opcional) Genera un token personalizado para un usuario específico (útil en algunos flujos).
     * @abstract
     * @param {string} userId - El ID del usuario para el que se generará el token.
     * @param {object} [claimsAdicionales] - Claims adicionales para incluir en el token.
     * @returns {Promise<string>} Una promesa que se resuelve con el token personalizado generado.
     * @throws {Error} Si el método no es implementado por la subclase.
     * @throws {Error} Si ocurre un error al generar el token.
     */
    async generarTokenPersonalizado(userId, claimsAdicionales = {}) {
        throw new Error("Método 'generarTokenPersonalizado' no implementado.");
    }
  
    async eliminarUsuario(userId) { 
        throw new Error("Método 'eliminarUsuario' no implementado.");
      }
  }
  
  export default IServicioAutenticacion;
  