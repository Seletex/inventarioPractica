// src/cortetransversal/utilidades/SqliteUtilidad.js

const ObjetoUtilidad = require("./ObjetoUtilidad");
const CorteTransversalInventarioExcepcion = require("../excepciones/concreto/CorteTransversalInventarioExcepcion");
const CatalogoMensajes = require("../mensaje/CatalogoMensajes");
const CodigoMensaje = require("../mensaje/enumerador/CodigoMensaje");
const Database = require("better-sqlite3");

const conexionAbierta = (conexion) => {
  if (ObjetoUtilidad.esNulo(conexion)) {
    const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000004
    );
    const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000007
    );
    throw CorteTransversalInventarioExcepcion.crearConMensajeTecnico(
      msgUsuario,
      msgTecnico
    );
  }

  if (!(conexion instanceof Database)) {
    throw CorteTransversalInventarioExcepcion.crear(
      "El objeto proporcionado no es una conexión válida de better-sqlite3."
    );
  }

  try {
    return conexion.open;
  } catch (errorDriver) {
    const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000004
    );
    const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000006
    ); // Error genérico
    throw CorteTransversalInventarioExcepcion.crearConCausa(
      errorDriver,
      msgUsuario,
      msgTecnico
    );
  }
};

const cerrarConexion = (conexion) => {
  if (ObjetoUtilidad.esNulo(conexion)) {
    const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000004
    );
    const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000026
    );
    throw CorteTransversalInventarioExcepcion.crearConMensajeTecnico(
      msgUsuario,
      msgTecnico
    );
  }

  if (!(conexion instanceof Database)) {
    throw CorteTransversalInventarioExcepcion.crear(
      "El objeto proporcionado no es una conexión válida de better-sqlite3 para cerrar."
    );
  }

  try {
    if (conexion.open) {
      conexion.close();
    } else {
      console.warn(
        "SqliteUtilidad.cerrarConexion: Intento de cerrar una conexión que ya estaba cerrada."
      );
    }
  } catch (errorDriver) {
    const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000004
    );
    const msgTecnicoCode = errorDriver.code
      ? CodigoMensaje.M00000009
      : CodigoMensaje.M00000010;
    const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(msgTecnicoCode);
    throw CorteTransversalInventarioExcepcion.crearConCausa(
      errorDriver,
      msgUsuario,
      msgTecnico
    );
  }
};

const iniciarTransaccion = (conexion) => {
  if (ObjetoUtilidad.esNulo(conexion)) {
    const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000004
    );
    const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000011
    );
    throw CorteTransversalInventarioExcepcion.crearConMensajeTecnico(
      msgUsuario,
      msgTecnico
    );
  }

  if (!(conexion instanceof Database)) {
    throw CorteTransversalInventarioExcepcion.crear(
      "Objeto de conexión inválido para iniciar transacción SQLite."
    );
  }

  try {
    if (!conexion.open) {
      const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
        CodigoMensaje.M00000004
      );
      const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(
        CodigoMensaje.M00000012
      );
      throw CorteTransversalInventarioExcepcion.crearConMensajeTecnico(
        msgUsuario,
        msgTecnico
      );
    }

    if (conexion.inTransaction) {
      const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
        CodigoMensaje.M00000004
      );
      const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(
        CodigoMensaje.M00000013
      );
      throw CorteTransversalInventarioExcepcion.crearConMensajeTecnico(
        msgUsuario,
        msgTecnico
      );
    }

    conexion.exec("BEGIN");
  } catch (errorDriver) {
    if (errorDriver instanceof CorteTransversalInventarioExcepcion) {
      throw errorDriver;
    }

    const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000004
    );
    const msgTecnicoCode = errorDriver.code
      ? CodigoMensaje.M00000014
      : CodigoMensaje.M00000015;
    const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(msgTecnicoCode);
    throw CorteTransversalInventarioExcepcion.crearConCausa(
      errorDriver,
      msgUsuario,
      msgTecnico
    );
  }
};

const confirmarTransaccion = (conexion) => {
  if (ObjetoUtilidad.esNulo(conexion)) {
    const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000004
    );
    const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000016
    );
    throw CorteTransversalInventarioExcepcion.crearConMensajeTecnico(
      msgUsuario,
      msgTecnico
    );
  }

  if (!(conexion instanceof Database)) {
    throw CorteTransversalInventarioExcepcion.crear(
      "Objeto de conexión inválido para confirmar transacción SQLite."
    );
  }

  try {
    if (!conexion.open) {
      const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
        CodigoMensaje.M00000004
      );
      const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(
        CodigoMensaje.M00000017
      );
      throw CorteTransversalInventarioExcepcion.crearConMensajeTecnico(
        msgUsuario,
        msgTecnico
      );
    }

    if (!conexion.inTransaction) {
      const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
        CodigoMensaje.M00000004
      );
      const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(
        CodigoMensaje.M00000018
      );
      throw CorteTransversalInventarioExcepcion.crearConMensajeTecnico(
        msgUsuario,
        msgTecnico
      );
    }

    conexion.exec("COMMIT");
  } catch (errorDriver) {
    if (errorDriver instanceof CorteTransversalInventarioExcepcion) {
      throw errorDriver;
    }
    const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000004
    );
    const msgTecnicoCode = errorDriver.code
      ? CodigoMensaje.M00000019
      : CodigoMensaje.M00000020;
    const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(msgTecnicoCode);
    throw CorteTransversalInventarioExcepcion.crearConCausa(
      errorDriver,
      msgUsuario,
      msgTecnico
    );
  }
};

const cancelarTransaccion = (conexion) => {
  if (ObjetoUtilidad.esNulo(conexion)) {
    const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000004
    );
    const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000021
    );
    throw CorteTransversalInventarioExcepcion.crearConMensajeTecnico(
      msgUsuario,
      msgTecnico
    );
  }

  if (!(conexion instanceof Database)) {
    throw CorteTransversalInventarioExcepcion.crear(
      "Objeto de conexión inválido para cancelar transacción SQLite."
    );
  }

  try {
    if (!conexion.open) {
      const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
        CodigoMensaje.M00000004
      );
      const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(
        CodigoMensaje.M00000022
      );
      throw CorteTransversalInventarioExcepcion.crearConMensajeTecnico(
        msgUsuario,
        msgTecnico
      );
    }

    if (!conexion.inTransaction) {
      const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
        CodigoMensaje.M00000004
      );
      const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(
        CodigoMensaje.M00000023
      );
      throw CorteTransversalInventarioExcepcion.crearConMensajeTecnico(
        msgUsuario,
        msgTecnico
      );
    }

    conexion.exec("ROLLBACK");
  } catch (errorDriver) {
    if (errorDriver instanceof CorteTransversalInventarioExcepcion) {
      throw errorDriver;
    }
    const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000004
    );
    const msgTecnicoCode = errorDriver.code
      ? CodigoMensaje.M00000024
      : CodigoMensaje.M00000025;
    const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(msgTecnicoCode);
    throw CorteTransversalInventarioExcepcion.crearConCausa(
      errorDriver,
      msgUsuario,
      msgTecnico
    );
  }
};

module.exports = {
  conexionAbierta,
  cerrarConexion,
  iniciarTransaccion,
  confirmarTransaccion,
  cancelarTransaccion,
};
