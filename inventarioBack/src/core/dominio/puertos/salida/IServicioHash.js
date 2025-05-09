class IServicioHash{
    async generarHash(passwordPlana){
        throw new Error("Metodo generar hash no implementado")
    }
    async compararHash(passwordPlana, passwordHash){
        throw new Error("Metodo comparar hash no implementado")
    }

}
module.exports = IServicioHash;