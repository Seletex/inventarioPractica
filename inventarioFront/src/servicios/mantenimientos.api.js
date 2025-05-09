export const mockMantenimientosService = {
  getAll: async () => {

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

      },
  
    ];
  },

  create: async (data) => {

    return { ...data, id: Date.now(), estado: "Pendiente" };
  },

  update: async (id, updates) => {

    return { ...updates, id };
  },


};
