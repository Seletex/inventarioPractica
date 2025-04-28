import { useContext } from 'react';
import { ContextoLogin } from '../../componentes/ContextoLogin'; // Asegúrate de que la ruta sea correcta

export const useLogin = () => {
  const context = useContext(ContextoLogin);
  if (context === undefined) {
    // Mensaje de error más específico
    throw new Error('useLogin debe usarse dentro de un ProveedorLogin');
  }
  return context;
};
