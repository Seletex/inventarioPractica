import { Command, Option } from 'commander';
import { ImportarEquipoDesdeExcelCasoDeUso } from '../../../aplicacion/equipos/ImportarEquipoDesdeExcelCasoDeUso.js';
import { EquipoRepositorio } from '../../repositorios/EquipoRepositorio.js';
import { EquipoEntidad } from '../../../dominio/entidades/EquipoEntidad.js';
import { TipoEquipoEntidad } from '../../../dominio/entidades/TipoEquipoEntidad.js';
import { MarcaEntidad } from '../../../dominio/entidades/MarcaEntidad.js';
import { EstadoEquipoEntidad } from '../../../dominio/entidades/EstadoEquipoEntidad.js';

const importarEquipoDesdeExcelComando = new Command('importar-equipo-excel');

importarEquipoDesdeExcelComando
  .description('Importar equipos desde un archivo Excel')
  .addOption(new Option('-f, --file <ruta>', 'Ruta del archivo Excel').makeOptionMandatory())
  .action(async (options) => {
    const { file } = options;
    const equipoRepositorio = new EquipoRepositorio(EquipoEntidad, TipoEquipoEntidad, MarcaEntidad, EstadoEquipoEntidad);
    const importarEquipoDesdeExcelCasoDeUso = new ImportarEquipoDesdeExcelCasoDeUso(equipoRepositorio);

    try {
      const equiposImportados = await importarEquipoDesdeExcelCasoDeUso.ejecutar(file);
      console.log(`Se importaron ${equiposImportados.length} equipos desde el archivo Excel.`);
    } catch (error) {
      console.error('Error al importar equipos desde el archivo Excel:', error.message);
    }
  });

export { importarEquipoDesdeExcelComando };
