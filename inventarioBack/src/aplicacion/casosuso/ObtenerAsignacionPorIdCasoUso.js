import { Asignacion } from "../../dominio/entidades/Asignacion";

export class ObtenerAsignacionPorIdCasoUso {
  constructor(asignacionRepositorio) {
    this.asignacionRepositorio = asignacionRepositorio;
  }

  async ejecutar(id) {
    const asignacion = await this.asignacionRepositorio.obtenerPorId(id);

    if (!asignacion) {
      throw new Error(`Asignación con ID ${id} no encontrada.`);
    }

    return new Asignacion(
      asignacion.id,
      asignacion.id_recurso,
      asignacion.id_usuario,
      asignacion.fecha_asignacion,
      asignacion.fecha_devolucion
    );
  }
}
