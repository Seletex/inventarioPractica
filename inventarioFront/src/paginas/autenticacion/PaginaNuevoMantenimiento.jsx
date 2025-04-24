import { useState, useEffect } from "react"; // Importamos useEffect
import { useNavigate, Link, useParams } from "react-router-dom"; // Importamos useParams
import Entrada from "../../componentes/InterfazUsuario/Entrada.jsx";
import Boton from "../../componentes/InterfazUsuario/Boton.jsx"; // Importamos Boton
import { Card } from "primereact/card";
import { FiUser, FiCalendar } from "react-icons/fi";
import { DatosTipoMantenimiento } from "../../componentes/Datos/DatosTipoMantenimiento.jsx";
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js"; // Servicio
// Importar el servicio de mantenimientos (NECESITAS CREAR ESTE SERVICIO)
import { mockMantenimientoService as mantenimientosService } from "../../servicios/mockMantenimientos.api.js"; // Servicio
import { DatosUbicacion } from "../../componentes/Datos/DatosUbicaciones.jsx";
// Importar toastify
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Estilos de toast

// Importar el hook para obtener el usuario logueado (asegúrate de la ruta)
import { useUsuarioLogueado } from "../../autenticacion/contexto/UsuarioLogueado.jsx";

export default function PaginaNuevoMantenimiento() {
  // --- Estado del formulario para el mantenimiento ---
  const [formulario, setFormulario] = useState({
    placa: "", // Se pre-llenará desde la URL/equipo
    tipoMantenimiento: "", // Select para el tipo de mantenimiento
    fechaProgramada: "", // Input de fecha para la fecha programada
    tecnico: "", // Campo para el técnico (pre-llenado con responsable/usuario logueado)
    ubicacion: "", // Campo para la ubicación (opcional, puedes pre-llenar desde el equipo)
    // Puedes añadir otros campos si tu mantenimiento los requiere (ej: observaciones, estado inicial)
  });

  const [error, setError] = useState("");
  const [cargandoInicial, setCargandoInicial] = useState(true); // Para mostrar "Cargando..."
  const [cargandoEnvio, setCargandoEnvio] = useState(false); // Para el botón de envío

  // Estado para guardar los datos completos del equipo cargado (para mostrar tipoEquipo)
  const [datosEquipoCargado, setDatosEquipoCargado] = useState(null);

  const { placa } = useParams(); // Obtener la placa de la URL
  const navigate = useNavigate();

  // Obtener el usuario logueado
  const usuarioLogueado = useUsuarioLogueado();

  // --- Efecto para cargar datos del equipo y pre-llenar Placa y Técnico ---
  useEffect(() => {
    const inicializarFormulario = async () => {
      setCargandoInicial(true);
      setError("");

      let placaCargada = ""; // Para guardar la placa obtenida del servicio
      let tecnicoInicial = ""; // Para guardar el nombre del técnico inicial
      let equipoData = null; // Para guardar los datos completos del equipo

      // 1. Si la placa viene en la URL, intentar cargar el equipo
      if (placa) {
        try {
          equipoData = await equiposService.getById(placa);
          placaCargada = equipoData.placa; // Usar la placa del objeto cargado para el estado
          setDatosEquipoCargado(equipoData); // Guardar datos completos del equipo
        } catch (err) {
          const errorMessage =
            err.message || "Error desconocido al cargar equipo.";
          setError(
            `Error cargando datos del equipo con placa ${placa}: ` +
              errorMessage
          );
          console.error("Error cargando equipo:", err);
          // Opcional: Si el equipo no existe o falla, mostrar error y quizás no mostrar formulario
          // setDatosEquipoCargado(null); // Asegurarse de que no haya datos de equipo si falla
        }
      } else {
        setError("Placa de equipo no proporcionada en la URL.");
        console.warn(
          "Página de nuevo mantenimiento accedida sin placa en URL."
        );
        // Opcional: Redirigir si no hay placa
        // navigate('/gestionar-equipos');
      }

      // 2. Determinar el técnico inicial desde el usuario logueado
      if (usuarioLogueado?.nombreCompleto) {
        // Asumiendo que el objeto usuario tiene 'nombreCompleto'
        tecnicoInicial = usuarioLogueado.nombreCompleto;
      } else {
        tecnicoInicial = "Desconocido"; // O "". Si el usuario NO está logueado, quizás no se permite crear mantenimiento?
        toast.warn("Debes iniciar sesión para programar mantenimiento.");
        // navigate('/login'); // Redirigir al login si es mandatorio
      }

      // 3. Pre-llenar el estado del formulario de mantenimiento
      setFormulario((prevFormulario) => ({
        ...prevFormulario, // Mantiene otros campos como tipoMantenimiento, fechaProgramada ("")
        placa: placaCargada, // Pre-llenar placa (vacía si hubo error/no URL)
        tecnico: tecnicoInicial, // Pre-llenar técnico
        fechaProgramada: new Date().toISOString().split("T")[0], // Opcional: Pre-llenar fecha con hoy
      }));

      setCargandoInicial(false); // Desactivar carga inicial
    };

    // Ejecutar la inicialización
    inicializarFormulario();
  }, [placa, navigate, usuarioLogueado]); // Dependencias del efecto

  // --- Manejar el cambio en cualquier campo del formulario ---
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: value,
    }));
  };

  // --- Manejar el envío del formulario para CREAR MANTENIMIENTO ---
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");
    setCargandoEnvio(true);

    // --- Validaciones ---
    // Validar que los campos requeridos estén llenos ANTES de enviar
    if (!formulario.placa) {
      setError("Error: Placa del equipo no cargada."); // Este caso no debería pasar si la carga inicial fue exitosa
      setCargandoEnvio(false);
      toast.error("Error: Placa del equipo no disponible.");
      return;
    }
    if (!formulario.tipoMantenimiento) {
      setError("El Tipo de Mantenimiento es requerido.");
      setCargandoEnvio(false);
      toast.error("El Tipo de Mantenimiento es requerido.");
      return;
    }
    if (!formulario.ubicacion) {
      setError("La ubicación es requerida.");
      setCargandoEnvio(false);
      toast.error("La ubicacion es requerida.");
      return;
    }
    if (!formulario.fechaProgramada) {
      setError("La Fecha Programada es requerida.");
      setCargandoEnvio(false);
      toast.error("La Fecha Programada es requerida.");
      return;
    }
    if (!formulario.tecnico) {
      setError("El Técnico es requerido.");
      setCargandoEnvio(false);
      toast.error("El Técnico es requerido.");
      return;
    }

    // --- Preparar datos para enviar al servicio de Mantenimientos ---
    const datosParaMantenimiento = {
      equipoPlaca: formulario.placa, // Relacionar con el equipo por placa
      tipo: formulario.tipoMantenimiento, // Tipo de mantenimiento
      fechaProgramada: formulario.fechaProgramada, // Fecha programada (formato YYYY-MM-DD)
      tecnico: formulario.tecnico, // Técnico asignado
      fechaRealizacion: null, // Inicialmente no realizado
      estado: "Programado", // Estado inicial por defecto
      // Puedes añadir otros campos si tu modelo de mantenimiento los tiene
      ubicacion: datosEquipoCargado?.ubicacion || formulario.ubicacion || "", // Opcional: guardar la ubicación del equipo en el mantenimiento
      responsable: datosEquipoCargado?.responsable || "", // Opcional: guardar el responsable del equipo en el mantenimiento
      // ID será generado por el backend o el mock service
    };

    try {
      await mantenimientosService.create(datosParaMantenimiento);

      // --- Mostrar mensaje de éxito ---
      toast.success(
        `Mantenimiento programado para placa ${formulario.placa} el ${formulario.fechaProgramada}.`
      );

      // --- Redirigir después de la acción ---
      navigate("/programados"); // O a la página de gestión de mantenimientos
    } catch (err) {
      // --- Mostrar mensaje de error ---
      const errorMessage =
        err.message || "Error desconocido al programar mantenimiento.";
      setError(`Error al programar mantenimiento: ${errorMessage}`);
      console.error("Error programando mantenimiento:", err);
      toast.error(`Error al programar: ${errorMessage}`);
    } finally {
      setCargandoEnvio(false);
    }
  };

  // --- JSX: Mostrar estado de carga inicial o el formulario ---
  // Mostramos "Cargando..." solo si estamos cargando *inicialmente*
  if (cargandoInicial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando datos del equipo {placa ? `con placa ${placa}` : ""}...</p>
      </div>
    );
  }

  if (error || !datosEquipoCargado) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>
          {error ||
            `No se encontraron datos para el equipo con placa ${placa}.`}
        </p>
        {/* Enlace para volver */}
        <div className="text-center text-sm text-gray-600 mt-4">
          <Link
            to="/gestionar-equipos"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Volver a la gestión de equipos
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10">
          <Card
            // --- Título y subtítulo del mantenimiento ---
            title="Nuevo Mantenimiento"
            className="w-full md:w-30rem"
            style={{
              width: "350px",
              borderRadius: "5px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              fontFamily: "'Times New Roman', Times, serif",
            }}
          >
            {/* Mostrar errores de validación/envío dentro del Card */}
            {error && ( // Mostrar error si hay alguno después de la carga inicial exitosa
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={manejarEnvio}>
              <div className="campo">
                <label
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: "21px",
                  }}
                  htmlFor="placa"
                  className="block text-sm font-medium text-gray-700"
                >
                  Placa:
                </label>
                <input
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: "18px",
                  }}
                  id="placa"
                  type="text"
                  value={datosEquipoCargado.placa}
                  readOnly
                  className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                />
              </div>

              <div className="campo">
                <select
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: "18px",
                    marginTop: "10px",
                  }}
                  id="tipoMantenimiento"
                  name="tipoMantenimiento"
                  value={formulario.tipoMantenimiento}
                  onChange={manejarCambio}
                  required={true} // Validamos en JS
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {DatosTipoMantenimiento.map((tipoOpcion) => (
                    <option key={tipoOpcion.value} value={tipoOpcion.value}>
                      {tipoOpcion.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="campo">
                <select
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: "18px",
                    marginTop: "10px",
                  }}
                  id="ubicacion"
                  name="ubicacion"
                  value={formulario.ubicacion}
                  onChange={manejarCambio}
                  required={true} // Validamos en JS
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {DatosUbicacion.map((tipoOpcion) => (
                    <option key={tipoOpcion.value} value={tipoOpcion.value}>
                      {tipoOpcion.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* --- Campo Fecha Programada (Date Input) --- */}
              <Entrada
                placeHolder="Fecha Programada"
                tipo="date"
                name="fechaProgramada"
                valor={formulario.fechaProgramada}
                required={true}
                manejarCambio={manejarCambio}
                icono={<FiCalendar className="text-gray-400" />}
                label="Fecha Programada:"
              />

              {/* Campo Técnico (Pre-llenado y Editable) */}
              <Entrada
                placeHolder="Técnico Asignado"
                tipo="text"
                name="tecnico"
                valor={formulario.tecnico} // Valor pre-llenado del usuario logueado
                required={true} // Validamos que sea requerido
                manejarCambio={manejarCambio} // Permite modificar
                icono={<FiUser className="text-gray-400" />}
                label="Técnico:"
                // Opcional: deshabilitar si no es posible cambiar al tecnico que cambien el técnico
                disabled={true}
              />

              <Boton tipo="submit" disabled={cargandoEnvio}>
                {cargandoEnvio ? "Registrando..." : "Registrar Mantenimiento"}
              </Boton>

              <div className="text-center text-sm text-gray-600">
                <Link
                  to={`/gestionar-equipos`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
