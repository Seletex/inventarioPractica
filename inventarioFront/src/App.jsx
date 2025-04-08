import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProveedorAutenticacion } from './autenticacion/contexto/ContextoAutenticacion';
import { useAuth } from './autenticacion/anzuelos/usarAutenticacion';
import './App.css'
import AppRouter from './rutas/AppRouter'
import {FormularioAutenticacion} from './autenticacion/componentes/FormularioAutenticacion'
import {FormularioEquipo} from './autenticacion/componentes/FormularioEquipo'

const RutaPrivada = ({children}) => {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <ProveedorAutenticacion>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FormularioAutenticacion />} />
          <Route path="/login" element={<FormularioAutenticacion />} />
          <Route path="/registro" element={<FormularioAutenticacion />} />
          <Route path="/inventario" element={<FormularioEquipo/>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProveedorAutenticacion>
   
  )
 
}

export default App
