class IRepositorioEquipo {
  async guardar(equipo) {
    throw new Error("Metodo'guardar' no implementado");
  }
  async buscarPorId(id) {
    throw new Error("Metodo'buscarPorId' no implementado");
  }
  async actualizar(equipo) {
    throw new Error("Metodo'actualizar' no implementado");
  }
}
module.exports = IRepositorioEquipo;