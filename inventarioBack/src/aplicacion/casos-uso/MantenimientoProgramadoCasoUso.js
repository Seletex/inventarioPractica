import { MantenimientoProgramado } from "../../dominio/MantenimientoProgramado";
import { ResultadoCasoUso } from "./ResultadoCasoUso";

export class MantenimientoProgramadoCasoUso {
  constructor(repositorioMantenimientoProgramado) {
    this.repositorioMantenimientoProgramado = repositorioMantenimientoProgramado;
  }

  async obtenerMantenimientosProgramados() {
    const mantenimientosProgramados =
      await this.repositorioMantenimientoProgramado.obtenerMantenimientosProgramados();
    return new ResultadoCasoUso(mantenimientosProgramados, null);
  }

  async obtenerMantenimientoProgramadoPorId(id) {
    const mantenimientoProgramado =
      await this.repositorioMantenimientoProgramado.obtenerMantenimientoProgramadoPorId(
        id
      );
    if (!mantenimientoProgramado) {
      return new ResultadoCasoUso(
        null,
        "Mantenimiento programado no encontrado"
      );
    }
    return new ResultadoCasoUso(mantenimientoProgramado, null);
  }

  async crearMantenimientoProgramado(mantenimientoProgramadoDTO) {
    const mantenimientoProgramado = new MantenimientoProgramado(
      mantenimientoProgramadoDTO.id,
      mantenimientoProgramadoDTO.equipoId,
      mantenimientoProgramadoDTO.fechaProgramada,
      mantenimientoProgramadoDTO.descripcion,
      mantenimientoProgramadoDTO.estado,
      mantenimientoProgramadoDTO.tipoMantenimiento
    );

    const id = await this.repositorioMantenimientoProgramado.crearMantenimientoProgramado(
      mantenimientoProgramado
    );
    return new ResultadoCasoUso(id, null);
  }

  async actualizarMantenimientoProgramado(mantenimientoProgramadoDTO) {
    const mantenimientoProgramado = new MantenimientoProgramado(
      mantenimientoProgramadoDTO.id,
      mantenimientoProgramadoDTO.equipoId,
      mantenimientoProgramadoDTO.fechaProgramada,
      mantenimientoProgramadoDTO.descripcion,
      mantenimientoProgramadoDTO.estado,
      mantenimientoProgramadoDTO.tipoMantenimiento
    );

    const exito =
      await this.repositorioMantenimientoProgramado.actualizarMantenimientoProgramado(
        mantenimientoProgramado
      );
    if (!exito) {
      return new ResultadoCasoUso(
        null,
        "No se pudo actualizar el mantenimiento programado"
      );
    }
    return new ResultadoCasoUso(true, null);
  }

  async eliminarMantenimientoProgramado(id) {
    const exito =
      await this.repositorioMantenimientoProgramado.eliminarMantenimientoProgramado(
        id
      );
    if (!exito) {
      return new ResultadoCasoUso(
        null,
        "No se pudo eliminar el mantenimiento programado"
      );
    }
    return new ResultadoCasoUso(true, null);
  }
}
