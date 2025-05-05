import { v4 as uuidv4 } from 'uuid';

class Activo {
  constructor(nombre, descripcion, valor, fechaAdquisicion, id = null) {
    this.id = id || uuidv4();
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.valor = valor;
    this.fechaAdquisicion = fechaAdquisicion;
  }
}

export default Activo;
