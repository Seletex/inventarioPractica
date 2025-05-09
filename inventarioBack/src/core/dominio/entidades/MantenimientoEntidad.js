class Mantenimiento {
    constructor(id, equipoId, fechaInicio, descripcionProblema, tecnicoResponsable = null, fechaFin = null, descripcionSolucion = null, costo = null) {
        if (!id || !equipoId || !fechaInicio || !descripcionProblema) {
            throw new Error("Se requiere ID, ID de Equipo, Fecha de Inicio y Descripción del Problema para crear un registro de Mantenimiento.");
        }
        if (!(fechaInicio instanceof Date)) {
            throw new Error("La fecha de inicio debe ser un objeto Date válido.");
        }
        if (fechaFin && !(fechaFin instanceof Date)) {
             throw new Error("La fecha de fin debe ser un objeto Date válido.");
        }
        if (fechaFin && fechaFin < fechaInicio) {
            throw new Error("La fecha de fin no puede ser anterior a la fecha de inicio.");
        }
        if (costo !== null && (typeof costo !== 'number' || costo < 0)) {
            throw new Error("El costo debe ser un número positivo o nulo.");
        }

        this.id = id;
        this.equipoId = equipoId; // FK a EquipoEntidad
        this.fechaInicio = fechaInicio;
        this.descripcionProblema = descripcionProblema;
        this.tecnicoResponsable = tecnicoResponsable; // Podría ser un usuarioId si usas UsuarioEntidad
        this.fechaFin = fechaFin;
        this.descripcionSolucion = descripcionSolucion;
        this.costo = costo;
    }

    finalizarMantenimiento(fechaFin, descripcionSolucion, costo = null) {
        // Añadir lógica para marcar como finalizado
    }
}

module.exports = Mantenimiento;