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
    ultimoMantenimiento: {
      fecha: "2023-10-15",
      realizadoPor: "Juan Técnico",
      descripcion: "Limpieza interna y actualización de software.",
    },
    responsable: "Alejandro",
    fecha_compra: "2025-12-12",
    estado: "Activo",
    observaciones: "Ninguna",
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
    ultimoMantenimiento: {
      fecha: "2023-11-01",
      realizadoPor: "Ana Soporte",
      descripcion: "Cambio de tóner y revisión de rodillos.",
    },
    fecha_compra: "2025-01-15",
    estado: "Mantenimiento",
    observaciones: "Ninguna",
  },
  {
    placa: "789",
    tipoEquipo: "Laptop",
    marca: "Dell",
    modelo: "XPS 13",
    equipo: function () {
      return `${this.marca}-${this.modelo}`;
    },
    almacenamiento: 512,
    ram: "16GB",
    tipo: "Preventivo",
    fechaProgramada: "2025-05-15T00:00:00Z",
    fechaRealizacion: null,
    tecnico: "Juan Pérez",
    ultimoMantenimiento: {
      fecha: "2023-11-01",
      realizadoPor: "Ana Soporte",
      descripcion: "Cambio de tóner y revisión de rodillos.",
    },
    ubicacion: "Secretaría de Finanzas",
    responsable: "Carlos",
    fecha_compra: "2025-03-20",
    estado: "Inactivo",
    observaciones: "Equipo presenta fallas de conectividad.",
  },
];

export const mockEquiposService = {
  getAll: () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(equiposMock), 500); // Simula delay de red
    }),

  filtrarAvanzado: (filtros) =>
    new Promise((resolve) => {
      const resultados = equiposMock.filter((equipo) => {
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

        // Filtro por Fecha Compra
        if (filtros.fecha_compra) {
          const filtroFecha = normalizeDateString(filtros.fecha_compra);
          const equipoFecha = normalizeDateString(equipo.fecha_compra);
          // Solo comparamos si ambas fechas (filtro y dato) son válidas y coincidentes
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
    // Buscar el equipo por placa
    const equipo = equiposMock.find((e) => e.placa === placa);

    // Si no encuentra el equipo, debería manejar este caso
    if (!equipo) {
      throw new Error(`No se encontró equipo con placa ${placa}`);
    }

    return equipo;
  },
  registrarRealizacion: async (placa, fechaRealizacion, observacion) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const equipoIndex = equiposMock.findIndex((e) => e.placa === placa);
        if (equipoIndex !== -1) {
          equiposMock[equipoIndex].fechaRealizacion =
            fechaRealizacion.toISOString();
          equiposMock[equipoIndex].observaciones = observacion || ""; // Guardar observación
          // Podrías querer cambiar el estado también, ej: equiposMock[equipoIndex].estado = "Activo";
          resolve(equiposMock[equipoIndex]);
        } else {
          reject(
            new Error(
              `No se encontró equipo con placa ${placa} para registrar mantenimiento.`
            )
          );
        }
      }, 300); // Simula delay
    });
  },
  actualizarMantenimiento: async (placa, datosActualizados) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const equipoIndex = equiposMock.findIndex(e => e.placa === placa);
        if (equipoIndex !== -1) {
          // Actualizar solo los campos proporcionados en datosActualizados
          // y asegurarse de que la fechaRealizacion se maneje correctamente
          const fechaRealizacionActualizada = datosActualizados.fechaRealizacion
            ? new Date(datosActualizados.fechaRealizacion).toISOString()
            : equiposMock[equipoIndex].fechaRealizacion; // Mantener la existente si no se provee una nueva válida

          equiposMock[equipoIndex] = {
            ...equiposMock[equipoIndex],
            ...datosActualizados,
            fechaRealizacion: fechaRealizacionActualizada,
          };
          resolve(equiposMock[equipoIndex]);
        } else {
          reject(new Error(`No se encontró equipo con placa ${placa} para actualizar.`));
        }
      }, 300);
    });
  },
};