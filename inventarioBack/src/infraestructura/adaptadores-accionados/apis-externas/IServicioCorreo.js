// src/aplicacion/puertos/IServicioCorreo.js
// o src/dominio/puertos/IServicioCorreo.js

/**
 * @interface IServicioCorreo
 * @description Define el contrato para enviar correos electrónicos dentro de la aplicación.
 *              Cualquier adaptador de correo (SendGrid, Mailgun, etc.) debe implementar esta interfaz.
 */
class IServicioCorreo {
    /**
     * Envía un correo electrónico.
     * @abstract
     * @param {object} opciones - Las opciones del correo.
     * @param {string} opciones.destinatario - La dirección de correo del destinatario.
     * @param {string} opciones.asunto - El asunto del correo.
     * @param {string} [opciones.texto] - El contenido del correo en formato texto plano.
     * @param {string} [opciones.html] - El contenido del correo en formato HTML.
     * @param {string} [opciones.remitente] - (Opcional) La dirección de correo del remitente (si difiere del predeterminado).
     * @returns {Promise<void>} Una promesa que se resuelve cuando el correo se ha enviado (o encolado para envío).
     * @throws {Error} Si el método no es implementado por la subclase.
     * @throws {Error} Si ocurre un error durante el envío.
     */
    async enviarCorreo(opciones) {
      // Lanza un error para asegurar que las clases hijas implementen este método.
      throw new Error("Método 'enviarCorreo' no implementado.");
    }
  
    // Podrías añadir más métodos si necesitas funcionalidades específicas, como:
    async enviarCorreoConAdjunto(opciones, adjunto) {
       throw new Error("Método 'enviarCorreoConAdjunto' no implementado.");
     }
    //
     async validarDireccionCorreo(email) {
       throw new Error("Método 'validarDireccionCorreo' no implementado.");
     }
  }
  
  export default IServicioCorreo;

  