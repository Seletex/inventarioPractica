import { useContext } from "react";
import { ProveedorAutenticacion } from "./ContextoAutenticacion";
export const useUsuarioLogueado = () => {
  const contextValue = useContext(ProveedorAutenticacion);

  // *** Añadir este console.log TEMPORALMENTE para depurar ***
  console.log("Valor del contexto en useUsuarioLogueado:", contextValue);

  if (contextValue === undefined || contextValue === null) {
    // Mostrar el error SOLO si contextValue es inválido
    //console.error("Error: useUsuarioLogueado debe usarse dentro de un ProveedorAutenticacion. contextValue es:", contextValue);
    return null; // Retornar null porque el contexto no está disponible
  }

  const { usuario } = contextValue;
  return usuario;
};
