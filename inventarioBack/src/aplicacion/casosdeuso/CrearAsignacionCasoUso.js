import { Asignacion } from "../../dominio/entidades/Asignacion.js";
import { AsignacionRepositorio } from "../../dominio/repositorios/AsignacionRepositorio.js";

export class CrearAsignacionCasoUso {
  constructor(repositorio) {
    if (!(repositorio instanceof AsignacionRepositorio)) {
      throw new Error(
        "El repositorio debe ser una instancia de AsignacionRepositorio"
      );
    }
    this.repositorio = repositorio;
  }

  async ejecutar(asignacionDTO) {
    const asignacion = new Asignacion(
      asignacionDTO.id_componente,
      asignacionDTO.id_empleado,
      asignacionDTO.fecha_asignacion,
      asignacionDTO.estado
    );

    return this.repositorio.crear(asignacion);
  }
}
