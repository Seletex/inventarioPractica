export const mostrarExitoFn = (mensaje, toastRef) => {
  toastRef?.current?.show({
    severity: "success",
    summary: "Éxito",
    detail: mensaje,
    life: 3000,
  });
};

export const mostrarErrorFn = (mensaje, toastRef) => {
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
  entityName = "entidades"
) => {
  setCarga(true);
  try {
    const data = await entityService.getAll();
    setEntities(data);
    setFilteredEntities(data);
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
  entityName = "entidad"
) => {
  try {
    await entityService.delete(id);
    showSuccess(`${entityName} eliminada correctamente`);
    reloadEntities();
  } catch (error) {
    showError(`Error al eliminar ${entityName}: ${error.message}`);
  }
};
