// Función auxiliar para generar opciones de select
export const generarOpcionesSelect = (dataArray) => {
    // Asegúrate de manejar el caso donde dataArray pueda ser null/undefined
    if (!dataArray) return [];
    // Si el primer elemento ya es { value: "", label: "Seleccionar..." }, no lo añadas de nuevo
    if (dataArray.length > 0 && dataArray[0].value === "") {
      return dataArray.map((item) => ({ value: item.value, label: item.label }));
    }
    // Si no, añade una opción por defecto genérica si es necesario
    return [
      { value: "", label: "Seleccionar..." },
      ...dataArray.map((item) => ({ value: item.value, label: item.label })),
    ];
  };