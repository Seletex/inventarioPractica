// Archivo: src/componentes/NavegacionPrivada.jsx

import React, { useContext } from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import { ContextoAutenticacion } from "../autenticacion/contexto/ContextoAutenticacion";
import { permisosPorRol } from "../autenticacion/permisos";

const NavegacionPrivada = () => {
  const navigate = useNavigate();
  const authContext = useContext(ContextoAutenticacion);

  if (!authContext) {
    console.error(
      "Contexto de Autenticación no encontrado en NavegacionPrivada. Asegúrate que esté dentro de ProveedorAutenticacion."
    );
    return null;
  }

  const { usuario, cargando } = authContext;

  // No renderizar si está cargando o no hay usuario logueado
  if (cargando || !usuario) {
    return null;
  }

  const rolActual = usuario.rol || "Default";
  const permisos = permisosPorRol[rolActual] || permisosPorRol.Default;

  const itemsPrivados = [];

  // Gestión Operativa
  if (permisos.gestionEquipo) {
    itemsPrivados.push({
      label: "Gestionar Equipos",
      icon: "pi pi-box",
      command: () => navigate("/gestion-equipos"), // Ajusta esta ruta si es necesario
    });
  }
  if (permisos.gestionMantenimientos) {
    itemsPrivados.push({
      label: "Gestionar Mantenimientos",
      icon: "pi pi-wrench",
      command: () => navigate("/programados"), // Ajusta esta ruta si es necesario
    });
  }
  if (permisos.gestionUsuarios) {
    itemsPrivados.push({
      label: "Gestionar Usuarios",
      icon: "pi pi-users",
      command: () => navigate("/gestion-usuarios"), // Ajusta esta ruta si es necesario
    });
  }

  // Operaciones de Consulta (como submenú si hay alguna permitida)
  const operacionesConsultaSubmenu = [];
  if (permisos.importarExportar) {
    operacionesConsultaSubmenu.push({
      label: "Importar / Exportar",
      icon: "pi pi-file-import",
      command: () => navigate("/importar-exportar"), // Ajusta ruta
    });
  }
  if (permisos.reportes) {
    operacionesConsultaSubmenu.push({
      label: "Reportes",
      icon: "pi pi-file-pdf",
      command: () => navigate("/reportes"), // Ajusta ruta
    });
  }
  if (permisos.consultas) {
    operacionesConsultaSubmenu.push({
      label: "Consultas",
      icon: "pi pi-search",
      command: () => navigate("/consultas"), // Ajusta ruta
    });
  }

  if (operacionesConsultaSubmenu.length > 0) {
    itemsPrivados.push({
      label: "Operaciones",
      icon: "pi pi-briefcase",
      items: operacionesConsultaSubmenu,
    });
  }

  if (itemsPrivados.length === 0) {
    return null; // No mostrar la barra si no hay items permitidos
  }

  const menubarStyles = {
    width: "100%",
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "15px", // Puede ser igual o ligeramente diferente a la pública
    // marginBottom: "1rem", // Opcional, depende de cómo se integre en el layout
    borderTop: "1px solid #e9ecef", // Un separador visual ligero
  };

  return <Menubar style={menubarStyles} model={itemsPrivados} />;
};

export default NavegacionPrivada;

/*import React, { useContext } from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import { ContextoAutenticacion } from "../autenticacion/contexto/ContextoAutenticacion";
import { permisosPorRol } from "../autenticacion/permisos"; // Ajusta esta ruta si es necesario

const NavegacionPrivada = () => {
  const navigate = useNavigate();
  const authContext = useContext(ContextoAutenticacion);

  if (!authContext) {
    console.error(
      "Contexto de Autenticación no encontrado en NavegacionPrivada. Asegúrate que esté dentro de ProveedorAutenticacion."
    );
    return null;
  }

  const { usuario, cargando } = authContext;

  // No renderizar si está cargando o no hay usuario logueado
  if (cargando || !usuario) {
    return null;
  }

  const rolActual = usuario.rol || "Default";
  const permisos = permisosPorRol[rolActual] || permisosPorRol.Default;

  const itemsPrivados = [];

  // Ejemplo de cómo construir los items (deberías adaptarlo a tus necesidades y permisos)
  // Gestión Operativa
  if (permisos.gestionEquipo) {
    itemsPrivados.push({
      label: "Gestionar Equipos",
      icon: "pi pi-box",
      command: () => navigate("/gestion-equipo"),
    });
  }

  const mantenimientosSubmenu = [];
  if (permisos.gestionMantenimientos) { // Asumiendo que este permiso cubre ambos
    mantenimientosSubmenu.push({
        label: "Programados",
        icon: "pi pi-calendar",
        command: () => navigate("/programados"),
    });
    mantenimientosSubmenu.push({
        label: "Menú Mantenimientos", // Acceso a crear, etc.
        icon: "pi pi-list",
        command: () => navigate("/menu-mantenimientos"),
    });
  }

  if (mantenimientosSubmenu.length > 0) {
    itemsPrivados.push({
      label: "Mantenimientos",
      icon: "pi pi-wrench",
      items: mantenimientosSubmenu,
    });
  }

  if (permisos.gestionUsuarios) {
    itemsPrivados.push({
      label: "Gestionar Usuarios",
      icon: "pi pi-users",
      command: () => navigate("/gestion-usuarios"),
    });
  }
  // ... puedes añadir más items o submenús basados en otros permisos ...

  if (itemsPrivados.length === 0) {
    return null; // No mostrar la barra si no hay items permitidos para el rol
  }

  const menubarStyles = {
    width: "100%",
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "15px",
    // Considera si quieres un borde o un color de fondo ligeramente diferente
    // borderTop: "1px solid #dee2e6",
    // backgroundColor: "#f8f9fa",
    // marginBottom: "1rem", // Añadir un margen inferior si es necesario
  };

  return (
    <Menubar style={menubarStyles} model={itemsPrivados} />
  );
};

export default NavegacionPrivada;*/
