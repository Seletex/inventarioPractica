const ObjetoUtilidad = require("./ObjetoUtilidad");
const CorteTransversalInventarioExcepcion = require("../excepciones/concreto/CorteTransversalInventarioExcepcion");
const CatalogoMensajes = require("../mensaje/CatalogoMensajes");
const CodigoMensaje = require("../mensaje/enumerador/CodigoMensaje");

const conexionAbierta = (firestoreInstance) => {
  if (ObjetoUtilidad.esNulo(firestoreInstance)) {
    const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000004
    );

    const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000007
    ); // "conexión nula"
    throw CorteTransversalInventarioExcepcion.crearConMensajeTecnico(
      msgUsuario,
      msgTecnico
    );
  }

  // Verificar si es una instancia válida de Firestore.
  if (
    typeof firestoreInstance.collection !== "function" ||
    typeof firestoreInstance.runTransaction !== "function"
  ) {
    throw CorteTransversalInventarioExcepcion.crear(
      "El objeto proporcionado no parece ser una instancia válida de Firestore."
    );
  }
  // Una verificación más profunda podría implicar intentar una operación simple (ej. get en un doc conocido).
  return true;
};

const cerrarConexion = async (firestoreInstance) => {
  if (ObjetoUtilidad.esNulo(firestoreInstance)) {
    const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000004
    );
    // Usar código genérico para cerrar conexión nula
    const msgTecnico = CatalogoMensajes.obtenerContenidoMensaje(
      CodigoMensaje.M00000026
    );
    throw CorteTransversalInventarioExcepcion.crearConMensajeTecnico(
      msgUsuario,
      msgTecnico
    );
  }

  if (
    typeof firestoreInstance.collection !== "function" ||
    typeof firestoreInstance.runTransaction !== "function"
  ) {
    throw CorteTransversalInventarioExcepcion.crear(
      "El objeto proporcionado no parece ser una instancia válida de Firestore para cerrar."
    );
  }

  try {
    // El SDK de Admin tiene un método terminate() para limpiar recursos.
    // Esto es más drástico que cerrar una conexión SQL; úsalo con cuidado
    // (Se encuentra principalmente en el fnal del ciclo de vida de la aplicacion).
    if (typeof firestoreInstance.terminate === "function") {
      await firestoreInstance.terminate();
      console.log(
        "FirestoreUtilidad.cerrarConexion: Instancia de Firestore terminada."
      );
    } else {
      console.warn(
        "FirestoreUtilidad.cerrarConexion: El método terminate() no está disponible en esta instancia de Firestore."
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

const _lanzarErrorTransaccionNoAplicable = (nombreFuncion) => {
  const msgUsuario = CatalogoMensajes.obtenerContenidoMensaje(
    CodigoMensaje.M00000004
  );

  const msgTecnico = `La función '${nombreFuncion}' no es aplicable directamente a Firestore. Utilice db.runTransaction() en su lugar.`;
  throw CorteTransversalInventarioExcepcion.crearConMensajeTecnico(
    msgUsuario,
    msgTecnico
  );
};

const iniciarTransaccion = () => {
  _lanzarErrorTransaccionNoAplicable("iniciarTransaccion");
};

const confirmarTransaccion = () => {
  _lanzarErrorTransaccionNoAplicable("confirmarTransaccion");
};

const cancelarTransaccion = () => {
  _lanzarErrorTransaccionNoAplicable("cancelarTransaccion");
};

module.exports = {
  conexionAbierta,
  cerrarConexion,
  // No exportar las funciones de transacción SQL
  // iniciarTransaccion,
  // confirmarTransaccion,
  // cancelarTransaccion,
};
