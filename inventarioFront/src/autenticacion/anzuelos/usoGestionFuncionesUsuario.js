export const mostrarExitoFn = (mensaje, toastRef) => {
  // Cambiado a toastRef?.current?.show
  toastRef?.current?.show({
    severity: "success",
    summary: "Éxito",
    detail: mensaje,
    life: 3000,
  });
};

export const mostrarErrorFn = (mensaje, toastRef) => {
  // Cambiado a toastRef?.current?.show
  toastRef?.current?.show({
    severity: "error",
    summary: "Error",
    detail: mensaje,
    life: 5000,
  });
};

export const cargarEntidadesFn = async (
  setCarga,
  entityService,
  setEntities,
  setFilteredEntities,
  showError,
  entityName = "entidades" // Valor por defecto
) => {
  setCarga(true);
  try {
    const data = await entityService.getAll();
    setEntities(data);
    setFilteredEntities(data); // Inicialmente, los datos filtrados son todos los datos
  } catch (error) {
    showError(`Error cargando ${entityName}: ` + error.message);
  } finally {
    setCarga(false);
  }
};

export const manejoEliminarEntidadFn = async (
  id,
  entityService,
  showSuccess,
  reloadEntities,
  showError,
  entityName = "entidad" // Valor por defecto
) => {
  try {
    await entityService.delete(id);
    showSuccess(`${entityName} eliminada correctamente`);
    reloadEntities(); // Recarga la lista para mostrar el cambio
  } catch (error) {
    showError(`Error al eliminar ${entityName}: ${error.message}`);
  }
};
