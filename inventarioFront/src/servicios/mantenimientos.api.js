export const mockMantenimientosService = {
    getAll: async () => {
      // Ejemplo de datos mock
      return [
        {
          id: 1,
          equipoId: 101,
          tipo: 'Preventivo',
          fechaProgramada: '2025-05-15T00:00:00Z',
          fechaRealizacion: null,
          tecnico: 'Juan Pérez',
          prioridad: 'Media',
          estado: 'Pendiente'
        },
        // ... más mantenimientos
      ];
    },
  
    create: async (data) => {
      // Lógica para crear en backend
      return { ...data, id: Date.now(), estado: 'Pendiente' };
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