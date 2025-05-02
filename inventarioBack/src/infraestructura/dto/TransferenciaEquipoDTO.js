
class TransferenciaEquipoDTO {
  /**
   * @param {string} placa La placa única del equipo.
   * @param {string} nuevoUsuarioId El ID del nuevo usuario responsable.
   * @param {string} nuevaUbicacionId El ID de la nueva ubicación.
   * @throws {Error} Si alguno de los parámetros es nulo, indefinido o una cadena vacía.
   */
  constructor(placa, nuevoUsuarioId, nuevaUbicacionId) {
    // Validación estricta en la creación del DTO
    if (!placa || typeof placa !== 'string' || placa.trim() === '') {
      throw new Error("La 'placa' es requerida y debe ser una cadena no vacía para TransferenciaEquipoDTO.");
    }
    if (!nuevoUsuarioId || typeof nuevoUsuarioId !== 'string' || nuevoUsuarioId.trim() === '') {
      throw new Error("El 'nuevoUsuarioId' es requerido y debe ser una cadena no vacía para TransferenciaEquipoDTO.");
    }
    if (!nuevaUbicacionId || typeof nuevaUbicacionId !== 'string' || nuevaUbicacionId.trim() === '') {
      throw new Error("La 'nuevaUbicacionId' es requerida y debe ser una cadena no vacía para TransferenciaEquipoDTO.");
    }

    this.placa = placa.trim();
    this.nuevoUsuarioId = nuevoUsuarioId.trim();
    this.nuevaUbicacionId = nuevaUbicacionId.trim();
  }
}

module.exports = TransferenciaEquipoDTO;
