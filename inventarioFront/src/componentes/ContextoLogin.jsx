import React, { createContext, useState } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";

const ContextoLogin = createContext(undefined);

export const ProveedorLogin = ({ children }) => {
  const [usuario, asignarUsuario] = useState(null);
  const navigate = useNavigate();

  const login = (datosUsuario) => {
    console.log("Simulando login con: ", datosUsuario);

    if (datosUsuario.email && datosUsuario.password) {
      const usuarioLogueadoSimulado = {
        id: "1",
        email: datosUsuario.email,
        nombre: "Usuario Simulado",
      };
      localStorage.setItem("token", "simulated_token");
      asignarUsuario(usuarioLogueadoSimulado);
      // Redirigir aquí si el login es exitoso, ej: navigate('/dashboard');
      navigate("/menu");
    } else {
      console.error("Datos de login incompletos");

      throw new Error("Correo y contraseña son requeridos");
    }
  };

  const logout = () => {
    console.log("Cerrando sesión");
    localStorage.removeItem("token");
    asignarUsuario(null);

    if (navigate) {
      navigate("/login");
    } else {
      console.error(
        "Navigate no está disponible.  Asegúrate de usar un Router."
      );
      window.location.href = "/login";
    }
  };

  const contextValue = {
    usuario,
    login,
    logout,
  };

  return (
    <ContextoLogin.Provider value={contextValue}>
      {children}
    </ContextoLogin.Provider>
  );
};
