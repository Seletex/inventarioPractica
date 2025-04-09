import  ProveedorAutenticacion from "../contextos/ContextoAutenticacion";
import { useEffect, useState } from "react";
import { obtenerEstadisticas } from "../servicios/Inventario.service";
import { FiBox, FiUsers, FiAlertTriangle, FiLogOut } from "react-icons/fi";
/*import GraficoInventario from "../componentes/graficos/GraficoInventario";
import TarjetaResumen from "../componentes/ui/TarjetaResumen";
import TablaProductos from "../componentes/tablas/TablaProductos";*/

export default function Tablero() {
  const { usuario, logout } = ProveedorAutenticacion();
  const [estadisticas, setEstadisticas] = useState({
    totalProductos: 0,
    productosBajoStock: 0,
    categorias: 0,
    usuariosRegistrados: 0
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datos = await obtenerEstadisticas();
        setEstadisticas(datos);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra superior */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{usuario?.nombre}</span>
            <button
              onClick={logout}
              className="flex items-center text-gray-500 hover:text-red-600 transition"
            >
              <FiLogOut className="mr-1" /> Salir
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Tarjetas resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <TarjetaResumen
            titulo="Productos"
            valor={estadisticas.totalProductos}
            icono={<FiBox className="text-blue-500" size={24} />}
            variacion="+12% este mes"
            color="blue"
          />
          <TarjetaResumen
            titulo="Bajo Stock"
            valor={estadisticas.productosBajoStock}
            icono={<FiAlertTriangle className="text-yellow-500" size={24} />}
            variacion="5 nuevos hoy"
            color="yellow"
          />
          <TarjetaResumen
            titulo="Categorías"
            valor={estadisticas.categorias}
            icono={<FiBox className="text-green-500" size={24} />}
            variacion="3 nuevas"
            color="green"
          />
          <TarjetaResumen
            titulo="Usuarios"
            valor={estadisticas.usuariosRegistrados}
            icono={<FiUsers className="text-purple-500" size={24} />}
            variacion="+2 esta semana"
            color="purple"
          />
        </div>

        {/* Gráfico y tabla */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Inventario por categoría</h2>
            <GraficoInventario datos={estadisticas.porCategoria} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Alertas recientes</h2>
            <ul className="space-y-3">
              {estadisticas.alertas?.map((alerta, index) => (
                <li key={index} className="flex items-start">
                  <span className={`flex-shrink-0 ${
                    alerta.criticidad === 'alta' 
                      ? 'text-red-500' 
                      : alerta.criticidad === 'media' 
                        ? 'text-yellow-500' 
                        : 'text-blue-500'
                  }`}>
                    <FiAlertTriangle className="mt-1 mr-2" />
                  </span>
                  <span className="text-sm text-gray-700">{alerta.mensaje}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Últimos productos</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
              Agregar Producto
            </button>
          </div>
          <TablaProductos productos={estadisticas.ultimosProductos} />
        </div>
      </main>
    </div>
  );
}