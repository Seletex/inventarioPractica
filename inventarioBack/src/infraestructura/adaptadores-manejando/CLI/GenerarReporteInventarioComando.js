import { GenerarReporteInventarioCasoUso } from '../../../aplicacion/casos-uso/GenerarReporteInventarioCasoUso.js';
import { InventarioRepositorio } from '../../repositorios/InventarioRepositorio.js';
import { ProductoRepositorio } from '../../repositorios/ProductoRepositorio.js';
import { CategoriaRepositorio } from '../../repositorios/CategoriaRepositorio.js';
import { Inventario } from '../../../dominio/entidades/InventarioEntidad.js';
import { Producto } from '../../../dominio/entidades/EquipoEntidad.js';
import { Categoria } from '../../../dominio/entidades/CategoriaEntidad.js';

export class GenerarReporteInventarioComando {
  constructor() {
    this.generarReporteInventarioCasoUso = new GenerarReporteInventarioCasoUso(
      new InventarioRepositorio(Inventario),
      new ProductoRepositorio(Producto),
      new CategoriaRepositorio(Categoria)
    );
  }

  async ejecutar() {
    try {
      const reporte = await this.generarReporteInventarioCasoUso.ejecutar();
      console.log(reporte);
    } catch (error) {
      console.error('Error al generar el reporte de inventario:', error);
    }
  }
}
