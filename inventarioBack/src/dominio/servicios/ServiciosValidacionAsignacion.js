//dominio/servicios
class ServicioValidacionAsignacion {
  constructor(equipoRepositorio, usuarioRepositorio) {
    this.equipoRepositorio = equipoRepositorio;
    this.usuarioRepositorio = usuarioRepositorio;
  }

  async puedeAsignarEquipo(equipo, usuarioId) {
    // 1. Verificar si el equipo está en estado asignable (ya lo hace la entidad)
    // 2. Buscar otros equipos del mismo tipo asignados al usuario
    const equiposAsignados =
      await this.equipoRepositorio.buscarPorResponsableYTipo(
        usuarioId,
        equipo.tipoEquipoId
        
      );
    if (equiposAsignados.length > 0 && equipo.tipoEquipoId === "LAPTOP") {
      // Regla: solo una laptop por usuario
      throw new Error(`El usuario ${usuarioId} ya tiene una laptop asignada.`);
    }
    if (equiposAsignados.length > 0 && equipo.tipoEquipoId === "IMPRESORA") {
      throw new Error(
        `El usuario ${usuarioId} ya tiene una impresora asignada.`
      );
    }
    if (equiposAsignados.length > 0 && equipo.tipoEquipoId === "MONITOR") {
      throw new Error(`El usuario ${usuarioId} ya tiene un monitor asignado.`);
    }
    if (equiposAsignados.length > 0 && equipo.tipoEquipoId === "COMPUTADORA") {
      throw new Error(
        `El usuario ${usuarioId} ya tiene una computadora asignada.`
      );
    }

    // 3. Otras reglas...
    return true;
  }
}
module.exports = ServicioValidacionAsignacion;