export const confirmarCambioEstadoFn = (id, nuevoEstado, cambiarEstadoEquipo) => {
    if (confirm(`¿Estás seguro de dar de baja este equipo?`)) {
      cambiarEstadoEquipo(id, nuevoEstado);
    }
  };
  
  export const cambiarEstadoEquipoFn = async (id, nuevoEstado, equipos, equiposService, mostrarExito, cargarEquipos, mostrarError) => {
    try {
      const equipoActualizado = { ...equipos.find(e => e.id === id), estado: nuevoEstado };
      await equiposService.update(id, equipoActualizado);
      mostrarExito(`Equipo dado de baja correctamente`);
      cargarEquipos();
    } catch (error) {
      mostrarError(`Error al cambiar estado: ${error.message}`);
    }
  };
  
  export const cargarEquiposFn = async (asignarCarga, equiposService, setEquipos, setEquiposFiltrados, mostrarError) => {
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
  
  export const manejoEliminarFn = async (id, equiposService, mostrarExito, cargarEquipos, mostrarError) => {
    try {
      await equiposService.delete(id);
      mostrarExito("Equipo eliminado correctamente");
      cargarEquipos();
    } catch (error) {
      mostrarError(error.message);
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