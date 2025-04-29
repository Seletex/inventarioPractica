const { InventarioExcepcion } = require("../InventarioExcepcion");
const { LugarExcepcion } = require("../enumerador/LugarExcepcion");

class ServicioInventarioExcepcion extends InventarioExcepcion{
    constructor(causa, mensajeUsuario, mensajeTecnico) {
        super(LugarExcepcion.SERVICIO, causa, mensajeUsuario, mensajeTecnico);
        this.name = "ServicioInventarioExcepcion";
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ServicioInventarioExcepcion);
        }
    }
    static crear(mensajeUsuario) {
        return new ServicioInventarioExcepcion(null, mensajeUsuario, mensajeUsuario);
    }
    static crearConMensajeTecnico(mensajeUsuario, mensajeTecnico) {
        return new ServicioInventarioExcepcion(null, mensajeUsuario, mensajeTecnico);
    }
    static crearConCausa(causa, mensajeUsuario, mensajeTecnico) {
        return new ServicioInventarioExcepcion(causa, mensajeUsuario, mensajeTecnico);
    }
}

module.exports = {
    ServicioInventarioExcepcion
}