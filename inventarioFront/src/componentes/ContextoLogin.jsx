// Ruta: src/autenticacion/contexto/ContextoLogin.jsx
import React, { createContext, useState,  } from "react";
import { BrowserRouter as Router, useNavigate } from 'react-router-dom'; // Asegúrate de envolver tu aplicación en un Router
 // Asegúrate de que la ruta sea correcta

const ContextoLogin = createContext(undefined); // Es buena práctica dar un valor inicial undefined

// 2. Crear el Proveedor con nombre claro y usando 'children'
export const ProveedorLogin = ({ children }) => {

  const [usuario, asignarUsuario] = useState(null);
  const navigate = useNavigate(); // Inicializar navigate

  const login = (datosUsuario) => {
    
    // - Llamar a al servicio API (ej: axios.post('/api/auth/login', datosUsuario))
    // - Si la respuesta es exitosa:
    //   - Guardar el token JWT en localStorage: localStorage.setItem('token', respuesta.data.token);
    //   - Actualizar el estado del usuario: asignarUsuario(respuesta.data.usuario);
    // - Si hay error, manejarlo (mostrar mensaje, etc.)
    console.log("Simulando login con: ", datosUsuario);
    // Ejemplo simple (reemplazar con lógica real):
    if (datosUsuario.email && datosUsuario.password) {
       // Simular datos de usuario después del login
       const usuarioLogueadoSimulado = { id: '1', email: datosUsuario.email, nombre: 'Usuario Simulado' };
       localStorage.setItem('token', 'simulated_token'); // Simular guardado de token
       asignarUsuario(usuarioLogueadoSimulado);
       // Podrías redirigir aquí si el login es exitoso, ej: navigate('/dashboard');
    } else {
       // Lanzar o manejar error si los datos no son válidos
       console.error("Datos de login incompletos");
       // Podrías lanzar un error para que el formulario lo capture:
       // throw new Error("Correo y contraseña son requeridos");
    }
  };

  const logout = () => {
    console.log("Cerrando sesión");
    localStorage.removeItem('token'); // Siempre limpiar el token
    asignarUsuario(null); // Limpiar el estado del usuario
    // Usar navigate para una mejor experiencia en SPA
    if (navigate) {
        navigate('/login');
    } else {
        console.error("Navigate no está disponible.  Asegúrate de usar un Router.");
        window.location.href = '/login'; // Alternativa si no usas React Router
    }
  };

  // Crear el objeto de valor del contexto una sola vez
  const contextValue = {
     usuario,
     login,
     logout
     // Puedes añadir aquí el estado de carga si el login es asíncrono
     // isLoading,
  };

  return (
    <ContextoLogin.Provider value={contextValue}>
      {children} {/* Usar la prop estándar 'children' */}
    </ContextoLogin.Provider>
  );
};

// export default ContextoLogin;
