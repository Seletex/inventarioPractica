class IRepositorioEquipo {
  async guardar(equipo) {
    throw new Error("Metodo'guardar' no implementado");
  }
  async buscarPorId(placa) {
    throw new Error("Metodo'buscarPorId' no implementado");
  }
  async actualizar(placa, equipo) { // <-- Añadir 'id' como parámetro
    throw new Error("Metodo'actualizar' no implementado");
  }
  // Añadir el método que ya estás usando en ServicioTransferenciaEquipo
  async buscarPorPlaca(placa) {
    throw new Error("Metodo 'buscarPorPlaca' no implementado");
  }
}
module.exports = IRepositorioEquipo;