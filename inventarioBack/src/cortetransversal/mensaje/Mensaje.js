const { TextoUtilidad } = require("../utilidades/TextoUtilidad");
const {
  CorteTransversalExcepcion,
} = require("../excepciones/concreto/CorteTransversalInventarioExcepcion");
const { CategoriaMensaje } = require("./enumerador/CategoriaMensaje");
const { TipoMensaje } = require("./enumerador/TipoMensaje");
const { CodigoMensaje } = require("./enumerador/CodigoMensaje");
const { ObjetoUtilidad } = require("../utilidades/ObjetoUtilidad");
const CatalogoMensajes = require("./CatalogoMensajes");
class Mensaje {
  #codigo;
  #tipo;
  #categoria;
  #contenido;

  constructor(codigo, tipo, categoria, contenido) {
    this.#codigo = codigo;
    this.#tipo = tipo;
    this.#categoria = categoria;
    this.#contenido = contenido;
  }
  static crear(codigo, tipo, categoria, contenido) {
    return new Mensaje(codigo, tipo, categoria, contenido);
  }
  #setCodigo(codigo) {
    if (ObjetoUtilidad.esNulo(codigo)) {
      const mensajeUsuario = CatalogoMensajes.get(CodigoMensaje.M00004);
      const mensajetecnico = CatalogoMensajes.get(CodigoMensaje.M00004);

      throw new CorteTransversalExcepcion(
        CodigoMensaje.CODIGO_MENSAJE_NO_DEBE_SER_NULO,
        TipoMensaje.ERROR,
        CategoriaMensaje.ERROR,
        "El código no puede ser nulo"
      );
    }
    this.#codigo = codigo;
  }
  #setTipo(tipo) {
    this.#tipo = ObjetoUtilidad.obtenerValorPorDefecto(tipo, TipoMensaje.ERROR);
  }
  #setCategoria(categoria) {
    this.#categoria = ObjetoUtilidad.obtenerValorPorDefecto(
      categoria,
      CategoriaMensaje.ERROR
    );
  }
  #setContenido(contenido) {
    this.#contenido = TextoUtilidad.aplicarAjuste(contenido);
  }
  get codigo() {
    return this.#codigo;
  }
  get tipo() {
    return this.#tipo;
  }
  get categoria() {
    return this.#categoria;
  }
  get contenido() {
    return this.#contenido;
  }
}
module.exports = Mensaje;