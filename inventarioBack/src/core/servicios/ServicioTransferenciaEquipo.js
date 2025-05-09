// Importar el nuevo servicio de validación
const ServicioValidacionInterna = require("./ServicioValidacionInterna"); // Ajusta la ruta si es necesario

class ServicioTransferenciaEquipo {
  // Añadir servicioValidacionInterna y ubicacionRepositorio (si es necesario para validación)
  constructor(
    usuarioRepositorio,
    equipoRepositorio,
    ubicacionRepositorio,
    servicioValidacionInterna
  ) {
    if (!usuarioRepositorio) {
      throw new Error("El repositorio de usuarios es requerido.");
    }
    if (!equipoRepositorio) {
      throw new Error("El repositorio de equipos es requerido.");
    }
    if (!ubicacionRepositorio) {
      throw new Error("El repositorio de ubicaciones es requerido.");
    }
    // Añadir validación para el nuevo servicio
    if (!servicioValidacionInterna) {
      throw new Error("El servicio de validación interna es requerido.");
    }
    this.usuarioRepositorio = usuarioRepositorio;
    this.equipoRepositorio = equipoRepositorio;
    this.servicioValidacionInterna = servicioValidacionInterna;
  }

  async transferenciaEquipo(transferenciaDto) {
    // Validar el DTO y extraer sus propiedades
    if (!transferenciaDto) {
      throw new Error("El DTO de transferencia es requerido.");
    }
    const { placa, nuevoUsuarioId, nuevaUbicacionId } = transferenciaDto;

    // Validar las propiedades extraídas del DTO
    if (!placa) {
      throw new Error("La placa del equipo a transferir es requerida.");
    }
    if (!nuevoUsuarioId) {
      throw new Error(
        "El ID del nuevo usuario responsable es requerido en el DTO."
      );
    }
    if (!nuevaUbicacionId) {
      throw new Error("El ID de la nueva ubicación es requerido en el DTO.");
    }

    const equipo = await this.equipoRepositorio.buscarPorPlaca(placa); // Usar placa del DTO

    // 2. *** LLAMAR A LA VALIDACIÓN INTERNA ***
    // Pasa el equipo encontrado y los IDs del nuevo usuario y ubicación
    await this.servicioValidacionInterna.validarTransferencia(
      equipo,
      nuevoUsuarioId,
      nuevaUbicacionId
    );

    // 3. Si la validación pasa, proceder a actualizar
    equipo.usuarioIdResponsable = nuevoUsuarioId;
    equipo.ubicacionIdActual = nuevaUbicacionId;

    // 4. Guardar los cambios
    try {
      const equipoActualizado = await this.equipoRepositorio.actualizar(
        equipo.id,
        equipo
      ); // O la forma que use el repo para actualizar
      console.log(
        `Equipo ${placa} transferido exitosamente al usuario ${nuevoUsuarioId} en la ubicación ${nuevaUbicacionId}.`
      ); // Usar variables del DTO

      return equipoActualizado;
    } catch (error) {
      console.error(
        `Error al intentar actualizar el equipo ${placaEquipoATransferir}:`,
        error
      );
      // Podrías querer lanzar un error más específico o manejarlo de otra forma
      throw new Error(
        `Ocurrió un error al guardar la transferencia del equipo ${placaEquipoATransferir}.`
      );
    }
  }
}

// Es buena práctica exportar la clase si estás usando módulos
module.exports = ServicioTransferenciaEquipo;
