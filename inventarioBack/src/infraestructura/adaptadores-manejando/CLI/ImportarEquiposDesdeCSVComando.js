import { Command } from 'commander';
import { ImportarEquiposDesdeCSV } from '../../../aplicacion/casos-uso/ImportarEquiposDesdeCSV.js';
import { EquipoRepositorio } from '../../repositorios/EquipoRepositorio.js';
import { CSVParser } from '../../utilidades/CSVParser.js';

export class ImportarEquiposDesdeCSVComando {
  constructor() {
    this.comando = new Command('importar-equipos')
      .description('Importar equipos desde un archivo CSV')
      .argument('<archivo>', 'Ruta al archivo CSV')
      .action(this.ejecutar.bind(this));
  }

  async ejecutar(archivo) {
    const equipoRepositorio = new EquipoRepositorio();
    const csvParser = new CSVParser();
    const importarEquiposDesdeCSV = new ImportarEquiposDesdeCSV(equipoRepositorio, csvParser);

    try {
      const resultados = await importarEquiposDesdeCSV.ejecutar(archivo);
      resultados.forEach(resultado => {
        if (resultado.exito) {
          console.log(`Equipo con serial ${resultado.serial} importado con éxito.`);
        } else {
          console.error(`Error al importar equipo con serial ${resultado.serial}: ${resultado.error}`);
        }
      });
    } catch (error) {
      console.error(`Error durante la importación: ${error.message}`);
    }
  }

  obtenerComando() {
    return this.comando;
  }
}
