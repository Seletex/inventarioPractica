// Archivo: src/autenticacion/contexto/UsuarioLogueado.jsx

import { useContext } from "react";
// --- CORRECCIÓN DEFINITIVA: Importa el CONTEXTO ---
import { ContextoAutenticacion } from "./ContextoAutenticacion"; // <--- ¡Importa esto!

export const useUsuarioLogueado = () => {
  // --- CORRECCIÓN DEFINITIVA: Usa el CONTEXTO importado ---
  const contextValue = useContext(ContextoAutenticacion); // <--- ¡Usa esto!

  // Quita el console.log si ya no lo necesitas
  // console.log("Valor del contexto en useUsuarioLogueado:", contextValue);

  if (contextValue === undefined || contextValue === null) {
    console.error("Error: useUsuarioLogueado debe usarse dentro de un ProveedorAutenticacion.");
    // Considera qué devolver aquí. Lanzar un error puede ser mejor durante el desarrollo.
    throw new Error("useUsuarioLogueado debe usarse dentro de un ProveedorAutenticacion.");
    // return null;
  }

  // Retorna solo la parte 'usuario'
  const { usuario } = contextValue;
  return usuario;
};
