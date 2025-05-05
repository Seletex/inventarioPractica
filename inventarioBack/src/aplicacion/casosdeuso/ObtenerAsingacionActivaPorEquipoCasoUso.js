import { EquipoRepositorio } from '../../dominio/repositorios/EquipoRepositorio';

export class ObtenerAsingacionActivaPorEquipoCasoUso {
  constructor(equipoRepositorio) {
    if (!(equipoRepositorio instanceof EquipoRepositorio)) {
      throw new Error(
        'El caso de uso requiere una instancia de EquipoRepositorio',
      );
    }
    this.equipoRepositorio = equipoRepositorio;
  }

  async ejecutar(equipoId) {
    return this.equipoRepositorio.obtenerAsignacionActivaPorEquipo(equipoId);
  }
}
