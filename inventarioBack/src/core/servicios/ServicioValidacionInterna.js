class ServicioValidacionInterna {
  constructor(usuarioRepositorio, ubicacionRepositorio, equipoRepositorio) {
    // Validar que los repositorios necesarios se pasen
    if (!usuarioRepositorio)
      throw new Error("UsuarioRepositorio es requerido.");
    if (!ubicacionRepositorio)
      throw new Error("UbicacionRepositorio es requerido.");
    if (!equipoRepositorio) throw new Error("EquipoRepositorio es requerido."); // Podría ser necesario si validas algo más del equipo

    this.usuarioRepositorio = usuarioRepositorio;
    this.ubicacionRepositorio = ubicacionRepositorio;
    this.equipoRepositorio = equipoRepositorio;
  }

  /**
   * Valida si una transferencia de equipo es permitida según las reglas de negocio.
   * Lanza un error si la validación falla.
   * @param {object} equipo - El objeto completo del equipo que se va a transferir (ya encontrado).
   * @param {string} nuevoUsuarioId - El ID del usuario destino.
   * @param {string} nuevaUbicacionId - El ID de la ubicación destino.
   * @throws {Error} Si el usuario destino no existe.
   * @throws {Error} Si la ubicación destino no existe.
   * @throws {Error} Si el estado del equipo no permite la transferencia.
   * @returns {Promise<void>} Completa si la validación es exitosa.
   */
  async validarTransferencia(equipo, nuevoUsuarioId, nuevaUbicacionId) { // <-- Añadir nuevoUsuarioId
    console.log(
      `Iniciando validación interna para transferencia de equipo ${equipo.placa}...`
    );

    // --- Validaciones Internas ---

    // 1. Validar existencia del usuario destino
    const usuarioDestino = await this.usuarioRepositorio.buscarPorId(nuevoUsuarioId); // Asume que existe este método
    if (!usuarioDestino) {
      throw new Error(`El usuario destino con ID ${nuevoUsuarioId} no existe o no está activo.`);
    }
    console.log(`- Usuario destino ${nuevoUsuarioId} validado.`);

    // 2. Validar existencia de la ubicación destino
    const ubicacionDestino = await this.ubicacionRepositorio.buscarPorId(
      nuevaUbicacionId
    ); // Asume que existe este método
    if (!ubicacionDestino) {
      throw new Error(
        `La ubicación destino con ID ${nuevaUbicacionId} no existe o no es válida.`
      );
    }
    console.log(`- Ubicación destino ${nuevaUbicacionId} validada.`);

    // 3. Validar estado del equipo (Ejemplo: no transferir si está 'DE BAJA')
    //    Asegúrate de que tu objeto 'equipo' tenga una propiedad como 'estado' o 'status'
    if (equipo.estado && equipo.estado.toUpperCase() === "DE BAJA") {
      // Ajusta 'estado' y 'DE BAJA' a tu modelo
      throw new Error(
        `El equipo ${equipo.placa} está dado de baja y no puede ser transferido.`
      );
    }
    // Podrías añadir más estados aquí (e.g., 'EN REPARACION')
    console.log(
      `- Estado del equipo (${equipo.estado || "N/A"}) permite transferencia.`
    );

    // --- Añadir más validaciones internas según tus reglas de negocio ---
    // Ej: Validar rol del usuario, capacidad de la ubicación, etc.

    console.log(
      `Validación interna completada exitosamente para equipo ${equipo.placa}.`
    );
    // Si todas las validaciones pasan, la función simplemente termina.
  }
}

module.exports = ServicioValidacionInterna;
