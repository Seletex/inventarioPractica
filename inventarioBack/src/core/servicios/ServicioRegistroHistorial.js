// c:\Users\Admin\Documents\Github\inventarioPractica\inventarioBack\src\dominio\servicios\ServicioRegistroHistorial.js
class ServicioRegistroHistorial {
  constructor(historialRepositorio) {
    this.historialRepositorio = historialRepositorio; // Necesitarás un repositorio para guardar el historial
  }

  async registrarEvento(tipoEvento, equipoId, usuarioId, detalles) {
    const entradaHistorial = {
      fecha: new Date(),
      tipoEvento: tipoEvento, // 'CREACION', 'TRANSFERENCIA', 'ASIGNACION', 'BAJA', 'ACTUALIZACION'
      equipoId: equipoId,
      usuarioId: usuarioId, // El usuario que realizó la acción
      detalles: detalles, // Un objeto o string con información adicional relevante
      // Ejemplo detalles para transferencia: { usuarioOrigenId: '...', ubicacionOrigenId: '...', usuarioDestinoId: '...', ubicacionDestinoId: '...' }
    };
    try {
      await this.historialRepositorio.guardar(entradaHistorial);
      console.log(
        `Historial registrado: ${tipoEvento} para equipo ${equipoId}`
      );
    } catch (error) {
      console.error("Error al registrar historial:", error);
      // Considera cómo manejar este error. ¿Debería detener la operación principal?
    }
  }

  // Métodos específicos que llaman a registrarEvento con los datos correctos
  async registrarTransferencia(
    equipo,
    usuarioOrigen,
    usuarioDestino,
    ubicacionOrigen,
    ubicacionDestino,
    usuarioQueTransfiere
  ) {
    const detalles = {
      usuarioOrigenId: usuarioOrigen?.usuarioId || null,
      ubicacionOrigenId: ubicacionOrigen?.ubicacionId || null,
      usuarioDestinoId: usuarioDestino.usuarioId,
      ubicacionDestinoId: ubicacionDestino.ubicacionId,
    };
    await this.registrarEvento(
      "TRANSFERENCIA",
      equipo.id,
      usuarioQueTransfiere.usuarioId,
      detalles
    );
  }

  async registrarAsignacion(
    equipo,
    usuarioAsignado,
    usuarioQueAsigna,
    ubicacionDestino
  ) {
    const detalles = {
      usuarioAsignadoId: usuarioAsignado.usuarioId,
      ubicacionDestinoId: ubicacionDestino.ubicacionId,
    };
    await this.registrarEvento(
      "ASIGNACION",
      equipo.placa,
      usuarioQueAsigna.usuarioId,
      ubicacionDestino.ubicacionId,
      detalles
    );
  }
  async registrarActualizacion(
    equipo,
    responsable,
    usuarioAsingado,
    estadoEquipo
  ) {
    const detalles = {
      equipoId: equipo.placa,
      responsableId: responsable.usuarioId,
      usuarioAsignadoId: usuarioAsingado.usuarioId,
    };
    await this.registrarEvento(
      "ACTUALIZACION",
      equipo.id,
      responsable.usuarioId,
      detalles,
      estadoEquipo
    );
  }
  async registrarBaja(equipo, responsable) {
    const detalles = {
      equipoId: equipo.placa,
      responsableId: responsable.usuarioId,
    };
    try {
      await this.registrarEvento(
        "BAJA",
        equipo.id,
        responsable.usuarioId,
        detalles
      );
      console.log(`Historial registrado: BAJA para equipo ${equipo.placa}`);
    } catch (error) {
      console.log(
        "Ha habido un problema al registrar la bade de ${equipo.placa}",
        error
      );
    }
  }
  async registrarEquipo(equipo, responsable) {
    const detalles = {
      equipoId: equipo.placa,
      responsableId: responsable.usuarioId,
    };
    try {
      await this.registrarEvento(
        "CREACION",
        equipo.id,
        responsable.usuarioId,
        detalles
      );
      console.log(`Historial registrado: CREACION para equipo ${equipo.placa}`);
    } catch (error) {
      console.log(
        "Ha habido un problema al registrar la creacion de ${equipo.placa}",
        error
      );
    }
  }
  // ... otros métodos para CREACION, ACTUALIZACION, BAJA, etc.
}

module.exports = ServicioRegistroHistorial;
