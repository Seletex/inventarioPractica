import { useContext } from "react";

import { ContextoAutenticacion } from "./ContextoAutenticacion"; 

export const useUsuarioLogueado = () => {

  const contextValue = useContext(ContextoAutenticacion); 

 
  if (contextValue === undefined || contextValue === null) {
    console.error("Error: useUsuarioLogueado debe usarse dentro de un ProveedorAutenticacion.");
 
    throw new Error("useUsuarioLogueado debe usarse dentro de un ProveedorAutenticacion.");
  
  }

 
  const { usuario } = contextValue;
  return usuario;
};
