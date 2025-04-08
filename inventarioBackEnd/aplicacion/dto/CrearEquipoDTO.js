export class CrearEquipoDTO {
    constructor(placa, ubicacion, estado) {
        this.placa = placa;
    
        
        this.ubicacion = ubicacion;
        this.estado = estado || 'activo';
    }
}