export class FinalizarAsignacionCasoUso {
    constructor(finalizarAsignacionServicio) {
        this.finalizarAsignacionServicio = finalizarAsignacionServicio;
      }

  async ejecutar(id) {
    return await this.finalizarAsignacionServicio.ejecutar(id);
  }
}
