import { MantenimientoProgramadoCasoUso } from '../../../aplicacion/casos-uso/MantenimientoProgramadoCasoUso.js';
import { MantenimientoProgramadoRepositorio } from '../../repositorios/MantenimientoProgramadoRepositorio.js';
import { EquipoRepositorio } from '../../repositorios/EquipoRepositorio.js';
import { Equipo } from '../../../dominio/entidades/EquipoEntidad.js';
import { MantenimientoProgramado } from '../../../dominio/entidades/MantenimientoProgramadoEntidad.js';
import { MantenimientoProgramadoExcepcion } from '../../../dominio/excepciones/MantenimientoProgramadoExcepcion.js';
import { EquipoExcepcion } from '../../../dominio/excepciones/EquipoExcepcion.js';

export class EjecutarMantenimientoProgramadoComando {
  constructor() {
    this.mantenimientoProgramadoCasoUso = new MantenimientoProgramadoCasoUso(
      new MantenimientoProgramadoRepositorio(),
      new EquipoRepositorio(),
      MantenimientoProgramado,
      MantenimientoProgramadoExcepcion,
      Equipo,
      EquipoExcepcion
    );
  }

  async ejecutar(idMantenimientoProgramado) {
    try {
      const mantenimientoProgramado = await this.mantenimientoProgramadoCasoUso.ejecutarMantenimientoProgramado(idMantenimientoProgramado);
      console.log('Mantenimiento programado ejecutado con éxito:', mantenimientoProgramado);
      return mantenimientoProgramado;
    } catch (error) {
      console.error('Error al ejecutar el mantenimiento programado:', error.message);
      throw error;
    }
  }
}
