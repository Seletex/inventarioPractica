import { useContext } from 'react';
import { ContextoAutenticacion } from './ContextoAutenticacionContext'; // Asegúrate que esta ruta sea correcta

export const useAuth = () => {
    const context = useContext(ContextoAutenticacion);
     if (context === undefined) {
       throw new Error('useAuth debe ser usado dentro de un ProveedorAutenticacion');
      }
      return context;
    };