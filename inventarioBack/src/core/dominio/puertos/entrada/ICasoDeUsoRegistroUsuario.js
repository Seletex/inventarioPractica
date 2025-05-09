class ICasoDeUsoRegistroUsuario {
  async executar(datosUsuario) {
    throw new Error("Método 'executar()' debe ser implementado.", datosUsuario);
  }
}

module.exports = ICasoDeUsoRegistroUsuario; // La exportación va fuera de la clase/método
