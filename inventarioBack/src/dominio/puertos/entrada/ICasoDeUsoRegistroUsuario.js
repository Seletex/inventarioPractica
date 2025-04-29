
class ICasoDeUsoRegistroUsuario {
     /**
   * Ejecuta el proceso de registro de un nuevo usuario.
   * @param {object} datosUsuario - Objeto con los datos del usuario a registrar.
   * @param {string} datosUsuario.nombre - El nombre completo del usuario.
   * @param {string} datosUsuario.correo - El correo electrónico del usuario.
   * @param {string} datosUsuario.contrasena - La contraseña elegida por el usuario.
   * @param {string} datosUsuario.rol - El rol asignado al usuario (ej. 'CLIENTE', 'VENDEDOR').
   * @returns {Promise<object>} - Una promesa que resuelve con los datos del usuario recién creado (o un mensaje de éxito).
   * @throws {Error} - Lanza un error si el correo ya existe, los datos son inválidos o ocurre otro problema durante el registro.
   */
    async executar(datosUsuario) {
      throw new Error("Método 'executar()' debe ser implementado.",datosUsuario);
    }
  }
  
  module.exports = ICasoDeUsoRegistroUsuario; // La exportación va fuera de la clase/método
  