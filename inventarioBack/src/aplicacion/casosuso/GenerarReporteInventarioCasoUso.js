import { ReporteInventario } from "../../dominio/ReporteInventario";
import { InventarioRepositorio } from "../../dominio/InventarioRepositorio";

export class GenerarReporteInventarioCasoUso {
  constructor( InventarioRepositorio) {
    this.InventarioRepositorio = InventarioRepositorio;
  }

  async ejecutar() {
    const inventario = await this.inventarioRepositorio.obtenerInventario();
    return new ReporteInventario(inventario);
  }
}
