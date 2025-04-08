import CrearEquipo from "../../../aplicacion/casos-uso/CrearEquipo";
import { CrearEquipoDTO } from "../../../aplicacion/dto/CrearEquipoDTO";

export default class EquipoControlador {
    constructor(equipoRepositorio) {
        this.crearEquipo = new CrearEquipo(equipoRepositorio);
    }
    async crear (req, res) {
        try {
            const dto = new CrearEquipoDTO(req.body);
            const equipo = await this.crearEquipo.ejecutar(dto);
            res.status(201).json(equipo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}