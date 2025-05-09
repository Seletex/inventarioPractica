import { useState, useEffect, useCallback, useMemo, useContext } from "react";
import {
  loginUsuario,
  verificarSesion,
  logoutUsuario,
} from "../../servicios/Autenticacion.service";
import { ContextoAutenticacion } from "./ContextoAutenticacion";
import HiladorDeCarga from "../../componentes/HiladorDeCarga";

export function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const datosUsuario = await verificarSesion(token);
          setUsuario(datosUsuario);
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        localStorage.removeItem("token");
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    };

    verificarAutenticacion();
  }, []);

  const login = useCallback(async (correo, contraseña) => {
    try {
      const { token, usuario: datosUsuario } = await loginUsuario(
        correo,
        contraseña
      );
      localStorage.setItem("token", token);
      setUsuario(datosUsuario);
      return { exito: true };
    } catch (error) {
      return {
        exito: false,
        error: error.message || "Error desconocido durante el login",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUsuario();
    } catch (error) {
      console.error("Error durante el logout en el servidor:", error);
    } finally {
      localStorage.removeItem("token");
      setUsuario(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      usuario,
      cargando,
      login,
      logout,
      estaAutenticado: !!usuario,
    }),
    [usuario, cargando, login, logout]
  );

  return (
    <ContextoAutenticacion.Provider value={value}>
      {cargando ? <HiladorDeCarga /> : children}
    </ContextoAutenticacion.Provider>
  );
}

export const useAuth = () => useContext(ContextoAutenticacion);
