
import React, { createContext, useState, useMemo, useCallback } from "react";
import PropTypes from 'prop-types';
import './InterfazUsuario/FormularioAutenticacion.css'; // Asegúrate de que la ruta sea correcta


const FormularioAutenticacion = createContext();
export const ProveedorFormularioAutenticacion = ({ eventos }) => {
const [usuario] = useState({});

 const login = useCallback((DatosUsuario) => usuario(DatosUsuario), [usuario]);
 const logout = useCallback(() => {
  localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
  usuario(null);
    window.location.href = '/login'; // Redirigir a la página de inicio de sesión
  }, [usuario]);

 const contextValue = useMemo(() => ({ usuario, login, logout }), [usuario, login, logout]);

  return(
    <FormularioAutenticacion.Provider value={contextValue}>
      {eventos}
    </FormularioAutenticacion.Provider>
  )
 };
  ProveedorFormularioAutenticacion.propTypes = {
    eventos: PropTypes.node.isRequired,
  };
  
  export default FormularioAutenticacion;
 