// Archivo: src/autenticacion/contexto/ProveedorAutenticacion.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { loginUsuario, verificarSesion, logoutUsuario } from '../../servicios/Autenticacion.service';
import { ContextoAutenticacion } from './ContextoAutenticacion';
import HiladorDeCarga from '../../componentes/HiladorDeCarga'; // Para consistencia visual

export function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // ... (resto del código sin cambios) ...

  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // --- BUENA PRÁCTICA: Asegúrate que verificarSesion devuelva el objeto usuario ---
          const datosUsuario = await verificarSesion(token);
          setUsuario(datosUsuario); // Asume que verificarSesion devuelve el objeto usuario
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        localStorage.removeItem('token');
        setUsuario(null); // Asegúrate de limpiar el usuario en caso de error
      } finally {
        setCargando(false);
      }
    };

    verificarAutenticacion();
  }, []);

  const login = useCallback(async (correo, contraseña) => {
    try {
      const { token, usuario: datosUsuario } = await loginUsuario(correo, contraseña); // Renombrar para claridad
      localStorage.setItem('token', token);
      setUsuario(datosUsuario);
      return { exito: true };
    } catch (error) {
      // Considera no solo devolver el mensaje, sino quizás el objeto error completo o un código
      return { exito: false, error: error.message || "Error desconocido durante el login" };
    }
  }, []); // Las funciones de seteo de estado de useState tienen identidades estables

  const logout = useCallback(async () => {
    try {
      // Considera si logoutUsuario realmente necesita ser async o si solo limpia localmente
      await logoutUsuario(); // Si esta llamada falla, igual quieres limpiar localmente
    } catch(error) {
        console.error("Error durante el logout en el servidor:", error);
        // Decide si quieres notificar al usuario o solo loguear
    } finally {
      // Esta limpieza SIEMPRE debe ocurrir
      localStorage.removeItem('token');
      setUsuario(null);
    }
  }, []); // No hay dependencias que cambien

  // El valor que provee el contexto
  // Memoizar el objeto value para evitar re-renders innecesarios de los consumidores
  const value = useMemo(() => ({
    usuario,
    cargando,
    login,
    logout,
    estaAutenticado: !!usuario // Derivado del estado 'usuario'
  }), [usuario, cargando, login, logout]); // Dependencias del useMemo

  return (
    <ContextoAutenticacion.Provider value={value}>
      {/* Usar HiladorDeCarga para consistencia visual durante la carga inicial */}
      {cargando ? <HiladorDeCarga /> : children}
    </ContextoAutenticacion.Provider>
  );
}

// --- OPCIONAL PERO RECOMENDADO: Crear un hook personalizado ---
// export const useAuth = () => useContext(ContextoAutenticacion);
// Esto simplificaría el consumo del contexto en otros componentes:
// const { usuario, login } = useAuth();
