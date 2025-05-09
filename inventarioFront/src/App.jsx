import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Navegacion from "./componentes/Navegacion"; // Componente de navegación principal
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import React, { Suspense, lazy, useContext } from "react"; // Agregado useContext
import { ContextoAutenticacion } from "./autenticacion/contexto/ContextoAutenticacion";
import { ProveedorAutenticacion } from "./autenticacion/contexto/ProveedorAutenticacion";
import HiladorDeCarga from "./componentes/HiladorDeCarga";
const PaginaLogin = lazy(() => import("./paginas/autenticacion/PaginaLogin"));
const PaginaRegistro = lazy(() =>
  import("./paginas/autenticacion/PaginaRegistro")
);
const PaginaMenu = lazy(() => import("./paginas/autenticacion/PaginaMenu"));
const GestionarEquipos = lazy(() =>
  import("./paginas/autenticacion/GestionarEquipos")
);
const ManteniminetosProgramados = lazy(() =>
  import("./paginas/autenticacion/MantenimientosProgramados")
);
const GestionarUsuarios = lazy(() =>
  import("./paginas/autenticacion/GestiónUsuarios")
);
const PaginaRegistrarEquipos = lazy(() =>
  import("./paginas/autenticacion/PaginaRegistrarEquipo")
);
const PaginaActualizarEquipos = lazy(() =>
  import("./paginas/autenticacion/PaginaActualizarEquipo")
);
const PaginaDarDeBajaEquipo = lazy(() =>
  import("./paginas/autenticacion/PaginaBajaEquipo")
);
const PaginaNuevoMantenimiento = lazy(() =>
  import("./paginas/autenticacion/PaginaNuevoMantenimiento")
);
const PaginaProgramarMantenimientos = lazy(() =>
  import("./paginas/autenticacion/PaginaProgramarMantenimientos")
);
const PaginaGeneradorReportes = lazy(() =>
  import("./paginas/autenticacion/PaginaGeneradorReportes")
);
const MenuMantenimientos = lazy(() =>
  import("./paginas/autenticacion/MenuMantenimiento")
);
const PaginaConsultas = lazy(() =>
  import("./paginas/autenticacion/PaginaConsultas")
);
const PaginaAcercaDe = lazy(() =>
  import("./paginas/autenticacion/PaginaAcercaDe")
);
const PaginaContacto = lazy(() =>
  import("./paginas/autenticacion/PaginaContacto")
);
const PaginaSolicitarMantenimiento = lazy(() =>
  import("./paginas/publicas/PaginaSolicitarMantenimiento")
);
const PaginaConsultarEquipoPlaca = lazy(() =>
  import("./paginas/publicas/PaginaConsultarEquipoPlaca")
);
const PaginaImportarExportar = lazy(() =>
  import("./paginas/autenticacion/PaginaImportarExportar")
);
const PaginaHistorialResponsable = lazy(() =>
  import("./paginas/autenticacion/PaginaHistorialResponsable")
);

import NavegacionPrivada from "./componentes/NavegacionPrivada";

const AppLayout = () => {
  const authContext = useContext(ContextoAutenticacion);

  const estaLogueado =
    authContext && authContext.usuario && !authContext.cargando;

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 bg-white shadow-sm">
          <Navegacion />

          {estaLogueado && <NavegacionPrivada />}
        </header>
        <main className="flex-grow container mx-auto p-4">
          <Outlet />
        </main>
        {/* <Footer /> */} {/* Descomentar si hay un componente Footer */}
      </div>
    </>
  );
};

function App() {
  return (
    <div className="App">
      <ProveedorAutenticacion>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<HiladorDeCarga />}>
                  <PaginaLogin />
                </Suspense>
              }
            />
            <Route
              path="/login"
              element={
                <Suspense fallback={<HiladorDeCarga />}>
                  <PaginaLogin />
                </Suspense>
              }
            />
            <Route
              path="/solicitar-mantenimiento"
              element={
                <Suspense fallback={<HiladorDeCarga />}>
                  <PaginaSolicitarMantenimiento />
                </Suspense>
              }
            />
            <Route
              path="/consultar-equipo"
              element={
                <Suspense fallback={<HiladorDeCarga />}>
                  <PaginaConsultarEquipoPlaca />
                </Suspense>
              }
            />
            <Route
              path="/historial-responsable"
              element={
                <Suspense fallback={<HiladorDeCarga />}>
                  <PaginaHistorialResponsable />
                </Suspense>
              }
            />
            <Route element={<AppLayout />}>
              {" "}
              <Route
                path="/importar-exportar"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaImportarExportar />
                  </Suspense>
                }
              />
              <Route
                path="/register"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaRegistro />
                  </Suspense>
                }
              />
              <Route
                path="/menu"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaMenu />
                  </Suspense>
                }
              />
              <Route
                path="/gestion-equipo"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <GestionarEquipos />
                  </Suspense>
                }
              />
              <Route
                path="/programados"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <ManteniminetosProgramados />
                  </Suspense>
                }
              />
              <Route
                path="/gestion-usuarios"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <GestionarUsuarios />
                  </Suspense>
                }
              />
              <Route
                path="/registrar-equipo"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaRegistrarEquipos />
                  </Suspense>
                }
              />
              <Route
                path="/actualizar-equipo/:placa"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaActualizarEquipos />
                  </Suspense>
                }
              />
              <Route
                path="/nuevo-mantenimiento/:placa"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaNuevoMantenimiento />
                  </Suspense>
                }
              />
              <Route
                path="/actualizar-equipo/:placa"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaActualizarEquipos />
                  </Suspense>
                }
              />
              <Route
                path="/nuevo-mantenimiento/:placa"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaNuevoMantenimiento />
                  </Suspense>
                }
              />
              <Route
                path="/reporte/:placa"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaGeneradorReportes />
                  </Suspense>
                }
              />
              <Route
                path="/reporte"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaGeneradorReportes />
                  </Suspense>
                }
              />
              <Route
                path="/dar-de-baja"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaDarDeBajaEquipo />
                  </Suspense>
                }
              />
              <Route
                path="/dar-de-baja/:placa"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaDarDeBajaEquipo />
                  </Suspense>
                }
              />
              <Route
                path="/programar-mantenimiento/:placa"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaProgramarMantenimientos />
                  </Suspense>
                }
              />
              <Route
                path="/programar-mantenimiento"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaProgramarMantenimientos />
                  </Suspense>
                }
              />
              <Route
                path="/consultas"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaConsultas />
                  </Suspense>
                }
              />
              <Route
                path="/menu-mantenimientos"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <MenuMantenimientos />
                  </Suspense>
                }
              />
              <Route
                path="/acerca-de"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaAcercaDe />
                  </Suspense>
                }
              />
              <Route
                path="/contacto"
                element={
                  <Suspense fallback={<HiladorDeCarga />}>
                    <PaginaContacto />
                  </Suspense>
                }
              />
            </Route>

            <Route path="*" element={<PaginaLogin />} />
          </Routes>
        </Router>
      </ProveedorAutenticacion>
    </div>
  );
}

export default App;
