class ObjetoUtilidad{
    constructor() {
        super(); // Constructor privado para evitar instanciación
    }   
    static esNulo(valor) {
        return valor === null || valor === undefined;
    }
   
    static obtenerValorDefecto(valor, valorDefecto) {
        return valor ?? valorDefecto
    }
    static esVacioOEsNulo(valor) {
        if(this.esNulo(valor)) {
            return true;
        }
        if(typeof valor === 'string') {
            return valor.trim() === '';
            
        }
        return false;
    }
    
}
module.exports = ObjetoUtilidad;