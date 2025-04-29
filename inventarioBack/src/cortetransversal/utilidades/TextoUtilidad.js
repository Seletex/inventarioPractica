class TextoUtilidad {
  constructor() {
    super(); // Constructor privado para evitar instanciación
  }
  static VACIO = "";
  static ESPACIO = " ";
  static PATRON_SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  static PATRON_SOLO_NUMEROS = /^[0-9]+$/;
  static PATRON_SOLO_NUMEROS_DECIMALES = /^[0-9]+(\.[0-9]+)?$/;
  static PATRON_SOLO_LETRAS_Y_NUMEROS = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  static PATRON_SOLO_LETRAS_Y_NUMEROS_Y_PUNTUACION =
    /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,;:!?¿¡()]+$/;
  static PATRON_SOLO_LETRAS_ESPACIOS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  static PATRON_SOLO_LETRAS_ESPECIALES =
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,;:!?¿¡()]+$/;

  static estaNulo(valor) {
    return valor === null || valor === undefined;
  }

  static obtenerValorDefecto(valor, valorDefecto) {
    if (valor === null || valor === undefined) {
      return valorDefecto;
    }
    return valor;
  }

  static esVacio(texto) {
    if (typeof texto !== "string") {
      throw new Error("El argumento debe ser una cadena de texto.");
    }
    return texto.trim() === TextoUtilidad.VACIO;
  }

  static obtenerValorDefectoVacio(valor) {
    return this.obtenerValorDefecto(valor, TextoUtilidad.VACIO);
  }

  static aplicarAjuste(valor) {
    return this.obtenerValorDefectoVacio(valor).trim().toLowerCase();
  }

  static estaVacio(valor) {
    return this.aplicarAjuste(valor) === TextoUtilidad.VACIO;
  }

  static igualSinAjuste(valorUno, valorDos) {
    return String(valorUno) === String(valorDos);
  }

  static igualConAjuste(valorUno, valorDos) {
    return this.aplicarAjuste(valorUno) === this.aplicarAjuste(valorDos);
  }

  static igualSinAjusteCasoIgnorado(valorUno, valorDos) {
    return (
      this.obtenerValorDefectoVacio(valorUno).toLowerCase() ===
      this.obtenerValorDefectoVacio(valorDos).toLowerCase()
    );
  }

  static igualConAjusteCasoIgnorado(valorUno, valorDos) {
    return (
      this.aplicarAjuste(valorUno).toLowerCase() ===
      this.aplicarAjuste(valorDos).toLowerCase()
    );
  }

  static longitudMinimaValida(valor, longitud) {
    return this.aplicarAjuste(valor).length >= longitud;
  }

  static longitudMaximaValida(valor, longitud) {
    return this.aplicarAjuste(valor).length <= longitud;
  }

  static longitudValida(valor, longitudMinima, longitudMaxima) {
    return (
      this.longitudMinimaValida(valor, longitudMinima) &&
      this.longitudMaximaValida(valor, longitudMaxima)
    );
  }

  static contieneSoloLetras(valor) {
    return this.PATRON_SOLO_LETRAS.test(this.aplicarAjuste(valor));
  }
  
  static contieneSoloLetrasEspaciosNumeros(valor) {
    return this.PATRON_SOLO_LETRAS_ESPACIOS_NUMEROS.test(
      this.aplicarAjuste(valor)
    );
  }

  static contieneSoloLetrasEspacios(valor) {
    return this.PATRON_SOLO_LETRAS_ESPACIOS.test(this.aplicarAjuste(valor));
  }

  static contieneSoloNumeros(valor) {
    return this.PATRON_SOLO_NUMEROS.test(this.aplicarAjuste(valor));
  }
  
  static convertirTextoAMinusculas(texto) {
    if (typeof texto !== "string") {
      throw new Error("El argumento debe ser una cadena de texto.");
    }
    return texto.toLowerCase();
  }
  
  static convertirTextoAMayusculas(texto) {
    if (typeof texto !== "string") {
      throw new Error("El argumento debe ser una cadena de texto.");
    }
    return texto.toUpperCase();
  }
}
module.exports = TextoUtilidad;
// Ejemplo de uso:
// const TextoUtilidad = require('./TextoUtilidad');
// const texto = "Hola Mundo!";
