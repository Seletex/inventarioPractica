/**
 * @class ErrorDTO
 * @description Data Transfer Object para estandarizar las respuestas de error de la API.
 */
class ErrorDTO {
    /**
     * @param {string} mensaje - El mensaje descriptivo del error.
     * @param {number} [codigo=500] - El código de estado HTTP o un código de error interno. Por defecto 500 (Internal Server Error).
     * @param {string} [timestamp] - La fecha y hora en que ocurrió el error (ISO String). Se genera automáticamente si no se proporciona.
     * @throws {Error} Si el mensaje es nulo, indefinido o una cadena vacía.
     */
    constructor(mensaje, codigo = 500, timestamp) {
      if (!mensaje || typeof mensaje !== 'string' || mensaje.trim() === '') {
        throw new Error("El 'mensaje' es requerido para ErrorDTO.");
      }
      if (typeof codigo !== 'number' || !Number.isInteger(codigo) || codigo < 100 || codigo > 599) {
          console.warn(`Código de error inválido (${codigo}) proporcionado a ErrorDTO. Usando 500 por defecto.`);
          codigo = 500;
      }
  
      this.mensaje = mensaje.trim();
      this.codigo = codigo;
      this.timestamp = timestamp || new Date().toISOString(); // Genera timestamp actual si no se provee
    }
  }
  
  module.exports = ErrorDTO;