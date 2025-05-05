// Asume que tienes interfaces definidas en los puertos de dominio/aplicación
import IEquipoRepositorio from '../../dominio/puertos/salida/IEquipoRepositorio.js'; // O ruta equivalente
import IImportadorDeEquipos from '../../dominio/puertos/salida/IImportadorDeEquipos.js'; // O ruta equivalente
// La entidad Equipo se usaría internamente por el importador y repositorio
// import { Equipo } from '../../dominio/entidades/EquipoEntidad.js';

export class ImportarEquipoDesdeExcelCasoDeUso {

  /**
   * @param {IEquipoRepositorio} equipoRepositorio - Instancia del repositorio de equipos.
   * @param {IImportadorDeEquipos} importadorDeEquipos - Instancia del servicio de importación.
   */
  constructor(equipoRepositorio, importadorDeEquipos){
    // Validar que las dependencias se inyecten correctamente (opcional pero recomendado)
    if (!equipoRepositorio || typeof equipoRepositorio.guardarMuchos !== 'function') {
      throw new Error("Se requiere una instancia válida de IEquipoRepositorio con el método guardarMuchos.");
    }
    if (!importadorDeEquipos || typeof importadorDeEquipos.importar !== 'function') {
      throw new Error("Se requiere una instancia válida de IImportadorDeEquipos con el método importar.");
    }
    this.equipoRepositorio = equipoRepositorio;
    this.importadorDeEquipos = importadorDeEquipos; // Inyectar dependencia
  }

  async ejecutar(rutaArchivo) {
      const equipos = await this.importadorDeEquipos.importar(rutaArchivo);
      const equiposGuardados = await this.equipoRepositorio.guardarMuchos(equipos);
      return equiposGuardados;
    }
}