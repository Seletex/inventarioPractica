class ICasoDeUsoGestionarUsuario {
  crearUsuario(usuario) {
    throw new Error("Metodo no implementado de crear usuario ");
  }
  obtenerUsuarioPorId(idUsuario) {
    throw new Error("Metodo no implementado de obtener usuario por id");
  }
  obtenerTodosLosUsuarios() {
    throw new Error("Metodo no implementado de obtener todos los usuarios");
  }

  eliminarUsuario(idUsuario) {
    throw new Error("Metodo no implementado de eliminar usuario");
  }
}
module.exports = ICasoDeUsoGestionarUsuario;
