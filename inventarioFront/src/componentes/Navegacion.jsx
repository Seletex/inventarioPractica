// Archivo: src/componentes/Navegacion.jsx

import React, { useContext } from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
// --- CORRECCIÓN DEFINITIVA: Importa el CONTEXTO ---
import { ContextoAutenticacion } from "../autenticacion/contexto/ContextoAutenticacion"; // <--- ¡Importa esto!

const Navegacion = () => {
  const navigate = useNavigate();
  // --- CORRECCIÓN DEFINITIVA: Usa el CONTEXTO importado ---
  const authContext = useContext(ContextoAutenticacion); // <--- ¡Usa esto!

  // La verificación ahora debería funcionar correctamente
  if (!authContext) {
     console.error("Contexto de Autenticación no encontrado. Asegúrate que Navegacion esté dentro de ProveedorAutenticacion.");
     return null; // O un estado de carga/error
  }

  const { usuario, logout, cargando } = authContext;

   if (cargando) {
     return <div className="card"><Menubar model={[{label: 'Cargando...'}]} /></div>;
   }

  const estaLogueado = !!usuario;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      console.error("La función logout no está disponible en el contexto.");
    }
  };

  const navlist = [
    {
      label: "Principal",
      icon: "pi pi-home",
      command: () => {
        if (estaLogueado) {
          handleNavigation("/menu");
        } else {
          handleNavigation("/login");
        }
      },
    },
    {
      label: "Acerca de",
      icon: "pi pi-info",
      command: () => {
        handleNavigation("/acerca-de");
      },
    },
    {
      label: "Contacto",
      icon: "pi pi-envelope",
      command: () => {
        handleNavigation("/contacto");
      },
    },
  ];

  if (estaLogueado) {
    navlist.push({
      label: "Cerrar Sesión",
      icon: "pi pi-sign-out",
      command: handleLogout,
      className: "p-menuitem-logout",
    });
  }

  const menubarStyles = {
    width: "100%",
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "16px",
    marginBottom: "1rem",
  };

  return (
    <div className="card">
      <Menubar style={menubarStyles} model={navlist} />
    </div>
  );
};

export default Navegacion;
