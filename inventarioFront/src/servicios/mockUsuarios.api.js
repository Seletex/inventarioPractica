const usuariosMock = [
  {
    id:1,
    nombreCompleto: "Juan Pérez",
    correo: "juape@gmail.com",
    rol: "Administrador",
  },
  {
    id:2,
    nombreCompleto: "María López",
    correo: "MarPez@hotmail.com",
    rol: "Usuario Administrativo",
  },
  {
    id:3,
    nombreCompleto: "Carlos García",
    correo: "Carcia@yahoo.com",
    rol: "Consultor",
  },
];
export const mockUsuariosService = {
  getAll: () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(usuariosMock), 500);
    }),

  filtrarAvanzado: (filtros) =>
    new Promise((resolve) => {
      const resultados = usuariosMock.filter((usuario) => {
        let cumpleFiltro = true;

        if (filtros.nombre) {
          cumpleFiltro =
            cumpleFiltro &&
            usuario.nombre
              ?.toLowerCase()
              .includes(filtros.nombre.toLowerCase());
        }

        if (filtros.correo) {
          cumpleFiltro =
            cumpleFiltro &&
            usuario.correo
              ?.toLowerCase()
              .includes(filtros.correo.toLowerCase());
        }

        if (filtros.rol) {
          cumpleFiltro = cumpleFiltro && usuario.rol === filtros.rol;
        }

        if (filtros.estado) {
          cumpleFiltro = cumpleFiltro && usuario.estado === filtros.estado;
        }

        return cumpleFiltro;
      });

      setTimeout(() => resolve(resultados), 500);
    }),

  getById: (correo) =>
    new Promise((resolve) => {
      const equipo = usuariosMock.find((e) => e.id === correo);
      setTimeout(() => resolve(equipo), 500);
    }),
};
