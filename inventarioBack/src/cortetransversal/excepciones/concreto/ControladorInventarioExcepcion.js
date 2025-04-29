const { InventarioExcepcion } = require("../InventarioExcepcion");
const { LugarExcepcion } = require("../enumerador/LugarExcepcion");

class ControladorInventarioExcepcion extends InventarioExcepcion {
  constructor(causa, mensajeUsuario, mensajeTecnico) {
    super(
      LugarExcepcion.INFRAESTRUCTURA,
      causa,
      mensajeUsuario,
      mensajeTecnico
    );
    this.name = "ControladorInventarioExcepcion";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ControladorInventarioExcepcion);
    }
  }
  static crear(mensajeUsuario) {
    return new ControladorInventarioExcepcion(
      null,
      mensajeUsuario,
      mensajeUsuario
    );
  }
  static crearConMensajeTecnico(mensajeUsuario, mensajeTecnico) {
    return new ControladorInventarioExcepcion(
      null,
      mensajeUsuario,
      mensajeTecnico
    );
  }
  static crearConCausa(causa,mensajeUsuario,mensajeTecnico) {
    return new ControladorInventarioExcepcion(
      causa,
      mensajeUsuario,
      mensajeTecnico
    );
  }
}

module.exports = ControladorInventarioExcepcion;
