class TipoEquipo {
    constructor(id, nombre, descripcion = null) {
        if (!id || !nombre) {
            throw new Error("Se requiere ID y Nombre para crear un Tipo de Equipo.");
        }
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        Object.freeze(this); // Hacer la entidad inmutable si se desea
    }
}

module.exports = TipoEquipo;