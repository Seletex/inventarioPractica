const ObjetoUtilidad = require("./ObjetoUtilidad.js");

class NumeroUtilidad {
  static ZERO = 0;
  static UNO = 1;
  constructor() {
    super(); // Constructor privado para evitar instanciación
  }

  static esNumeroValido(valor) {
    // Verifica que sea de tipo 'number' y no sea NaN
    return typeof valor === "number" && !isNaN(valor);
  }

  static obtenerNumeroDefecto(valor, valorDefecto) {
    return this.esNumeroValido(valor) ? valor : valorDefecto;
  }

  static obtenerNumeroDefectoSiInvalido(valor) {
    return this.obtenerNumeroDefecto(valor, this.ZERO);
  }

  static _normalizarParaComparacion(numero) {
    // Normaliza el número para la comparación, eliminando decimales si es entero
    return this.obtenerNumeroDefectoSiInvalido(numero);
  }
  static esMayorQue(numeroUno, numeroDos) {
    return (
      this._normalizarParaComparacion(numeroUno) >
      this._normalizarParaComparacion(numeroDos)
    );
  }
  static esMenorQue(numeroUno, numeroDos) {
    return (
      this._normalizarParaComparacion(numeroUno) <
      this._normalizarParaComparacion(numeroDos)
    );
  }
  static esIgualQue(numeroUno, numeroDos) {
    return (
      this._normalizarParaComparacion(numeroUno) ===
      this._normalizarParaComparacion(numeroDos)
    );
  }
  static esMayorOIgualQue(numeroUno, numeroDos) {
    return (
      this._normalizarParaComparacion(numeroUno) >=
      this._normalizarParaComparacion(numeroDos)
    );
  }
  static esMenorOIgualQue(numeroUno, numeroDos) {
    return (
      this._normalizarParaComparacion(numeroUno) <=
      this._normalizarParaComparacion(numeroDos)
    );
  }
  static esDiferenteQue(numeroUno, numeroDos) {
    return (
      this._normalizarParaComparacion(numeroUno) !==
      this._normalizarParaComparacion(numeroDos)
    );
  }
  static estaNulo(valor) {
    return ObjetoUtilidad.esNulo(valor);
  }
  static esInterpretableComoNumero(valor) {
    if (ObjetoUtilidad.esNulo(valor)) {
      return false;
    }
    return !isNaN(valor) && !isNaN(parseFloat(valor));
  }
}
module.exports = NumeroUtilidad;
