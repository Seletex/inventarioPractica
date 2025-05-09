export const cambiarEstadoEquipoFn = async (
  id,
  nuevoEstado,
  equipos,
  equiposService,
  mostrarExito,
  cargarEquipos,
  mostrarError
) => {
  const equipoEncontrado = equipos.find((e) => e.id === id);

  if (!equipoEncontrado) {
    mostrarError(`Error: Equipo con ID ${id} no encontrado.`);
    return;
  }

  try {
    const equipoActualizado = {
      ...equipoEncontrado,
      estado: nuevoEstado,
    };
    await equiposService.update(id, equipoActualizado);
    mostrarExito(`Equipo dado de baja correctamente`);
    cargarEquipos();
  } catch (error) {
    mostrarError(`Error al cambiar estado: ${error.message}`);
  }
};
export const confirmarCambioEstadoFn = (
  id,
  nuevoEstado,
  cambiarEstadoEquipo
) => {
  const mensajeConfirmacion = `¿Estás seguro de dar de baja este equipo?`;
  if (window.confirm(mensajeConfirmacion)) {
    cambiarEstadoEquipo(id, nuevoEstado);
  }
};

export const cargarEquiposFn = async (
  asignarCarga,
  equiposService,
  setEquipos,
  setEquiposFiltrados,
  mostrarError
) => {
  asignarCarga(true);
  try {
    const data = await equiposService.getAll();
    setEquipos(data);
    setEquiposFiltrados(data);
  } catch (error) {
    mostrarError("Error cargando equipos: " + error.message);
  } finally {
    asignarCarga(false);
  }
};

export const manejoEliminarFn = async (
  id,
  equiposService,
  mostrarExito,
  cargarEquipos,
  mostrarError
) => {
  try {
    await equiposService.delete(id);
    mostrarExito("Equipo eliminado correctamente");
    cargarEquipos();
  } catch (error) {
    mostrarError(error.message);
  }
};
export const setMantenimientos = (prev, fechaRealizacion, id) =>
  prev.map((m) =>
    m.id === id ? { ...m, fechaRealizacion, estado: "Completado" } : m
  );
export const registrarRealizacion = async (
  id,
  mantenimientosService,
  mostrarExito,
  mostrarError,
  setMantenimientos
) => {
  try {
    const fechaRealizacion = new Date().toISOString();

    await mantenimientosService.update(id, {
      fechaRealizacion,
      estado: "Completado",
    });

    setMantenimientos((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, fechaRealizacion, estado: "Completado" } : m
      )
    );

    mostrarExito("Mantenimiento registrado correctamente");
  } catch (error) {
    mostrarError(`Error al registrar: ${error.message}`);
  }
};

export const editarMantenimiento = (
  mantenimiento,
  setMantenimientoEditando,
  setMostrarModal
) => {
  setMantenimientoEditando(mantenimiento);
  setMostrarModal(true);
};

export const guardarMantenimiento = async (
  formData,
  mantenimientoEditando,
  mantenimientosService,
  mostrarExito,
  setMostrarModal,
  setMantenimientoEditando,
  mostrarError,
  setMantenimientos
) => {
  try {
    if (mantenimientoEditando) {
      await mantenimientosService.update(mantenimientoEditando.id, formData);

      setMantenimientos((prev) =>
        prev.map((m) =>
          m.id === mantenimientoEditando.id ? { ...m, ...formData } : m
        )
      );
      mostrarExito("Mantenimiento actualizado");
    } else {
      const nuevoMantenimiento = await mantenimientosService.create(formData);

      setMantenimientos((prev) => [nuevoMantenimiento, ...prev]);
      mostrarExito("Mantenimiento creado");
    }

    setMostrarModal(false);
    setMantenimientoEditando(null);
  } catch (error) {
    mostrarError(`Error al guardar: ${error.message}`);
  }
};
export const mostrarExitoFn = (mensaje, toastRef) => {
  toastRef.current?.show({
    severity: "success",
    summary: "Éxito",
    detail: mensaje,
    life: 3000,
  });
};

export const mostrarErrorFn = (mensaje, toastRef) => {
  toastRef.current?.show({
    severity: "error",
    summary: "Error",
    detail: mensaje,
    life: 5000,
  });
};
