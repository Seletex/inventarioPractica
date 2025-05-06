import { Activo } from '../../dominio/entidades/Activo';

export class ListarActivasPorUsuarioCasoUso {
  constructor (activoRepositorio) {
    this._activoRepositorio = activoRepositorio
  }

  async ejecutar (usuarioId) {
    const activos = await this._activoRepositorio.listarActivosPorUsuario(usuarioId)
    return activos.map(activo => new Activo(activo))
  }
}
