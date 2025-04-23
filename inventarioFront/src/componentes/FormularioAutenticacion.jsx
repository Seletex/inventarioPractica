
import { createContext,useState } from "react";
import './InterfazUsuario/FormularioAutenticacion.css'; // Asegúrate de que la ruta sea correcta


const FormularioAutenticacion = createContext();
export const ProveedorFormularioAutenticacion = ({ eventos }) => {
 const {usuario, asignarUsuario} = useState({});

 const login = (DatosUsuario) => asignarUsuario(DatosUsuario);
 const logout = () => {
  localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
    asignarUsuario(null);
    window.location.href = '/login'; // Redirigir a la página de inicio de sesión
  };
  return(
    <FormularioAutenticacion.Provider value={{usuario, login, logout }}>
      {eventos}
    </FormularioAutenticacion.Provider>
  )
 };

  export default FormularioAutenticacion;