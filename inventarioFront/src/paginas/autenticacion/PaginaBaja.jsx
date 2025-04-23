import { useState, useEffect, useContext } from "react"; // *** Importar useContext ***
import { useNavigate, Link, useParams } from "react-router-dom";
import Entrada from "../../componentes/InterfazUsuario/Entrada";
import { Card } from "primereact/card";
import { FiTag, FiMapPin, FiUser } from "react-icons/fi"; // Iconos
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js"; // Servicio
import { toast } from "react-toastify"; // Importar toast
import Boton from "../../componentes/InterfazUsuario/Boton"; // Importar Boton
import { DatosUbicacion } from "../../componentes/Datos/DatosUbicaciones.jsx"; // Importar DatosUbicacion } from "../../componentes/Datos/DatosUbicaciones.jsx";
import "react-toastify/dist/ReactToastify.css"; // Estilos de toast
import  {ProveedorAutenticacion} from "../../autenticacion/contexto/ContextoAutenticacion.jsx"; // <<< Asegúrate de que la ruta sea correcta

// Dentro de PaginaDarDeBajaEquipo.jsx

const useUsuarioLogueado = () => {
    const contextValue = useContext(ProveedorAutenticacion);

    // *** Añade este console.log TEMPORALMENTE para depurar ***
    console.log("Valor del contexto en useUsuarioLogueado:", contextValue);

    if (contextValue === undefined || contextValue === null) {
        // Mostrar el error SOLO si contextValue es inválido
        //console.error("Error: useUsuarioLogueado debe usarse dentro de un ProveedorAutenticacion. contextValue es:", contextValue);
        return null; // Retornar null porque el contexto no está disponible
    }

    const { usuario } = contextValue;
    return usuario;
};
export default function PaginaDarDeBajaEquipo() {
  const [formulario, setFormulario] = useState({
    placa: "",
    ubicacion: "",
    responsable: "",
  });

  const [error, setError] = useState("");
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [cargandoEnvio, setCargandoEnvio] = useState(false);

  const { placa } = useParams();
  const navigate = useNavigate();

  // *** Usar el hook corregido ***
  const usuarioLogueado = useUsuarioLogueado();

  // --- Efecto para cargar datos del equipo y pre-llenar PLACA y RESPONSABLE ---
  useEffect(() => {
    const inicializarFormulario = async () => {
      setCargandoInicial(true);
      setError("");

      let placaEnEstado = ""; // Para guardar la placa obtenida
      let responsableInicial = ""; // Para guardar el responsable inicial

      // 1. Si la placa viene en la URL, intentar cargar el equipo
      if (placa) {
        try {
          const datosEquipo = await equiposService.getById(placa);
          placaEnEstado = datosEquipo.placa; // Obtener la placa de los datos cargados
        } catch (err) {
          const errorMessage =
            err.message || "Error desconocido al cargar equipo.";
          setError(
            `Error cargando datos del equipo con placa ${placa}: ` +
              errorMessage
          );
          console.error("Error cargando equipo:", err);
          // Opcional: Redirigir si el equipo no existe
          // toast.error(`Equipo con placa ${placa} no encontrado.`);
          // navigate('/gestionar-equipos');
        }
      } else {
        // Si no hay placa en la URL (no debería pasar con la ruta correcta)
        setError("Placa de equipo no proporcionada en la URL.");
        console.warn("Página de baja accedida sin placa en URL.");
      }


      if (usuarioLogueado && usuarioLogueado.nombreCompleto) {
        // Asumiendo que el objeto usuario tiene 'nombreCompleto'
        responsableInicial = usuarioLogueado.nombreCompleto;
      } else {

        responsableInicial = "Invitado"; // O simplemente "", o dejarlo vacío
       
      }

      // 3. Pre-llenar el estado del formulario
      setFormulario((prevFormulario) => ({
        ...prevFormulario,
        placa: placaEnEstado, // Pre-llenar placa (vacía si hubo error/no URL)
        ubicacion: "", // Ubicación siempre vacía para que el usuario la seleccione
        responsable: responsableInicial, // Pre-llenar responsable
      }));

      setCargandoInicial(false); // Desactivar carga inicial
    };

    // Ejecutar la inicialización
    inicializarFormulario();
  }, [placa, navigate, usuarioLogueado]); // *** Dependencia: usuarioLogueado (objeto completo) ***

  // --- Manejar el cambio en cualquier campo ---
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: value,
    }));
  };

  // --- Manejar el envío del formulario ---
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");
    setCargandoEnvio(true);

    // --- Validaciones (usando el estado actual del formulario) ---
    if (!formulario.placa) {
      setError("El campo Placa es requerido.");
      setCargandoEnvio(false);
      toast.error("El campo Placa es requerido.");
      return;
    }
    if (!formulario.ubicacion) {
      // Validar que se seleccionó una ubicación
      setError("La Ubicación es requerida.");
      setCargandoEnvio(false);
      toast.error("La Ubicación es requerida.");
      return;
    }
    if (!formulario.responsable) {
      // Validar que el responsable no esté vacío (pre-llenado o modificado)
      setError("El Responsable es requerido.");
      setCargandoEnvio(false);
      toast.error("El Responsable es requerido.");
      return;
    }

    // --- Preparar datos para enviar ---
    const datosParaBaja = {
      placa: formulario.placa, // Usar la placa del formulario
      estado: "Baja",
      ubicacion_baja: formulario.ubicacion, // Valor del select de ubicación
      responsable_baja: formulario.responsable, // Valor del campo responsable (pre-llenado)
      fecha_baja: new Date().toISOString(),
    };

    try {
      await equiposService.update(formulario.placa, datosParaBaja);

      toast.success(
        `Equipo con placa ${formulario.placa} dado de baja exitosamente.`
      );
      navigate("/gestionar-equipos");
    } catch (err) {
      const errorMessage =
        err.message || "Error desconocido al dar de baja equipo.";
      setError(`Error al dar de baja equipo: ${errorMessage}`);
      console.error("Error dando de baja equipo:", err);
      toast.error(`Error al dar de baja: ${errorMessage}`);
    } finally {
      setCargandoEnvio(false);
    }
  };

  // --- JSX: Mostrar estado de carga inicial o el formulario ---
  if (cargandoInicial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando datos del equipo {placa ? `con placa ${placa}` : ""}...</p>
      </div>
    );
  }

  // Si hubo un error de carga inicial Y el formulario no tiene placa (no se cargó nada)
  // Opcional: Si quieres forzar que siempre haya placa de la URL, puedes verificar !placa aquí también
  if (error && formulario?.placa === "") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>{error}</p>
        {/* Enlace para volver si hay error de carga */}
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

  // Si el formulario tiene datos (al menos la placa pre-llenada) y no hay error de carga principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10">
          <Card
            title="Dar de Baja a un Equipo"
            subTitle={
              <p className="text-gray-600 text-sm">Placa: {formulario.placa}</p>
            }
            className="w-full md:w-30rem"
            style={{
              width: "350px",
              borderRadius: "5px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              fontFamily: "'Times New Roman', Times, serif",
            }}
          >
            {/* Mostrar errores de validación/envío dentro del Card si el formulario está cargado */}
            {error && formulario?.placa !== "" && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={manejarEnvio}>
              {/* Campo Placa (Pre-llenado y Deshabilitado) */}
              <Entrada
                placeHolder="Placa del Equipo"
                tipo="text"
                name="placa"
                valor={formulario.placa}
                required={true}
                manejarCambio={manejarCambio}
                icono={<FiTag className="text-gray-400" />}
                label="Placa:"
                disabled={true} // Campo deshabilitado
              />

              {/* --- Campo Ubicación (Select) --- */}
              <div className="campo">
                
                <select
                  id="ubicacion"
                  name="ubicacion"
                  value={formulario.ubicacion}
                  onChange={manejarCambio}
                  required={true} // HTML required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {/* Mapear las opciones de DatosUbicacion */}
                  {/* Asumimos DatosUbicacion[0] es la opción por defecto { value: "", label: "Seleccionar ubicación" } */}
                  {DatosUbicacion.map((ubicacionOpcion) => (
                    <option
                      key={ubicacionOpcion.value}
                      value={ubicacionOpcion.value}
                    >
                      {ubicacionOpcion.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo Responsable (Pre-llenado y Editable) */}
              <Entrada
                placeHolder="Responsable"
                tipo="text"
                name="responsable"
                valor={formulario.responsable} // Valor pre-llenado
                required={true} // Validamos que sea requerido
                manejarCambio={manejarCambio} // Permite al usuario modificar si es necesario
                icono={<FiUser className="text-gray-400" />}
                label="Responsable:"
                // Opcional: deshabilitar si no quieres que el usuario cambie el responsable
                // disabled={true}
              />

              {/* --- Botón para Dar de Baja --- */}
              <Boton tipo="submit" disabled={cargandoEnvio}>
                {cargandoEnvio ? "Procesando..." : "Dar de Baja"}
              </Boton>

              {/* --- Enlace para Cancelar --- */}
              <div className="text-center text-sm text-gray-600">
                <Link
                  to="/gestionar-equipos"
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
