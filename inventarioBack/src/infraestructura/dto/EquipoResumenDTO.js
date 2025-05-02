/**
 * @class EquipoResumenDTO
 * @description Data Transfer Object para una vista resumida de un equipo.
 *              Ideal para listas o vistas generales.
 */
class EquipoResumenDTO {
    /**
     * @param {string} id - El ID interno del equipo en la base de datos.
     * @param {string} placa - La placa única del equipo.
     * @param {string} tipoEquipo - El tipo de equipo (ej. Portátil).
     * @param {string} marca - La marca del equipo.
     * @param {string} [ubicacion] - El nombre o ID de la ubicación actual.
     * @param {string} [usuarioAsignado] - El nombre o ID del usuario asignado.
     * @throws {Error} Si el id o la placa son nulos, indefinidos o cadenas vacías.
     */
    constructor(id, placa, tipoEquipo, marca, ubicacion, usuarioAsignado) {
      // Validaciones mínimas para un resumen
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error("El 'id' es requerido para EquipoResumenDTO.");
      }
      if (!placa || typeof placa !== 'string' || placa.trim() === '') {
        throw new Error("La 'placa' es requerida para EquipoResumenDTO.");
      }
  
      this.id = id.trim();
      this.placa = placa.trim();
      this.tipoEquipo = tipoEquipo?.trim() || 'N/A'; // Valor por defecto si no viene
      this.marca = marca?.trim() || 'N/A';
      this.ubicacion = ubicacion?.trim() || null; // Puede ser null si no está ubicado
      this.usuarioAsignado = usuarioAsignado?.trim() || null; // Puede ser null si no está asignado
    }
  }
  
  module.exports = EquipoResumenDTO;