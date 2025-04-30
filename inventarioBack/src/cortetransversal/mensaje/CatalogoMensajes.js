// src/cortetransversal/mensaje/CatalogoMensajes.js

const Mensaje = require('./Mensaje');
const CodigoMensaje = require('./enumerador/CodigoMensaje');
const TipoMensaje = require('./enumerador/TipoMensaje');
const CategoriaMensaje = require('./enumerador/CategoriaMensaje');
const ObjetoUtilidad = require('../utilidades/ObjetoUtilidad');
const CorteTransversalInventarioExcepcion = require('../excepciones/concreto/CorteTransversalInventarioExcepcion');

const mensajes = new Map();

const agregarMensaje = (mensaje) => {
  if (!mensaje || ObjetoUtilidad.esNulo(mensaje.codigo)) {
     console.error("Intento de agregar un mensaje inválido al catálogo:", mensaje);
     return;
  }
  mensajes.set(mensaje.codigo, mensaje);
};

const cargarMensajes = () => {
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000001, TipoMensaje.TECNICO, CategoriaMensaje.FATAL,
    "No se recibió el código del mensaje que se quería crear. No es posible continuar con el proceso..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000002, TipoMensaje.TECNICO, CategoriaMensaje.FATAL,
    "No existe un mensaje con el código indicado. No es posible continuar con el proceso..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000003, TipoMensaje.TECNICO, CategoriaMensaje.FATAL,
    "No es posible obtener un mensaje con un código vacío o nulo. No es posible continuar con el proceso..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000004, TipoMensaje.USUARIO, CategoriaMensaje.FATAL,
    "Se ha presentado un problema inesperado tratando de llevar a cabo la operación deseada. Por favor intente de nuevo y si el problema persiste, contacte al administrador de la aplicación..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000005, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de validar si la conexión SQL estaba abierta. Se presentó una excepción de tipo SQLException. Por favor verifique la traza completa del error presentado, para así poder diagnosticar con mayor certeza qué sucedió..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000006, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema inesperado tratando de validar si la conexión SQL estaba abierta. Se presentó una excepción genérica de tipo Exception. Por favor verifique la traza completa del error presentado, para así poder diagnosticar con mayor certeza qué sucedió..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000007, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "No es posible validar si una conexión está abierta cuando es nula..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000008, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "No es posible cerrar una conexión que ya fue cerrada..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000009, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de cerrar una conexión SQL. Se presentó una excepción de tipo SQLException. Por favor verifique la traza completa del error presentado, para así poder diagnosticar con mayor certeza qué sucedió..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000010, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema inesperado tratando de cerrar la conexión. Se presentó una excepción genérica de tipo Exception. Por favor verifique la traza completa del error presentado, para así poder diagnosticar con mayor certeza qué sucedió..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000011, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "No es posible iniciar una transacción con una conexión que está nula..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000012, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "No es posible iniciar una transacción con una conexión cerrada..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000013, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "No es posible iniciar una transacción que ya ha sido iniciada..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000014, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de iniciar la transacción de una conexión SQL. Se presentó una excepción de tipo SQLException. Por favor verifique la traza completa del error presentado, para así poder diagnosticar con mayor certeza qué sucedió..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000015, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema inesperado tratando de iniciar la transacción de una conexión. Se presentó una excepción genérica de tipo Exception. Por favor verifique la traza completa del error presentado, para así poder diagnosticar con mayor certeza qué sucedió..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000016, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "No es posible confirmar una transacción con una conexión que está nula..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000017, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "No es posible confirmar una transacción con una conexión cerrada..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000018, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "No es posible confirmar una transacción que no fue iniciada..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000019, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de confirmar la transacción de una conexión SQL. Se presentó una excepción de tipo SQLException. Por favor verifique la traza completa del error presentado, para así poder diagnosticar con mayor certeza qué sucedió..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000020, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema inesperado tratando de confirmar la transacción de una conexión. Se presentó una excepción genérica de tipo Exception. Por favor verifique la traza completa del error presentado, para así poder diagnosticar con mayor certeza qué sucedió..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000021, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "No es posible cancelar una transacción con una conexión que está nula..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000022, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "No es posible cancelar una transacción con una conexión cerrada..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000023, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "No es posible cancelar una transacción que no fue iniciada..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000024, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de cancelar la transacción de una conexión SQL. Se presentó una excepción de tipo SQLException. Por favor verifique la traza completa del error presentado, para así poder diagnosticar con mayor certeza qué sucedió..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000025, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema inesperado cancelar de confirmar la transacción de una conexión. Se presentó una excepción genérica de tipo Exception. Por favor verifique la traza completa del error presentado, para así poder diagnosticar con mayor certeza qué sucedió..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000026, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "No es posible cerrar una conexión que está nula..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000027, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de obtener la conexión con SQL Server. Se presentó una excepción de tipo SQLException. Por favor verifique la traza completa del error presentado, para así poder diagnosticar con mayor certeza qué sucedió..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000028, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema inesperado tratando de obtener la conexión con SQL Server. Se presentó una excepción genérica de tipo Exception. Por favor verifique la traza completa del error presentado, para así poder diagnosticar con mayor certeza qué sucedió..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000029, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "La Factorìa de datos para PostgreSQL no se encuentra implementada..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000030, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "La Factorìa de datos para MySQL no se encuentra implementada..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000031, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "La Factorìa de datos para Oracle no se encuentra implementada..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000032, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "La Factorìa de datos deseada no se encuentra implementada..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000033, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de obtener el DAO de CalendarioSQLServerDAO debido a que la conexiòn actualmente està cerrada, por lo que no hay una conexiòn vàlida disponible..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000034, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de obtener el DAO de DuracionSQLServerDAO debido a que la conexiòn actualmente està cerrada, por lo que no hay una conexiòn vàlida disponible..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000035, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de crear el DAO deseado, debido a que la conexiòn actualmente està cerrada, por lo que no hay una conexiòn vàlida disponible..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000036, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de obtener el DAO de EjercicioSQLServerDAO debido a que la conexiòn actualmente està cerrada, por lo que no hay una conexiòn vàlida disponible..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000037, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de obtener el DAO de EstadoEntrenadorSQLServerDAO debido a que la conexiòn actualmente està cerrada, por lo que no hay una conexiòn vàlida disponible..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000038, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de obtener el DAO de HorarioSQLServerDAO debido a que la conexiòn actualmente està cerrada, por lo que no hay una conexiòn vàlida disponible..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000039, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de obtener el DAO de MiembroSQLServerDAO debido a que la conexiòn actualmente està cerrada, por lo que no hay una conexiòn vàlida disponible..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000040, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de obtener el DAO de PlanEntrenamientoSQLServerDAO debido a que la conexiòn actualmente està cerrada, por lo que no hay una conexiòn vàlida disponible..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000041, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de obtener el DAO de RepeticionSQLServerDAO debido a que la conexiòn actualmente està cerrada, por lo que no hay una conexiòn vàlida disponible..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000042, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de obtener el DAO de RutinaSQLServerDAO debido a que la conexiòn actualmente està cerrada, por lo que no hay una conexiòn vàlida disponible..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000043, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de obtener el DAO de SerieSQLServerDAO debido a que la conexiòn actualmente està cerrada, por lo que no hay una conexiòn vàlida disponible..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000044, TipoMensaje.TECNICO, CategoriaMensaje.ERROR,
    "Se ha presentado un problema tratando de obtener el DAO de TipoDocumnetoSQLServerDAO debido a que la conexiòn actualmente està cerrada, por lo que no hay una conexiòn vàlida disponible..."));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000045, TipoMensaje.TECNICO, CategoriaMensaje.ERROR, ""));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000046, TipoMensaje.TECNICO, CategoriaMensaje.ERROR, ""));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000047, TipoMensaje.TECNICO, CategoriaMensaje.ERROR, ""));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000048, TipoMensaje.TECNICO, CategoriaMensaje.ERROR, ""));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000049, TipoMensaje.TECNICO, CategoriaMensaje.ERROR, ""));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000050, TipoMensaje.TECNICO, CategoriaMensaje.ERROR, ""));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000051, TipoMensaje.TECNICO, CategoriaMensaje.ERROR, ""));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000052, TipoMensaje.TECNICO, CategoriaMensaje.ERROR, ""));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000053, TipoMensaje.TECNICO, CategoriaMensaje.ERROR, ""));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000054, TipoMensaje.TECNICO, CategoriaMensaje.ERROR, ""));
  agregarMensaje(Mensaje.crear(CodigoMensaje.M00000055, TipoMensaje.TECNICO, CategoriaMensaje.ERROR, ""));
};

