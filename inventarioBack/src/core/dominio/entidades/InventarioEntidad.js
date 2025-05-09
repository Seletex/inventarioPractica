import { v4 as uuidv4 } from "uuid";

class InventarioEntidad {
  constructor({
    id,
    nombre,
    
    fechaCreacion,
    fechaActualizacion,
  }) {
    this.id = id || uuidv4();
    this.nombre = nombre;
    this.descripcion = descripcion;

    this.fechaCreacion = fechaCreacion || new Date();
    this.fechaActualizacion = fechaActualizacion || new Date();
  }

  static crear(datos) {
    return new InventarioEntidad(datos);
  }

  actualizar(datos) {
    Object.assign(this, datos);
    this.fechaActualizacion = new Date();
  }
}

export default InventarioEntidad;
