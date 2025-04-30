const EstadoEquipo=Object.freeze({
    Activo: 'Activo',
    Asignado: 'Asignado', // Podría ser un estado específico si 'entregado' es true
    Mantenimiento: 'Mantenimiento',
    En_Reparacion: 'En Reparacion',
    Baja: 'Baja',
})
module.exports = EstadoEquipo