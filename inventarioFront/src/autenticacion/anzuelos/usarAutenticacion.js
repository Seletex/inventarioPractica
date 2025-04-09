import { useContext } from "react";
import { ProveedorAutenticacion } from "../contexto/ContextoAutenticacion";

export const useAuth = () => useContext(ProveedorAutenticacion);