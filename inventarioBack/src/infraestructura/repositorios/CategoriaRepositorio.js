import { Categoria } from "../../dominio/entidades/Categoria";

export class CategoriaRepositorio {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async guardar(categoria) {
    try {
      const nuevaCategoria = await this.prisma.categoria.create({
        data: {
          nombre: categoria.nombre,
          descripcion: categoria.descripcion,
        },
      });
      return new Categoria(
        nuevaCategoria.id,
        nuevaCategoria.nombre,
        nuevaCategoria.descripcion
      );
    } catch (error) {
      console.error("Error al guardar la categoría:", error);
      throw new Error("Error al guardar la categoría");
    }
  }

  async obtenerPorId(id) {
    try {
      const categoria = await this.prisma.categoria.findUnique({
        where: { id },
      });
      if (!categoria) {
        return null;
      }
      return new Categoria(categoria.id, categoria.nombre, categoria.descripcion);
    } catch (error) {
      console.error("Error al obtener la categoría por ID:", error);
      throw new Error("Error al obtener la categoría por ID");
    }
  }

  async obtenerTodas() {
    try {
      const categorias = await this.prisma.categoria.findMany();
      return categorias.map(
        (c) => new Categoria(c.id, c.nombre, c.descripcion)
      );
    } catch (error) {
      console.error("Error al obtener todas las categorías:", error);
      throw new Error("Error al obtener todas las categorías");
    }
  }

  async actualizar(categoria) {
    try {
      const categoriaActualizada = await this.prisma.categoria.update({
        where: { id: categoria.id },
        data: {
          nombre: categoria.nombre,
          descripcion: categoria.descripcion,
        },
      });
      return new Categoria(
        categoriaActualizada.id,
        categoriaActualizada.nombre,
        categoriaActualizada.descripcion
      );
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      throw new Error("Error al actualizar la categoría");
    }
  }

  async eliminar(id) {
    try {
      await this.prisma.categoria.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      throw new Error("Error al eliminar la categoría");
    }
  }
}
