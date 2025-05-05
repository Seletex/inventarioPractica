import { ServicioAsignacion } from "../../../aplicacion/ServicioAsignacion";
import { RepositorioAsignacion } from "../../repositorios/RepositorioAsignacion";
import { RepositorioEquipo } from "../../repositorios/RepositorioEquipo";
import { RepositorioUsuario } from "../../repositorios/RepositorioUsuario";

const repositorioAsignacion = new RepositorioAsignacion();
const repositorioEquipo = new RepositorioEquipo();
const repositorioUsuario = new RepositorioUsuario();
const servicioAsignacion = new ServicioAsignacion(repositorioAsignacion, repositorioEquipo, repositorioUsuario);

export const resolversAsignacion = {
  Query: {
    obtenerAsignaciones: async () => {
      return await servicioAsignacion.obtenerAsignaciones();
    },
    obtenerAsignacionPorId: async (_, { id }) => {
      return await servicioAsignacion.obtenerAsignacionPorId(id);
    },
  },
  Mutation: {
    crearAsignacion: async (_, { asignacion }) => {
      return await servicioAsignacion.crearAsignacion(asignacion);
    },
    actualizarAsignacion: async (_, { id, asignacion }) => {
      return await servicioAsignacion.actualizarAsignacion(id, asignacion);
    },
    eliminarAsignacion: async (_, { id }) => {
      return await servicioAsignacion.eliminarAsignacion(id);
    },
  },
};
