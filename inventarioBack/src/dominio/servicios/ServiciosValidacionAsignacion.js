class ServicioValidacionAsignacion {
    constructor(equipoRepository, usuarioRepository) {
        this.equipoRepository = equipoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    async puedeAsignarEquipo(equipo, usuarioId) {
        // 1. Verificar si el equipo está en estado asignable (ya lo hace la entidad)
        // 2. Buscar otros equipos del mismo tipo asignados al usuario
        const equiposAsignados = await this.equipoRepository.buscarPorResponsableYTipo(usuarioId, equipo.tipoEquipoId);
        if (equiposAsignados.length > 0 && equipo.tipoEquipoId === 'LAPTOP') { // Regla: solo una laptop por usuario
             throw new Error(`El usuario ${usuarioId} ya tiene una laptop asignada.`);
        }
        // 3. Otras reglas...
        return true;
    }
}