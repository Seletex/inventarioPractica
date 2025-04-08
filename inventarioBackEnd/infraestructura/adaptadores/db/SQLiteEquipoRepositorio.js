// infrastructure/adapters/SQLiteEquipoRepository.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import EquipoRepositorio from '../../../domain/puertos/EquipoRepositorio';

export default class SQLiteEquipoRepository extends EquipoRepositorio {
  constructor() {
    super();
    this.dbPromise = open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });
  }

  async save(equipo) {
    const db = await this.dbPromise;
    const { lastID } = await db.run(
      'INSERT INTO equipos (codigo, nombre, ubicacion, estado) VALUES (?, ?, ?, ?)',
      [equipo.codigo, equipo.nombre, equipo.ubicacion, equipo.estado]
    );
    return { id: lastID, ...equipo };
  }
}