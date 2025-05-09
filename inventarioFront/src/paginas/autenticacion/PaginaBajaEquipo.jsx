import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import Entrada from "../../componentes/InterfazUsuario/Entrada.jsx";
import { Card } from "primereact/card";
import { FiTag, FiUser } from "react-icons/fi";
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";
import { toast } from "react-toastify";
import Boton from "../../componentes/InterfazUsuario/Boton.jsx";
import { DatosUbicacion } from "../../componentes/Datos/DatosUbicaciones.jsx";
import "react-toastify/dist/ReactToastify.css";
import { useUsuarioLogueado } from "../../autenticacion/contexto/UsuarioLogueado.jsx";

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

  const usuarioLogueado = useUsuarioLogueado();

  useEffect(() => {
    const inicializarFormulario = async () => {
      setCargandoInicial(true);
      setError("");

      let placaEnEstado = "";
      let responsableInicial = "";

      if (placa) {
        try {
          const datosEquipo = await equiposService.getById(placa);
          placaEnEstado = datosEquipo.placa;
        } catch (err) {
          const errorMessage =
            err.message || "Error desconocido al cargar equipo.";
          setError(
            `Error cargando datos del equipo con placa ${placa}: ` +
              errorMessage
          );
          console.error("Error cargando equipo:", err);

          toast.error(`Equipo con placa ${placa} no encontrado.`);
          navigate("/gestion-equipo");
        }
      } else {
        setError("Placa de equipo no proporcionada en la URL.");
        console.warn("Página de baja accedida sin placa en URL.");
      }

      if (usuarioLogueado && usuarioLogueado.nombreCompleto) {
        responsableInicial = usuarioLogueado.nombreCompleto;
      } else {
        responsableInicial = "Invitado";
      }

      setFormulario((prevFormulario) => ({
        ...prevFormulario,
        placa: placaEnEstado,
        ubicacion: "",
        responsable: responsableInicial,
      }));

      setCargandoInicial(false);
    };

    inicializarFormulario();
  }, [placa, navigate, usuarioLogueado]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: value,
    }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");
    setCargandoEnvio(true);

    if (!formulario.placa) {
      setError("El campo Placa es requerido.");
      setCargandoEnvio(false);
      toast.error("El campo Placa es requerido.");
      return;
    }
    if (!formulario.ubicacion) {
      setError("La Ubicación es requerida.");
      setCargandoEnvio(false);
      toast.error("La Ubicación es requerida.");
      return;
    }
    if (!formulario.responsable) {
      setError("El Responsable es requerido.");
      setCargandoEnvio(false);
      toast.error("El Responsable es requerido.");
      return;
    }

    const datosParaBaja = {
      placa: formulario.placa,
      estado: "Baja",
      ubicacion_baja: formulario.ubicacion,
      responsable_baja: formulario.responsable,
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

  if (cargandoInicial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando datos del equipo {placa ? `con placa ${placa}` : ""}...</p>
      </div>
    );
  }

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
            {error && formulario?.placa !== "" && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={manejarEnvio}>
              <Entrada
                placeHolder="Placa del Equipo"
                tipo="text"
                name="placa"
                valor={formulario.placa}
                required={true}
                manejarCambio={manejarCambio}
                icono={<FiTag className="text-gray-400" />}
                label="Placa:"
                disabled={true}
              />

              <div className="campo">
                <select
                  id="ubicacion"
                  name="ubicacion"
                  value={formulario.ubicacion}
                  onChange={manejarCambio}
                  required={true}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
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

              <Entrada
                placeHolder="Responsable"
                tipo="text"
                name="responsable"
                valor={formulario.responsable}
                required={true}
                manejarCambio={manejarCambio}
                icono={<FiUser className="text-gray-400" />}
                label="Responsable:"
              />

              <Boton tipo="submit" disabled={cargandoEnvio}>
                {cargandoEnvio ? "Procesando..." : "Dar de Baja"}
              </Boton>

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
