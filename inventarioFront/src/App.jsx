import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Navegacion from "./componentes/Navegacion"; // Componente de navegación principal
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom"; // Importar Outlet

import PaginaLogin from "./paginas/autenticacion/PaginaLogin";
import PaginaRegistro from "./paginas/autenticacion/PaginaRegistro";
import PaginaMenu from "./paginas/autenticacion/PaginaMenu";
import GestionarEquipos from "./paginas/autenticacion/GestionarEquipos";
import ManteniminetosProgramados from "./paginas/autenticacion/MantenimientosProgramados";
import GestionarUsuarios from "./paginas/autenticacion/GestiónUsuarios";
import PaginaRegistrarEquipos from "./paginas/autenticacion/PaginaRegistrarEquipo";
import PaginaActualizarEquipos from "./paginas/autenticacion/PaginaActualizarEquipo";
import PaginaDarDeBajaEquipo from "./paginas/autenticacion/PaginaBajaEquipo"; // Asegúrate de que el nombre del archivo sea correcto (PaginaBaja.jsx)
import PaginaNuevoMantenimiento from "./paginas/autenticacion/PaginaNuevoMantenimiento";
import PaginaProgramarMantenimientos from "./paginas/autenticacion/PaginaProgramarMantenimientos";
import { ProveedorAutenticacion } from "./autenticacion/contexto/ProveedorAutenticacion"; // Asegúrate de la ruta
import PaginaGeneradorReportes from "./paginas/autenticacion/PaginaGeneradorReportes";
import MenuMantenimientos from "./paginas/autenticacion/MenuMantenimiento";
import PaginaConsultas from "./paginas/autenticacion/PaginaConsultas";
import PaginaAcercaDe from "./paginas/autenticacion/PaginaAcercaDe";
import PaginaContacto from "./paginas/autenticacion/PaginaContacto";
import PaginaSolicitarMantenimiento from "./paginas/publicas/PaginaSolicitarMantenimiento";
import PaginaConsultarEquipoPlaca from "./paginas/publicas/PaginaConsultarEquipoPlaca";

// Componente Layout para rutas que necesitan Navegacion
const AppLayout = () => {
  return (
    <>
      <Navegacion />
      <div className="container mx-auto">
        <Outlet /> {/* Las rutas anidadas se renderizarán aquí */}
      </div>
    </>
  );
};

function App() {
  return (
    <div className="App">
      <ProveedorAutenticacion>
        <Router>
          {/* El Router generalmente va dentro del Provider si el Provider necesita hooks del router o viceversa */}
          <Routes>
            {/* Rutas públicas (sin Navegacion) */}
            <Route path="/" element={<PaginaLogin />} />
            <Route path="/login" element={<PaginaLogin />} />
            <Route
              path="/solicitar-mantenimiento"
              element={<PaginaSolicitarMantenimiento />}
            />
            <Route
              path="/consultar-equipo"
              element={<PaginaConsultarEquipoPlaca />}
            />

            {/* Rutas que usan el AppLayout (con Navegacion) */}
            <Route element={<AppLayout />}>
              <Route path="/register" element={<PaginaRegistro />} />
              <Route path="/menu" element={<PaginaMenu />} />
              <Route path="/gestion-equipo" element={<GestionarEquipos />} />
              <Route
                path="/programados"
                element={<ManteniminetosProgramados />}
              />
              <Route path="/gestion-usuarios" element={<GestionarUsuarios />} />
              <Route
                path="/registrar-equipo"
                element={<PaginaRegistrarEquipos />}
              />
              <Route
                path="/actualizar-equipo/:placa"
                element={<PaginaActualizarEquipos />}
              />
              <Route
                path="/nuevo-mantenimiento/:placa"
                element={<PaginaNuevoMantenimiento />}
              />
              <Route
                path="/reporte/:placa"
                element={<PaginaGeneradorReportes />}
              />
              <Route path="/reporte" element={<PaginaGeneradorReportes />} />
              <Route path="/dar-de-baja" element={<PaginaDarDeBajaEquipo />} />
              <Route
                path="/dar-de-baja/:placa"
                element={<PaginaDarDeBajaEquipo />}
              />
              <Route
                path="/programar-mantenimiento/:placa"
                element={<PaginaProgramarMantenimientos />}
              />
              <Route
                path="/programar-mantenimiento"
                element={<PaginaProgramarMantenimientos />}
              />
              <Route path="/consultas" element={<PaginaConsultas />} />
              <Route
                path="/menu-mantenimientos"
                element={<MenuMantenimientos />}
              />
              <Route path="/acerca-de" element={<PaginaAcercaDe />} />
              <Route path="/contacto" element={<PaginaContacto />} />
            </Route>

            <Route path="*" element={<PaginaLogin />} />
          </Routes>
        </Router>
      </ProveedorAutenticacion>
    </div>
  );
}

export default App;
