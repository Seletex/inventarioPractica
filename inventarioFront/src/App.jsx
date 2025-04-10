import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Navegacion from "./componentes/Navegacion";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaginaLogin from './paginas/autenticacion/PaginaLogin';
import PaginaRegistro from './paginas/autenticacion/PaginaRegistro';
import PaginaMenu from './paginas/autenticacion/PaginaMenu';
//import Tablero from './paginas/Tablero';

//import { ProveedorFormularioAutenticacion } from './componentes/FormularioAutenticacion';
function App() {
 // const { usuario } = useAuth();
  return (
    <div className="App">
  
    
        <div className="container mx-auto">
        
          <Router>
          <Navegacion />
            <Routes>
              <Route path="/" element={<PaginaLogin />} />
              <Route path="/menu" element={<PaginaMenu />} />
              <Route path="/login" element={<PaginaLogin />} />
              <Route path="/register" element={<PaginaRegistro />} />
            </Routes>
          </Router>
        </div>
       
     </div>
)}
export default App;
