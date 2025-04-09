import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaginaLogin from './paginas/autenticacion/PaginaLogin';
function App() {
 // const { usuario } = useAuth();
  return (
    <Router>
    <Routes>
      <Route path="/" element={<h1>Página de inicio</h1>} />
      <Route path="/login" element={<PaginaLogin />} />
    </Routes>
  </Router>
)}
export default App;
