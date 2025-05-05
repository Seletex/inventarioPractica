import { Asignacion } from "../dominio/Asignacion";
import { AsignacionRepositorio } from "../dominio/AsignacionRepositorio";
import { EquipoRepositorio } from "../dominio/EquipoRepositorio";
import { UsuarioRepositorio } from "../dominio/UsuarioRepositorio";

export class ServicioAsignacion {
  constructor(
    
    AsignacionRepositorio = new AsignacionRepositorio,
    EquipoRepositorio = new EquipoRepositorio,
  UsuarioRepositorio = new UsuarioRepositorio

  ) {}

  async asignarEquipo(
    idEquipo,
    idUsuario,
    fechaAsignacion
  ) {
    const equipo = await this.equipoRepositorio.obtenerPorId(idEquipo);
    if (!equipo) {
      throw new Error("Equipo no encontrado");
    }

    const usuario = await this.usuarioRepositorio.obtenerPorId(idUsuario);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    const asignacion = new Asignacion(
      null,
      equipo,
      usuario,
      fechaAsignacion,
      null
    );

    return this.asignacionRepositorio.guardar(asignacion);
  }

  async obtenerAsignaciones() {
    return this.asignacionRepositorio.obtenerTodos();
  }

  async obtenerAsignacionPorId(id) {
    return this.asignacionRepositorio.obtenerPorId(id);
  }

  async actualizarAsignacion(asignacion) {
    return this.asignacionRepositorio.actualizar(asignacion);
  }
  async eliminarAsignacion(id) {
    return this.asignacionRepositorio.eliminar(id);
  }

  async obtenerAsignacionesPorUsuario(idUsuario){
    return this.asignacionRepositorio.obtenerPorUsuario(idUsuario);
  }

  async obtenerAsignacionesPorEquipo(idEquipo) {
    return this.asignacionRepositorio.obtenerPorEquipo(idEquipo);
  }
}
