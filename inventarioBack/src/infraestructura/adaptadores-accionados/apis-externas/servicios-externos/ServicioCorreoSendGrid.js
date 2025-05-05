// src/infraestructura/adaptadores-accionados/servicios-externos/ServicioEmailSendgrid.js
import IServicioCorreo from '../IServicioCorreo.js';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Configurar API Key

class ServicioCorreoSendgrid extends IServicioCorreo {
  async enviarCorreo(opciones) {
    const msg = {
      to: opciones.destinatario,
      from: opciones.remitente || process.env.EMAIL_FROM_DEFAULT, // Usar remitente opcional o uno por defecto
      subject: opciones.asunto,
      text: opciones.texto,
      html: opciones.html,
    };
    try {
      console.log(`Enviando correo a ${opciones.destinatario} via SendGrid...`);
      await sgMail.send(msg);
      console.log('Correo enviado exitosamente via SendGrid.');
    } catch (error) {
      console.error('Error enviando correo via SendGrid:', error?.response?.body || error);
      // Podrías relanzar un error más específico de tu aplicación si es necesario
      throw new Error(`Error al enviar correo: ${error.message}`);
    }
  }
}

export default ServicioCorreoSendgrid;
