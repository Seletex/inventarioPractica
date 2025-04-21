export const mockMantenimientosService = {
  getAll: async () => {
    // Ejemplo de datos mock
    return [
      {
        
        placa: 101,
        equipo: "Computadora de escritorio",
        marca: "Dell",
        tipo: "Preventivo",
        ubicacion: "Oficina Ejecuciones Fiscales",
        fechaProgramada: "2025-05-15T00:00:00Z",
        fechaRealizacion: null,
        tecnico: "Juan Pérez",
        /*prioridad: "Media",
        estado: "Pendiente",*/
      },
      // ... más mantenimientos
    ];
  },

  create: async (data) => {
    // Lógica para crear en backend
    return { ...data, id: Date.now(), estado: "Pendiente" };
  },

  update: async (id, updates) => {
    // Lógica para actualizar en backend
    return { ...updates, id };
  },

  /* delete: async (id) => {
      // Lógica para eliminar
      return true;
    }*/
};
