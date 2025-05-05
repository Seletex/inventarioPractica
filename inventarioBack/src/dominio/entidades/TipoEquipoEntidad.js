class TipoEquipo {
    constructor(id, nombre = null) {
        if (!id || !nombre) {
            throw new Error("Se requiere ID y Nombre para crear un Tipo de Equipo.");
        }
        this.id = id;
        this.nombre = nombre;
        
        Object.freeze(this); // Hacer la entidad inmutable si se desea
    }
}

module.exports = TipoEquipo;