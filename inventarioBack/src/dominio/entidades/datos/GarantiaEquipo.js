class GarantiaEquipo {
  constructor(tieneGarntia,duracionGarantia) {
    this.tieneGarntia(tieneGarntia) ?? null;
    this.duracionGarantia(duracionGarantia) ?(duracionGarantia??null): null;
    Object.freeze(this);
  }
}module.exports = GarantiaEquipo;