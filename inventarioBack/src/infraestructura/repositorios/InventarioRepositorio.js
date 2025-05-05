import { PrismaClient } from "@prisma/client";

class InventarioRepositorio {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async crear(inventario) {
    return this.prisma.inventario.create({
      data: inventario,
    });
  }

  async obtenerPorId(id) {
    return this.prisma.inventario.findUnique({
      where: { id },
    });
  }

  async obtenerTodos() {
    return this.prisma.inventario.findMany();
  }

  async actualizar(id, inventario) {
    return this.prisma.inventario.update({
      where: { id },
      data: inventario,
    });
  }

  async eliminar(id) {
    return this.prisma.inventario.delete({
      where: { id },
    });
  }
}

export default InventarioRepositorio;
