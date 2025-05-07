// src/aplicacion/casos-uso/NotificarUsuarioRegistro.js
class NotificarUsuarioRegistro {
    constructor(servicioCorreo) { // Recibe la interfaz, no la implementación
      if (!servicioCorreo || typeof servicioCorreo.enviarCorreo !== 'function') {
         throw new Error("Se requiere una instancia válida de IServicioCorreo.");
      }
      this.servicioCorreo = servicioCorreo;
    }
  
    async ejecutar(usuario) {
      const opcionesCorreo = {
        destinatario: usuario.email,
        asunto: '¡Bienvenido a Nuestra Plataforma!',
        texto: `Hola ${usuario.nombre}, ¡gracias por registrarte!`,
        html: `<p>Hola <strong>${usuario.nombre}</strong>, ¡gracias por registrarte!</p>`,
      };
      try {
        await this.servicioCorreo.enviarCorreo(opcionesCorreo);
        console.log(`Correo de bienvenida enviado a ${usuario.email}`);
      } catch (error) {
        console.error(`Fallo al enviar correo de bienvenida a ${usuario.email}:`, error);
        // Manejar el error (log, reintentar, etc.)
      }
    }
  }
  
  export default NotificarUsuarioRegistro;
  