import { Asignacion } from "../../dominio/entidades/AsignacionEntidad";

export class RepositorioAsignacion {
  constructor(AsignacionModelo) {
    this.AsignacionModelo = AsignacionModelo;
  }

  async guardar(asignacion) {
    const asignacionModelo = new this.AsignacionModelo(asignacion);
    await asignacionModelo.save();
    return new Asignacion(asignacionModelo);
  }

  async obtenerPorId(id) {
    const asignacionModelo = await this.AsignacionModelo.findByPk(id);
    if (!asignacionModelo) {
      return null;
    }
    return new Asignacion(asignacionModelo);
  }

  async obtenerTodos() {
    const asignacionesModelo = await this.AsignacionModelo.findAll();
    return asignacionesModelo.map((asignacionModelo) => new Asignacion(asignacionModelo));
  }

  async actualizar(asignacion) {
    const asignacionModelo = await this.AsignacionModelo.findByPk(asignacion.id);
    if (asignacionModelo) {
      await asignacionModelo.update(asignacion);
      return new Asignacion(asignacionModelo);
    }
    return null;
  }

  async eliminar(id) {
    const asignacionModelo = await this.AsignacionModelo.findByPk(id);
    if (asignacionModelo) {
      await asignacionModelo.destroy();
      return true;
    }
    return false;
  }
}
