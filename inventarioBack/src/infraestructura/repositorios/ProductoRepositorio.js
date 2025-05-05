import { Producto } from "../../dominio/entidades/Producto";

export class ProductoRepositorio {
  constructor(database) {
    this.db = database;
  }

  async guardar(producto) {
    const { nombre, descripcion, precio, cantidad } = producto;
    const query = `
      INSERT INTO productos (nombre, descripcion, precio, cantidad)
      VALUES (?, ?, ?, ?)
    `;
    const result = await this.db.execute(query, [
      nombre,
      descripcion,
      precio,
      cantidad,
    ]);
    return new Producto(
      result.insertId,
      nombre,
      descripcion,
      precio,
      cantidad
    );
  }

  async obtenerPorId(id) {
    const query = `
      SELECT id, nombre, descripcion, precio, cantidad
      FROM productos
      WHERE id = ?
    `;
    const rows = await this.db.query(query, [id]);
    if (rows.length === 0) {
      return null;
    }
    const { nombre, descripcion, precio, cantidad } = rows[0];
    return new Producto(id, nombre, descripcion, precio, cantidad);
  }

  async obtenerTodos() {
    const query = `
      SELECT id, nombre, descripcion, precio, cantidad
      FROM productos
    `;
    const rows = await this.db.query(query);
    return rows.map(
      (row) =>
        new Producto(
          row.id,
          row.nombre,
          row.descripcion,
          row.precio,
          row.cantidad
        )
    );
  }

  async actualizar(producto) {
    const { id, nombre, descripcion, precio, cantidad } = producto;
    const query = `
      UPDATE productos
      SET nombre = ?, descripcion = ?, precio = ?, cantidad = ?
      WHERE id = ?
    `;
    await this.db.execute(query, [nombre, descripcion, precio, cantidad, id]);
    return producto;
  }

  async eliminar(id) {
    const query = `
      DELETE FROM productos
      WHERE id = ?
    `;
    await this.db.execute(query, [id]);
    return true;
  }
}
