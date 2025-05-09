class Ubicacion {
    constructor(id, nombre, descripcion = null, direccion = null) {
        if (!id || !nombre) {
            throw new Error("Se requiere ID y Nombre para crear una Ubicación.");
        }
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.direccion = direccion;
        // Podrías añadir más validaciones (ej: formato dirección)
        Object.freeze(this); // Hacer la entidad inmutable si se desea
    }
}

module.exports = Ubicacion;