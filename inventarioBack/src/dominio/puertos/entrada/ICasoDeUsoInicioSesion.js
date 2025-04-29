// src/dominio/puertos/entrada/ICasoDeUsoInicioSesion.js
class ICasoDeUsoInicioSesion {
    /**
     * Ejecuta el proceso de inicio de sesión.
     * @param {string} correo - El correo electrónico del usuario.
     * @param {string} contrasena - La contraseña del usuario.
     * @returns {Promise<object>} - Una promesa que resuelve con el resultado del login (ej. datos del usuario, token).
     * @throws {Error} - Lanza un error si las credenciales son inválidas o ocurre otro problema.
     */
    async executar(correo, contrasena) {
      // Este método DEBE ser implementado por las clases que hereden de esta.
      // No debe contener lógica aquí.
      throw new Error("Método 'executar()' debe ser implementado.");
    }
  }
  
  module.exports = ICasoDeUsoInicioSesion; // La exportación va fuera de la clase/método
  