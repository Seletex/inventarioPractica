import { useContext } from 'react';
import { ContextoLogin } from '../../componentes/ContextoLogin'; 

export const useLogin = () => {
  const context = useContext(ContextoLogin);
  if (context === undefined) {
    throw new Error('useLogin debe usarse dentro de un ProveedorLogin');
  }
  return context;
};
