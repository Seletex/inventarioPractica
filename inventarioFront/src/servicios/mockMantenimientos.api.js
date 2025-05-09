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
      setTimeout(() => resolve(MantenimientoMock), 500); 
    }),

  filtrarAvanzado: (filtros) =>
    new Promise((resolve) => {
      const resultados = MantenimientoMock.filter((equipo) => {
        const normalizeDateString = (dateStr) => {
          if (!dateStr) return null;
          try {
            const date = new Date(dateStr);

            if (isNaN(date.getTime())) {
              return null; 
            }

            return date.toISOString().split("T")[0];
          } catch (e) {
            console.error("Error parsing date string: ", dateStr, e);
            return null; 
          }
        };
        let cumpleFiltro = true;

        if (filtros.placa) {
          cumpleFiltro = cumpleFiltro && equipo.placa?.includes(filtros.placa);
        }

        if (filtros.marca) {
          cumpleFiltro =
            cumpleFiltro &&
            equipo.marca?.toLowerCase().includes(filtros.marca.toLowerCase());
        }

        if (filtros.estado) {
          cumpleFiltro = cumpleFiltro && equipo.estado === filtros.estado;
        }

     
        if (filtros.fecha_compra) {
          const filtroFecha = normalizeDateString(filtros.fecha_compra);
          const equipoFecha = normalizeDateString(equipo.fecha_compra);

          cumpleFiltro =
            cumpleFiltro &&
            filtroFecha &&
            equipoFecha &&
            filtroFecha === equipoFecha;
        }

        if (filtros.responsable) {
          cumpleFiltro =
            cumpleFiltro &&
            equipo.responsable
              ?.toLowerCase()
              .includes(filtros.responsable.toLowerCase());
        }

        if (filtros.ubicacion) {
          cumpleFiltro =
            cumpleFiltro &&
            equipo.ubicacion
              ?.toLowerCase()
              .includes(filtros.ubicacion.toLowerCase());
        }

        if (filtros.fechaProgramada) {
          const filtroFecha = normalizeDateString(filtros.fechaProgramada);
          const equipoFecha = normalizeDateString(equipo.fechaProgramada);

          cumpleFiltro =
            cumpleFiltro &&
            filtroFecha &&
            equipoFecha &&
            filtroFecha === equipoFecha;
        }

        if (filtros.tecnico) {
          cumpleFiltro =
            cumpleFiltro &&
            equipo.tecnico
              ?.toLowerCase()
              .includes(filtros.tecnico.toLowerCase());
        }

        if (filtros.tipo) {
          cumpleFiltro = cumpleFiltro && equipo.tipo === filtros.tipo;
        }

        return cumpleFiltro;
      });

      setTimeout(() => resolve(resultados), 500);
    }),
  getById: async (placa) => {
  
    const equipo = MantenimientoMock.find((e) => e.placa === placa);

    if (!equipo) {
      throw new Error(`No se encontró equipo con placa ${placa}`);
    }

    return equipo;
  },
};
