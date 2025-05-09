class ICasoDeUsoActualizarEquipo {
    /**
     * Ejecuta la lógica para actualizar un equipo.
     * @param {string} equipoId - El ID del equipo a actualizar.
     * @param {object} datosActualizacion - Un objeto con los campos a actualizar.
     * @returns {Promise<Equipo>} El equipo actualizado.
     * @throws {Error} Si el equipo no se encuentra, los datos son inválidos o ocurre un error.
     */
  actualizarEquipo(equipo) {
    throw new Error('Metodo "Actualizar Equipo"no implementado',equipo);
  }
}
module.exports = ICasoDeUsoActualizarEquipo;
