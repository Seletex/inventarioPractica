const { InventarioExcepcion } = require("../InventarioExcepcion");
const { LugarExcepcion } = require("../enumerador/LugarExcepcion");

class DatoInventarioExcepcion extends InventarioExcepcion{
    constructor(causa, mensajeUsuario, mensajeTecnico) {
        super(LugarExcepcion.DATO, causa, mensajeUsuario, mensajeTecnico);
        this.name = "DatoInventarioExcepcion";
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DatoInventarioExcepcion);
        }
    }
    static crear(mensajeUsuario) {
        return new DatoInventarioExcepcion(null, mensajeUsuario, mensajeUsuario);
    }
    static crearConMensajeTecnico(mensajeUsuario, mensajeTecnico) {
        return new DatoInventarioExcepcion(null, mensajeUsuario, mensajeTecnico);
    }
    static crearConCausa(causa, mensajeUsuario, mensajeTecnico) {
        return new DatoInventarioExcepcion(causa, mensajeUsuario, mensajeTecnico);
    }
}

module.exports = {
    DatoInventarioExcepcion
}
