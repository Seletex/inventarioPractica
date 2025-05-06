import { Equipo } from "../../dominio/entidades/EquipoEntidad";

export class EquipoRepositorio {
  constructor(database) {
    this.db = database;
  }

  async guardar(equipo) {
    const { nombre, descripcion, tipoEquipoId } = equipo;
    const [id] = await this.db("equipos")
      .insert({
        nombre,
        descripcion,
        tipo_equipo_id: tipoEquipoId,
      })
      .returning("id");

    return new Equipo(id, nombre, descripcion, tipoEquipoId);
  }

  async obtenerPorId(id) {
    const equipoData = await this.db("equipos").where({ id }).first();
    if (!equipoData) {
      return null;
    }
    return new Equipo(
      equipoData.id,
      equipoData.nombre,
      equipoData.descripcion,
      equipoData.tipo_equipo_id
    );
  }

  async obtenerTodos() {
    const equiposData = await this.db("equipos").select("*");
    return equiposData.map(
      (equipoData) =>
        new Equipo(
          equipoData.id,
          equipoData.nombre,
          equipoData.descripcion,
          equipoData.tipo_equipo_id
        )
    );
  }

  async actualizar(equipo) {
    const { id, nombre, descripcion, tipoEquipoId } = equipo;
    await this.db("equipos").where({ id }).update({
      nombre,
      descripcion,
      tipo_equipo_id: tipoEquipoId,
    });
    return new Equipo(id, nombre, descripcion, tipoEquipoId);
  }

  async eliminar(id) {
    await this.db("equipos").where({ id }).del();
  }
}
