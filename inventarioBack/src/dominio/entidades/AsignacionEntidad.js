import { Entidad } from "./Entidad.js";

export class Asignacion extends Entidad {
  constructor(id, idUsuario, idEquipo, fechaAsignacion, fechaDevolucion) {
    super(id);
    this.idUsuario = idUsuario;
    this.idEquipo = idEquipo;
    this.fechaAsignacion = fechaAsignacion;
    this.fechaDevolucion = fechaDevolucion;
  }
}
