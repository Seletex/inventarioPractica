class Entidad {
  constructor(id) {
    this.id = id;
  }

  esIgual(otraEntidad) {
    return this.id === otraEntidad.id;
  }
}

module.exports = Entidad;
