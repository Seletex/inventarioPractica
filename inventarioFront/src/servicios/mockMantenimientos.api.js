const MantenimientoMock = [
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
  },
  {
    placa: "789",
    marca: "Dell",
    modelo: "XPS 13",
    equipo: function () {
      return `${this.marca}-${this.modelo}`;
    },
    tipo: "Proactivo",
    fechaProgramada: "2025-05-15T00:00:00Z",
    fechaRealizacion: null,
  },
];
export const mockMantenimientoService = {
  getAll: () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(MantenimientoMock), 500); // Simula delay de red
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

      const cumpleFiltros = (equipo, filtros) => {
        const checks = [
          () => !filtros.placa || equipo.placa?.includes(filtros.placa),
          () => !filtros.marca || equipo.marca?.toLowerCase().includes(filtros.marca.toLowerCase()),
          () => !filtros.estado || equipo.estado === filtros.estado,
          () => !filtros.fecha_compra || compareDates(filtros.fecha_compra, equipo.fecha_compra),
          () => !filtros.responsable || equipo.responsable?.toLowerCase().includes(filtros.responsable.toLowerCase()),
          () => !filtros.ubicacion || equipo.ubicacion?.toLowerCase().includes(filtros.ubicacion.toLowerCase()),
          () => !filtros.fechaProgramada || compareDates(filtros.fechaProgramada, equipo.fechaProgramada),
          () => !filtros.tecnico || equipo.tecnico?.toLowerCase().includes(filtros.tecnico.toLowerCase()),
          () => !filtros.tipo || equipo.tipo === filtros.tipo,
        ];

        return checks.every((check) => check());
      };

      const compareDates = (filtroFecha, equipoFecha) => {
        const filtro = normalizeDateString(filtroFecha);
        const equipo = normalizeDateString(equipoFecha);
        return !filtro || !equipo || filtro === equipo;
      };

      const resultados = MantenimientoMock.filter((equipo) => cumpleFiltros(equipo, filtros));

      setTimeout(() => resolve(resultados), 500);
    }),
  getById: async (placa) => {
    // Buscar el equipo por placa
    const equipo = MantenimientoMock.find((e) => e.placa === placa);

    // Si no encuentra el equipo, debería manejar este caso
    if (!equipo) {
      throw new Error(`No se encontró equipo con placa ${placa}`);
    }

    return equipo;
  },
};
