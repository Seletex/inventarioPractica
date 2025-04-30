class EspecificacionesEquipo {
  constructor(
    ram,
    tipoAlmacenamiento,
    capacidadAlmacenamiento,
    sistemaOperativo,
    versionOffice
  ) {
    this.ram(ram) ?? null;
    this.tipoAlmacenamiento(tipoAlmacenamiento) ?? null;
    this.capacidadAlmacenamiento =
      typeof capacidadAlmacenamiento === "number" &&
      !isNaN(capacidadAlmacenamiento)
        ? capacidadAlmacenamiento
        : null;
    this.sistemaOperativo(sistemaOperativo)??null;
    this.versionOffice(versionOffice)??null;
    Object.freeze(this);
  }
}
module.exports = EspecificacionesEquipo;