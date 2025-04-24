import { createContext, useState, useEffect,useMemo,useCallback } from 'react';
import PropTypes from 'prop-types';
import { loginUsuario, verificarSesion, logoutUsuario } from '../../servicios/Autenticacion.service';
const ContextoAutenticacion = createContext();

export function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Verificar sesión al cargar
  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        ProveedorAutenticacion.propTypes = {
          children: PropTypes.node.isRequired,
        };
        const token = localStorage.getItem('token');
        if (token) {
          const usuario = await verificarSesion(token);
          setUsuario(usuario);
        } else {
          setUsuario(null);
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

  const login = useCallback(async (correo, contraseña) => {
    try {
      const { token, usuario } = await loginUsuario(correo, contraseña);
      localStorage.setItem('token', token);
      setUsuario(usuario);
      return { exito: true };
    } catch (error) {
      return { exito: false, error: error.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUsuario();
    } finally {
      localStorage.removeItem('token');
      setUsuario(null);
    }
  }, []);

  const value = useMemo(() => ({
    usuario,
    cargando,
    login,
    logout,
    estaAutenticado: !!usuario
  }), [usuario, cargando, login, logout]);

  return (
    <ContextoAutenticacion.Provider value={value}>
      {!cargando && children}
    </ContextoAutenticacion.Provider>
  );
}

