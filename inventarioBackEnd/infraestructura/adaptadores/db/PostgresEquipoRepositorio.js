// infrastructure/adapters/PostgresEquipoRepository.js
import EquipoRepositorio from '../../../domain/puertos/EquipoRepositorio';

import { pool } from './postgres-connection'; // Conexión configurada

export default class PostgresEquipoRepositorio extends EquipoRepositorio {
  async guardar(equipo) {
    const consulta = `
      INSERT INTO equipos (placa, nombre, ubicacion, estado)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const valores = [equipo.placa, equipo.nombre, equipo.ubicacion, equipo.estado];
    const { filas } = await pool.query(consulta, valores);
    return filas[0];
  }

  async encontrarPorPlaca(placa) {
    const { filas } = await pool.query('SELECT * FROM equipos WHERE codigo = $1', [placa]);
    return filas[0];
  }
}