const { InventarioExcepcion } = require("../InventarioExcepcion");
const { LugarExcepcion } = require("../enumerador/LugarExcepcion");

class CorteTransversalInventarioExcepcion extends InventarioExcepcion { 

    static serialUID = '-9177484194126685659L';
    constructor(causa,mensajeUsuario,mensajeTecnico, ) {
        super(
            LugarExcepcion.CORTETRANSVERSAL,
            causa,
            mensajeUsuario,
            mensajeTecnico
        );
        this.name = "CorteTransversalInventarioExcepcion";
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CorteTransversalInventarioExcepcion);
        }
    }
    static crear(mensajeUsuario) {
        return new CorteTransversalInventarioExcepcion(
            null,
            mensajeUsuario,
            mensajeUsuario
        );
    }
    static crearConMensajeTecnico(mensajeUsuario, mensajeTecnico) {
        return new CorteTransversalInventarioExcepcion(
            null,
            mensajeUsuario,
            mensajeTecnico
        );
    }
    static crearConCausa(causa,mensajeUsuario,mensajeTecnico) {
        return new CorteTransversalInventarioExcepcion(
            causa,
            causa.mensajeUsuario,
            causa.mensajeTecnico
        );
    }
}

module.exports = { CorteTransversalInventarioExcepcion };