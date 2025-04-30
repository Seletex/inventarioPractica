/**
 * @interface IGeneradorId
 * Define el contrato para un servicio que genera identificadores únicos.
 * Este es un puerto de salida en la Arquitectura Hexagonal.
 */
class IGeneradorId{
    /**
     * Genera un identificador único.
     * @returns {string} Un identificador único (ej: UUID).
     */
    generarId(){throw new Error("Metodo no implementado")}

}
module.exports = IGeneradorId;