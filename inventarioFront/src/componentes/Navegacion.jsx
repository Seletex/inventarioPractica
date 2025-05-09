import React, { useContext } from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";

import { ContextoAutenticacion } from "../autenticacion/contexto/ContextoAutenticacion";

const Navegacion = () => {
  const navigate = useNavigate();

  const authContext = useContext(ContextoAutenticacion);

  if (!authContext) {
    console.error(
      "Contexto de Autenticación no encontrado. Asegúrate que Navegacion esté dentro de ProveedorAutenticacion."
    );
    return null;
  }

  const { usuario, logout, cargando } = authContext;

  if (cargando) {
    return (
      <div className="card">
        <Menubar model={[{ label: "Cargando..." }]} />
      </div>
    );
  }

  const estaLogueado = !!usuario;

  const manejarNavigation = (path) => {
    navigate(path);
  };

  const manejarCerarSesion = () => {
    if (logout) {
      logout();
    } else {
      console.error("La función logout no está disponible en el contexto.");
    }
  };

  const itemsGenerales = [
    {
      label: "Principal",
      icon: "pi pi-home",
      command: () => {
        if (estaLogueado) {
          manejarNavigation("/menu");
        } else {
          manejarNavigation("/login");
        }
      },
    },
    {
      label: "Acerca de",
      icon: "pi pi-info",
      command: () => {
        manejarNavigation("/acerca-de");
      },
    },
    {
      label: "Contacto",
      icon: "pi pi-envelope",
      command: () => {
        manejarNavigation("/contacto");
      },
    },
  ];

  if (estaLogueado) {
    itemsGenerales.push({
      label: "Cerrar Sesión",
      icon: "pi pi-sign-out",
      command: manejarCerarSesion,
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
      <Menubar style={menubarStyles} model={itemsGenerales} />
    </div>
  );
};

export default React.memo(Navegacion);
