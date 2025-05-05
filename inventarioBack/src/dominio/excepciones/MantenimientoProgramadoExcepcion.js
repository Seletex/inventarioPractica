class MantenimientoProgramadoExcepcion extends Error {
  constructor(message) {
    super(message);
    this.name = "MantenimientoProgramadoExcepcion";
  }
}

module.exports = MantenimientoProgramadoExcepcion;
