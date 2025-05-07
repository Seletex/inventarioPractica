// src/autenticacion/permisos.js

// Definición de permisos por rol
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
  // Rol por defecto para usuarios sin un rol específico o para invitados con acceso limitado
  Default: {
    gestionEquipo: false,
    gestionMantenimientos: false,
    gestionUsuarios: false,
    importarExportar: false,
    reportes: false,
    consultas: false,
  },
};
