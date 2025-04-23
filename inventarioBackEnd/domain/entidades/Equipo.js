export class Equipo{
    constructor(id, nombre, descripcion, cantidad, ubicacion, estado, fechaIngreso){
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        this.ubicacion = ubicacion;
        this.estado = estado|| 'activo';
        this.fechaIngreso = fechaIngreso;
       
    }
    // Método para mostrar información del equipo
    mostrarInformacion() {
        return `ID: ${this.id}, Nombre: ${this.nombre}, Descripción: ${this.descripcion}, Cantidad: ${this.cantidad}, Ubicación: ${this.ubicacion}, Estado: ${this.estado}, Fecha de Ingreso: ${this.fechaIngreso}`;
    }
    cambiarUbicacion(nuevaUbicacion) {
        if (!['CM', 'PM', 'OACR'].includes(nuevaUbicacion)) {
            throw new Error('Ubicación no válida');
          }
          this.ubicacion = nuevaUbicacion;
        }
}