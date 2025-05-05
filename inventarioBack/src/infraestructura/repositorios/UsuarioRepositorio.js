import { Usuario } from '../../dominio/entidades/UsuarioEntidad.js';

export class UsuarioRepositorio {
  constructor(db) {
    this.db = db;
  }

  async guardar(usuario) {
    const { nombre, email, password } = usuario;
    const query = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
    const result = await this.db.query(query, [nombre, email, password]);
    return new Usuario(result.insertId, nombre, email, password);
  }

  async obtenerPorEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const rows = await this.db.query(query, [email]);
    if (rows.length > 0) {
      const { id, nombre, email, password } = rows[0];
      return new Usuario(id, nombre, email, password);
    }
    return null;
  }

  async obtenerPorId(id) {
    const query = 'SELECT * FROM usuarios WHERE id = ?';
    const rows = await this.db.query(query, [id]);
    if (rows.length > 0) {
      const { nombre, email, password } = rows[0];
      return new Usuario(id, nombre, email, password);
    }
    return null;
  }
}
