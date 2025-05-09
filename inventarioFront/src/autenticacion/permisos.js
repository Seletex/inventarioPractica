export const permisosPorRol = {
  Administrador: {
    gestionEquipo: true,
    gestionMantenimientos: true,
    gestionUsuarios: true,
    importarExportar: true,
    reportes: true,
    consultas: true,
  },
  UsuarioAdministrativo: {
    gestionEquipo: true,
    gestionMantenimientos: true,
    gestionUsuarios: false,
    importarExportar: true,
    reportes: true,
    consultas: true,
  },
  Consultor: {
    gestionEquipo: false,
    gestionMantenimientos: false,
    gestionUsuarios: false,
    importarExportar: false,
    reportes: true,
    consultas: true,
  },
  
  Default: {
    gestionEquipo: false,
    gestionMantenimientos: false,
    gestionUsuarios: false,
    importarExportar: false,
    reportes: false,
    consultas: false,
  },
};
