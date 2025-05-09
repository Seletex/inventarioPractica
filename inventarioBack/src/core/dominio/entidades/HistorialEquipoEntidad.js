// Podrías definir un enumerador para TipoEvento
const TiposEventoHistorial = Object.freeze({
    CREACION: 'CREACION',
    ASIGNACION: 'ASIGNACION',
    RETIRO_ENTREGA: 'RETIRO_ENTREGA',
    CAMBIO_UBICACION: 'CAMBIO_UBICACION',
    MANTENIMIENTO_INICIO: 'MANTENIMIENTO_INICIO',
    MANTENIMIENTO_FIN: 'MANTENIMIENTO_FIN',
    BAJA: 'BAJA',
    REACTIVACION: 'REACTIVACION',
    // Otros eventos que consideres relevantes
});

class HistorialEquipo {
    constructor(id, equipoId, fecha, tipoEvento, descripcion, usuarioAccionId = null) {
        if (!id || !equipoId || !fecha || !tipoEvento || !descripcion) {
            throw new Error("Se requieren ID, ID de Equipo, Fecha, Tipo de Evento y Descripción para crear una entrada de Historial.");
        }
        this.id = id;
        this.equipoId = equipoId; // FK a EquipoEntidad
        this.fecha = fecha instanceof Date ? fecha : new Date(fecha);
        this.tipoEvento = tipoEvento; // Usar valores de TiposEventoHistorial
        this.descripcion = descripcion;
        this.usuarioAccionId = usuarioAccionId; // FK a UsuarioEntidad (opcional)
        Object.freeze(this); // El historial suele ser inmutable
    }
}

module.exports = { HistorialEquipo, TiposEventoHistorial };