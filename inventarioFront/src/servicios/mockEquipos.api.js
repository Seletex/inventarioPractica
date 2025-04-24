const equiposMock = [
  {
    placa: "122",
    marca: "Lenovo",
    modelo: "V.14",
    equipo: function () {
      return `${this.marca}-${this.modelo}`;
    },
    tipo: "Preventivo",
    fechaProgramada: "2025-05-15T00:00:00Z",
    fechaRealizacion: null,
    tecnico: "Juan Pérez",
    ubicacion: "Alcaldía",
    responsable: "Alejandro",
    fecha_compra: "2025-12-12",
    estado: "Activo",
  },
  {
    placa: "456",
    marca: "HP",
    modelo: "EliteBook",
    equipo: function () {
      return `${this.marca}-${this.modelo}`;
    },
    tipo: "Preventivo",
    fechaProgramada: "2025-05-15T00:00:00Z",
    fechaRealizacion: null,
    tecnico: "Juan Pérez",
    ubicacion: "Secretaría de Salud",
    responsable: "María",
    fecha_compra: "2025-01-15",
    estado: "Mantenimiento",
  },
  {
    
    placa: "789",
    tipoEquipo: "Laptop",
    marca: "Dell",
    modelo: "XPS 13",
    equipo: function () {
      return `${this.marca}-${this.modelo}`;
    },
    almacenamiento:512,
    ram: "16GB",
    tipo: "Preventivo",
    fechaProgramada: "2025-05-15T00:00:00Z",
    fechaRealizacion: null,
    tecnico: "Juan Pérez",
    ubicacion: "Secretaría de Finanzas",
    responsable: "Carlos",
    fecha_compra: "2025-03-20",
    estado: "Inactivo",
  },
  
];

export const mockEquiposService = {
  getAll: () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(equiposMock), 500); // Simula delay de red
    }),

  filtrarAvanzado: (filtros) =>
    new Promise((resolve) => {
      const normalizeDateString = (dateStr) => {
        if (!dateStr) return null;
        try {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) {
            return null; // Fecha inválida
          }
          return date.toISOString().split("T")[0];
        } catch (e) {
          console.error("Error parsing date string:", dateStr, e);
          return null; // Manejar errores de parseo
        }
      };

      const cumpleFiltro = (equipo, filtros) => {
        const filtrosAplicados = [
          () => !filtros.placa || equipo.placa?.includes(filtros.placa),
          () =>
            !filtros.marca ||
            equipo.marca?.toLowerCase().includes(filtros.marca.toLowerCase()),
          () => !filtros.estado || equipo.estado === filtros.estado,
          () => {
            if (!filtros.fecha_compra) return true;
            const filtroFecha = normalizeDateString(filtros.fecha_compra);
            const equipoFecha = normalizeDateString(equipo.fecha_compra);
            return filtroFecha && equipoFecha && filtroFecha === equipoFecha;
          },
          () =>
            !filtros.responsable ||
            equipo.responsable
              ?.toLowerCase()
              .includes(filtros.responsable.toLowerCase()),
          () =>
            !filtros.ubicacion ||
            equipo.ubicacion
              ?.toLowerCase()
              .includes(filtros.ubicacion.toLowerCase()),
          () => {
            if (!filtros.fechaProgramada) return true;
            const filtroFecha = normalizeDateString(filtros.fechaProgramada);
            const equipoFecha = normalizeDateString(equipo.fechaProgramada);
            return filtroFecha && equipoFecha && filtroFecha === equipoFecha;
          },
          () =>
            !filtros.tecnico ||
            equipo.tecnico
              ?.toLowerCase()
              .includes(filtros.tecnico.toLowerCase()),
          () => !filtros.tipo || equipo.tipo === filtros.tipo,
        ];

        return filtrosAplicados.every((filtro) => filtro());
      };

      const resultados = equiposMock.filter((equipo) =>
        cumpleFiltro(equipo, filtros)
      );

      setTimeout(() => resolve(resultados), 500);
    }),
  getById: async (placa) =>{
  
      // Buscar el equipo por placa
      const equipo = equiposMock.find(e => e.placa === placa);
      
      // Si no encuentra el equipo, debería manejar este caso
      if (!equipo) {
        throw new Error(`No se encontró equipo con placa ${placa}`);
      }
      
      return equipo;
    },
};
