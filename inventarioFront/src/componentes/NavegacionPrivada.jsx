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

  // Usar directamente los valores del contexto
  const { usuario, cargando } = authContext;

  // No renderizar si está cargando o no hay usuario logueado (esta lógica es una salvaguarda, AppLayout ya debería controlar esto)
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
      command: () => navigate("/gestion-equipo"), // Ajusta esta ruta si es necesario
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

  // Operaciones de Consulta
  if (permisos.importarExportar) {
    itemsPrivados.push({
      label: "Importar / Exportar",
      icon: "pi pi-file-import",
      command: () => navigate("/importar-exportar"), // Ajusta ruta
    });
  }
  if (permisos.reportes) {
    itemsPrivados.push({
      label: "Reportes",
      icon: "pi pi-file-pdf",
      command: () => navigate("/reporte"), // Ajusta ruta
    });
  }
  if (permisos.consultas) {
    itemsPrivados.push({
      label: "Consultas",
      icon: "pi pi-search",
      command: () => navigate("/consultas"), // Ajusta ruta
    });
  }

  if (itemsPrivados.length === 0) {
    return null; // No mostrar la barra si no hay items permitidos
  }

  const menubarStyles = {
    width: "100%",
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "15px", // Puede ser igual o ligeramente diferente a la pública
    marginBottom: "1rem", // Opcional, depende de cómo se integre en el layout
    borderTop: "1px solid #e9ecef", // Un separador visual ligero
  };

  return <Menubar style={menubarStyles} model={itemsPrivados} />;
};

export default React.memo(NavegacionPrivada);
