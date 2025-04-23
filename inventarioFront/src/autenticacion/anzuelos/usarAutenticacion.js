import { useContext } from "react";
import { ProveedorAutenticacion } from "../contexto/ContextoAutenticacion";

export const useAuth = () =>{  const context = useContext(ProveedorAutenticacion);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}