// Archivo: App.jsx

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Navegacion from "./componentes/Navegacion";

// *** Importar BrowserRouter, Routes, Route desde react-router-dom ***
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importar tus páginas (asegúrate de las rutas correctas)
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
// *** Importar tu ProveedorAutenticacion ***
import { ProveedorAutenticacion } from "./autenticacion/contexto/ContextoAutenticacion"; // Asegúrate de la ruta


function App() {
  return (
    <div className="App">
     <ProveedorAutenticacion>
        <Router> {/* El Router generalmente va dentro del Provider si el Provider necesita hooks del router o viceversa */}
           {/* Puedes poner Navegacion aquí si es parte del layout general para las rutas */}
          <Navegacion />

          <div className="container mx-auto">
            <Routes>
              {/* Rutas públicas (ej: login, registro) - Pueden no necesitar el contexto, pero no hace daño que estén dentro */}
              <Route path="/" element={<PaginaLogin />} />
              <Route path="/login" element={<PaginaLogin />} />
              <Route path="/register" element={<PaginaRegistro />} />
                <Route path="/menu" element={<PaginaMenu />} />
              <Route path="/gestion-equipo" element={<GestionarEquipos />}/>
              <Route path="/programados" element={<ManteniminetosProgramados />}/>
              <Route path="/gestion-usuarios" element={<GestionarUsuarios />}/>

              {/* Rutas de gestión de equipos específicas */}
              <Route path="/registrar-equipo" element={<PaginaRegistrarEquipos />}/>
              {/* --- CORRECCIÓN: Mantener solo la ruta con el parámetro --- */}
              <Route path="/actualizar-equipo/:placa" element={<PaginaActualizarEquipos />}/>
              <Route path="/nuevo-mantenimiento/:placa" element={<PaginaNuevoMantenimiento />}/>
              {/* --- CORRECCIÓN: Mantener solo la ruta con el parámetro --- */}
              <Route path="/dar-de-baja/:placa" element={<PaginaDarDeBajaEquipo />}/>
              <Route path="*" element={<PaginaLogin />} />

            </Routes>
          </div>
        </Router>
      </ProveedorAutenticacion>
    </div>
  );
}

export default App;