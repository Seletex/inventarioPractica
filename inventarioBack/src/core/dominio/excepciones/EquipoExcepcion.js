class EquipoExcepcion extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = "EquipoExcepcion";
  }
}

module.exports = EquipoExcepcion;
