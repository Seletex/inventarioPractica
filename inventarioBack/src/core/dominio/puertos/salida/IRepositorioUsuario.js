class IRepositorioUsuario {
  async guardar(usuario) {
    throw new Error("Metodo 'guardar' no implementado");
  }
  async buscarPorCorreo(correo) {
    throw new Error("Metodo 'buscarPorCorreo' no implementado");
  }
}
module.exports = IRepositorioUsuario;
