const ObjetoUtilidad = require("./ObjetoUtilidad");
class FechaUtilidad {
  constructor() {
    super(); // Constructor privado para evitar instanciación
  }
  static FECHA_POR_DEFECTO_DATE = new Date(2500, 0, 0); // 1 de enero de 1970
  static FECHA_POR_DEFECTO_TEXTO = this.FECHA_POR_DEFECTO_DATE.toISOString(); // 1 de enero de 1970 en formato ISO 8601
  static obtenerValorDefecto(fecha) {
    return ObjetoUtilidad.obtenerValorDefecto(fecha, this.FECHA_POR_DEFECTO_DATE);
  }
  static obtenerFechaPredeterminadaSiNula(fecha) {
    return this.obtenerValorDefecto(fecha,this.FECHA_POR_DEFECTO_DATE);
  }
  static obtenerValorDefectoTexto(fecha,fechaDefecto) {
    return ObjetoUtilidad.obtenerValorDefecto(
      fecha,
      fechaDefecto ?? this.FECHA_POR_DEFECTO_TEXTO
    );
  }
  static obtenerFechaPredeterminadaSiNulaTexto(fecha) {
    return this.obtenerValorDefectoTexto(fecha,this.FECHA_POR_DEFECTO_TEXTO);
  }
  static estaNulo(valor){
    return ObjetoUtilidad.esNulo(valor);
  }
  static asignarPredeterminada(){
    return new Date(this.FECHA_POR_DEFECTO_DATE);
  }
  static esFechaValida(valor) {
    if(this.estaNulo(valor)) {
      return false;
    }
    const fecha = new Date(valor);
    return !isNaN(valor.getTime());
  }
  
}
module.exports = FechaUtilidad;