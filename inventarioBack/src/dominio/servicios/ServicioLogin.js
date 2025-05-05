const RespuestaAutorizacion = require("../../infraestructura/dto/RespuestaAutorizacion");

/**
 * @class ServicioLogin
 * @description Servicio de aplicación para manejar la autenticación de usuarios.
 */
class ServicioLogin {
  /**
   * @param {ServicioUsuario} servicioUsuario - Servicio para buscar usuarios.
   * @param {ServicioJWT} servicioJWT - Servicio para generar tokens JWT.
   * @param {function} compararContraseñaFn - Función para comparar contraseñas (de utilidadesContraseña).
   */
  constructor(servicioUsuario, servicioJWT, compararContraseñaFn) {
    if (!servicioUsuario) throw new Error("ServicioUsuario es requerido.");
    if (!servicioJWT) throw new Error("ServicioJWT es requerido.");
    if (typeof compararContraseñaFn !== 'function') throw new Error("La función compararContraseña es requerida.");

    this.servicioUsuario = servicioUsuario;
    this.servicioJWT = servicioJWT;
    this.compararContraseña = compararContraseñaFn;
  }

  /**
   * Autentica a un usuario basado en sus credenciales.
   * @param {LoginDTO} loginDto - DTO con correo y contraseña.
   * @returns {Promise<RespuestaAutorizacion>} DTO con el token y el rol del usuario.
   * @throws {Error} Si las credenciales son inválidas o el usuario no se encuentra.
   */
  async login(loginDto) {
    // 1. Buscar usuario por correo
    // Asumiendo que ServicioUsuario tiene un método como 'buscarPorCorreo' que devuelve el usuario con su hash de contraseña
    const usuario = await this.servicioUsuario.buscarPorCorreo(loginDto.correo);
    if (!usuario) {
      throw new Error("Credenciales inválidas."); // Mensaje genérico por seguridad
    }

    // 2. Comparar contraseñas
    const contraseñaValida = await this.compararContraseña(loginDto.contraseña, usuario.contraseña); // Asume que el usuario tiene la propiedad 'contraseña' con el hash
    if (!contraseñaValida) {
      throw new Error("Credenciales inválidas."); // Mensaje genérico
    }

    // 3. Generar Token JWT
    const payload = {
      id: usuario.id, // Asegúrate que el objeto usuario tenga 'id' y 'rol'
      rol: usuario.rol
    };
    const token = this.servicioJWT.generarToken(payload);

    // 4. Crear y devolver la respuesta
    return new RespuestaAutorizacion(token, usuario.rol);
  }
}

module.exports = ServicioLogin;