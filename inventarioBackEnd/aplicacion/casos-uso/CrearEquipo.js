export default class CrearEquipo {
    constructor(equipoRepositorio, editorEventos) {
        this.equipoRepositorio = equipoRepositorio;
        this.editorEventos = editorEventos;
    }

    async ejecutar(CrearEquipoDTO) {
        const existe = await this.equipoRepositorio.buscarPorplaca(CrearEquipoDTO.placa);
        if (existe) throw new Error('El equipo ya existe');
        const Equipo = new Equipo({CrearEquipoDTO});
        const EquipoGuardado = await this.equipoRepositorio.guardar(Equipo);
        await this.editorEventos.publicar('equipoCreado', EquipoGuardado);
        
        return this.equipoRepositorio.guardar(Equipo);
    }
}