const ObjetoUtilidad = require("../utilidades/ObjetoUtilidad");
const TextoUtilidad = require("../utilidades/TextoUtilidad");
const LugarExcepcion = require("./enumerador/LugarExcepcion");

class InventarioExcepcion extends Error {
  constructor(lugar, causa, mensajeUsuario, mensajeTecnico) {
    const mensajeTecnicoLimpio =
      TextoUtilidad.obtenerValorDefectoVacio(mensajeTecnico);
    super(mensajeTecnicoLimpio);
    this.name = "InventarioExcepcion";
    this.lugar = ObjetoUtilidad.obtenerValorDefectoVacio(lugar);
    this.causa = causa;
    this.mensajeUsuario = TextoUtilidad.aplicarAjuste(mensajeUsuario);
    this.mensajeTecnico = TextoUtilidad.aplicarAjuste(mensajeTecnicoLimpio);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InventarioExcepcion);
    }
  }
  getLugar() {
    return this.lugar;
  }
  getCausa() {
    return this.causa;
  }
  getMensajeUsuario() {
    return this.mensajeUsuario;
  }
  getMensajeTecnico() {
    return this.mensajeTecnico;
  }
  tieneCausa() {
    return !ObjetoUtilidad.esNulo(this.causa);
  }

  static crearExcepcion(mensaje, lugarExcepcion) {
    if (ObjetoUtilidad.esNulo(lugarExcepcion)) {
      lugarExcepcion = LugarExcepcion.DESCONOCIDO;
    }
    return new InventarioExcepcion(
      TextoUtilidad.formatearTexto(mensaje),
      lugarExcepcion
    );
  }
}

module.exports = {InventarioExcepcion, LugarExcepcion};
