class Marca {
    constructor(id, nombre) {
        if (!id || !nombre) {
            throw new Error("Se requiere ID y Nombre para crear una Marca.");
        }
        this.id = id;
        this.nombre = nombre;
        Object.freeze(this); // Hacer la entidad inmutable si se desea
    }
}

module.exports = Marca;