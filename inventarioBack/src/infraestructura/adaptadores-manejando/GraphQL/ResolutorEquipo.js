import { Equipo } from "../../../dominio/entidades/EquipoEntidad";
import { EquipoRepositorio } from "../../repositorios/EquipoRepositorio";

export const resolvers = {
  Query: {
    equipos: async () => {
      const equipos = await EquipoRepositorio.obtenerTodos();
      return equipos;
    },
    equipo: async (_, { id }) => {
      const equipo = await EquipoRepositorio.obtenerPorId(id);
      return equipo;
    },
  },
  Mutation: {
    crearEquipo: async (_, { nombre, descripcion, tipoEquipoId }) => {
      const equipo = new Equipo(null, nombre, descripcion, tipoEquipoId);
      const nuevoEquipo = await EquipoRepositorio.crear(equipo);
      return nuevoEquipo;
    },
    actualizarEquipo: async (_, { id, nombre, descripcion, tipoEquipoId }) => {
      const equipoExistente = await EquipoRepositorio.obtenerPorId(id);
      if (!equipoExistente) {
        throw new Error(`Equipo con ID ${id} no encontrado`);
      }
      const equipoActualizado = new Equipo(id, nombre, descripcion, tipoEquipoId);
      await EquipoRepositorio.actualizar(equipoActualizado);
      return equipoActualizado;
    },
    eliminarEquipo: async (_, { id }) => {
      const equipoExistente = await EquipoRepositorio.obtenerPorId(id);
      if (!equipoExistente) {
        throw new Error(`Equipo con ID ${id} no encontrado`);
      }
      await EquipoRepositorio.eliminar(id);
      return true;
    },
  },
};
