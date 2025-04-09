import { createContext, useState, useEffect } from 'react';
import { loginUsuario, logoutUsuario, verificarSesion } from '../servicios/Autenticacion.service';

const ContextoAutenticacion = createContext();

export function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Verificar sesión al cargar
  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const usuario = await verificarSesion(token);
          setUsuario(usuario);
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        localStorage.removeItem('token');
      } finally {
        setCargando(false);
      }
    };

    verificarAutenticacion();
  }, []);

  const login = async (correo, contraseña) => {
    try {
      const { token, usuario } = await loginUsuario(correo, contraseña);
      localStorage.setItem('token', token);
      setUsuario(usuario);
      return { exito: true };
    } catch (error) {
      return { exito: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await logoutUsuario();
    } finally {
      localStorage.removeItem('token');
      setUsuario(null);
    }
  };

  const value = {
    usuario,
    cargando,
    login,
    logout,
    estaAutenticado: !!usuario
  };

  return (
    <ContextoAutenticacion.Provider value={value}>
      {!cargando && children}
    </ContextoAutenticacion.Provider>
  );
}

