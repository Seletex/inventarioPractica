import { HistorialEquipo } from '../../dominio/entidades/HistorialEquipo.js'

export class ListarHistorialPorEquipoCasoUso {
  constructor (historialEquipoRepositorio) {
    this.historialEquipoRepositorio = historialEquipoRepositorio
  }

  async ejecutar (equipoId) {
    if (!equipoId) {
      throw new Error('El ID del equipo es requerido')
    }

    const historialEquipoData = await this.historialEquipoRepositorio.listarPorEquipo(equipoId)

    if (!historialEquipoData || historialEquipoData.length === 0) {
      return []
    }

    return historialEquipoData.map(historial => new HistorialEquipo(historial))
  }
}
