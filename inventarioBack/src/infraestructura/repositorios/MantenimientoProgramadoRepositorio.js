import { PrismaClient } from "@prisma/client";

class MantenimientoProgramadoRepositorio {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async crearMantenimientoProgramado(mantenimientoProgramado) {
    return this.prisma.mantenimiento_Programado.create({
      data: mantenimientoProgramado,
    });
  }

  async obtenerMantenimientoProgramadoPorId(id) {
    return this.prisma.mantenimiento_Programado.findUnique({
      where: { id },
    });
  }

  async obtenerTodosLosMantenimientosProgramados() {
    return this.prisma.mantenimiento_Programado.findMany();
  }

  async actualizarMantenimientoProgramado(id, mantenimientoProgramado) {
    return this.prisma.mantenimiento_Programado.update({
      where: { id },
      data: mantenimientoProgramado,
    });
  }

  async eliminarMantenimientoProgramado(id) {
    return this.prisma.mantenimiento_Programado.delete({
      where: { id },
    });
  }
}

export default MantenimientoProgramadoRepositorio;
