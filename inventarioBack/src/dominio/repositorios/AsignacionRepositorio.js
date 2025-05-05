export default class AsignacionRepositorio {
  constructor() {
    if (new.target === AsignacionRepositorio) {
      throw new Error(
        "No se puede instanciar una clase abstracta. Utilice una clase concreta en su lugar"
      );
    }
  }
  async guardar(asignacion) {}
  async eliminar(asignacion) {}
  async obtenerPorId(id) {}
  async obtenerTodos() {}
}
