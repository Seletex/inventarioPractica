import { Entidad } from "./Entidad.js";

export class Asignacion extends Entidad {
  constructor(id, idUsuario, idEquipo, fechaAsignacion, fechaDevolucion) {
    super(id);
    if (!idUsuario) {
      throw new Error("El id del usuario es requerido");
    }
    if (!idEquipo) {
      throw new Error("El id o placa del equipo es requerido");
    }
    if (!fechaAsignacion) {
      throw new Error("AsignacionEntidad: 'fechaAsignacion' es requerida.");
    }
    this.idUsuario = idUsuario;
    this.idEquipo = idEquipo;
    this.fechaAsignacion = new Date(fechaAsignacion);
    this.fechaDevolucion = fechaDevolucion ? new Date(fechaDevolucion) : null;

    if (isNaN(this.fechaAsignacion.getTime())) {
      throw new Error(
        "AsignacionEntidad: 'fechaAsignacion' no es una fecha válida."
      );
    }
    if (this.fechaDevolucion && isNaN(this.fechaDevolucion.getTime())) {
      throw new Error(
        "AsignacionEntidad: 'fechaDevolucion' no es una fecha válida."
      );
    }
    if (this.fechaDevolucion && this.fechaDevolucion < this.fechaAsignacion) {
      throw new Error(
        "AsignacionEntidad: 'fechaDevolucion' no puede ser anterior a 'fechaAsignacion'."
      );
    }
  }
}