cargarMensajes();

const obtenerMensaje = (codigo) => {
  if (ObjetoUtilidad.esNulo(codigo)) {
    const mensajeUsuario = obtenerContenidoMensaje(CodigoMensaje.M00000004);
    const mensajeTecnico = obtenerContenidoMensaje(CodigoMensaje.M00000003);
    throw CorteTransversalInventarioExcepcion.crearConMensajeTecnico(mensajeUsuario, mensajeTecnico);
  }

  if (!mensajes.has(codigo)) {
    const mensajeUsuario = obtenerContenidoMensaje(CodigoMensaje.M00000004);
    const mensajeTecnico = obtenerContenidoMensaje(CodigoMensaje.M00000002);
    throw CorteTransversalInventarioExcepcion.crearConMensajeTecnico(mensajeUsuario, mensajeTecnico);
  }

  return mensajes.get(codigo);
};

const obtenerContenidoMensaje = (codigo) => {
  const codigosErrorInterno = [
    CodigoMensaje.M00000002,
    CodigoMensaje.M00000003,
    CodigoMensaje.M00000004,
  ];

  if (codigosErrorInterno.includes(codigo)) {
      const mensaje = mensajes.get(codigo);
      if (!mensaje) {
          if (codigo === CodigoMensaje.M00000004) return "Error inesperado.";
          if (codigo === CodigoMensaje.M00000002) return "Código de mensaje no encontrado.";
          if (codigo === CodigoMensaje.M00000003) return "Código de mensaje nulo.";
          return "Error interno del catálogo de mensajes."; // Fallback final
      }
      return mensaje.contenido;
  }

  return obtenerMensaje(codigo).contenido;
};

module.exports = {
  obtenerMensaje,
  obtenerContenidoMensaje,
};
