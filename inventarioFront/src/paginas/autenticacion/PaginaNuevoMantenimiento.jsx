import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import Entrada from "../../componentes/InterfazUsuario/Entrada.jsx";
import Boton from "../../componentes/InterfazUsuario/Boton.jsx";
import { Card } from "primereact/card";
import { FiTag, FiUser, FiCalendar } from "react-icons/fi";
import { DatosTipoMantenimiento } from "../../componentes/Datos/DatosTipoMantenimiento.jsx";
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";

import { mockMantenimientoService as mantenimientosService } from "../../servicios/mockMantenimientos.api.js";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useUsuarioLogueado } from "../../autenticacion/contexto/UsuarioLogueado.jsx";

export default function PaginaNuevoMantenimiento() {
  const [formulario, setFormulario] = useState({
    placa: "",
    tipoMantenimiento: "",
    fechaProgramada: "",
    tecnico: "",
  });

  const [error, setError] = useState("");
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [cargandoEnvio, setCargandoEnvio] = useState(false);

  const [datosEquipoCargado, setDatosEquipoCargado] = useState(null);

  const { placa } = useParams();
  const navigate = useNavigate();

  const usuarioLogueado = useUsuarioLogueado();

  useEffect(() => {
    const inicializarFormulario = async () => {
      setCargandoInicial(true);
      setError("");

      let placaCargada = "";
      let tecnicoInicial = "";
      let equipoData = null;

      if (placa) {
        try {
          equipoData = await equiposService.getById(placa);
          placaCargada = equipoData.placa;
          setDatosEquipoCargado(equipoData);
        } catch (err) {
          const errorMessage =
            err.message || "Error desconocido al cargar equipo.";
          setError(
            `Error cargando datos del equipo con placa ${placa}: ` +
              errorMessage
          );
          console.error("Error cargando equipo:", err);

          // setDatosEquipoCargado(null); En caso de que no haya datos, revisar, de que no haya datos de equipo si falla
        }
      } else {
        setError("Placa de equipo no proporcionada en la URL.");
        console.warn(
          "Página de nuevo mantenimiento accedida sin placa en URL."
        );

        navigate("/gestion-equipos");
      }

      if (usuarioLogueado && usuarioLogueado.nombreCompleto) {
        tecnicoInicial = usuarioLogueado.nombreCompleto;
      } else {
        tecnicoInicial = "Desconocido";
        toast.warn("Debes iniciar sesión para programar mantenimiento.");
        navigate("/login");
      }

      setFormulario((prevFormulario) => ({
        ...prevFormulario,
        placa: placaCargada,
        tecnico: tecnicoInicial,
        fechaProgramada: new Date().toISOString().split("T")[0],
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
      setError("Error: Placa del equipo no cargada."); 
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


    const datosParaMantenimiento = {
   
      equipoPlaca: formulario.placa,
      tipo: formulario.tipoMantenimiento,
      fechaProgramada: formulario.fechaProgramada,
      tecnico: formulario.tecnico,
      fechaRealizacion: null,
      estado: "Programado",
    
      ubicacion: datosEquipoCargado?.ubicacion || formulario.ubicacion || "", 
      responsable: datosEquipoCargado?.responsable || "", 
  
    };

    try {
   
      await mantenimientosService.create(datosParaMantenimiento);

   
      toast.success(
        `Mantenimiento programado para placa ${formulario.placa} el ${formulario.fechaProgramada}.`
      );

 
      navigate("/programados"); 
    } catch (err) {
  
      const errorMessage =
        err.message || "Error desconocido al programar mantenimiento.";
      setError(`Error al programar mantenimiento: ${errorMessage}`);
      console.error("Error programando mantenimiento:", err);
      toast.error(`Error al programar: ${errorMessage}`);
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


  if (error || !datosEquipoCargado) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>
          {error ||
            `No se encontraron datos para el equipo con placa ${placa}.`}
        </p>
    
        <div className="text-center text-sm text-gray-600 mt-4">
          <Link
            to="/gestion-equipos"
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
          
            title="Nuevo Mantenimiento"
            subTitle={
              <p className="text-gray-600 text-sm">
                Placa: {datosEquipoCargado.placa} | Tipo:{" "}
                {datosEquipoCargado.tipoEquipo}
              </p>
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

            {error && ( 
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={manejarEnvio}>
          
              <div className="campo">
                <label className="block text-sm font-medium text-gray-700">
                  Placa:
                </label>
                <p className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                  {datosEquipoCargado.placa}
                </p>
              
              </div>

            
              <div className="campo">
                <label
                  htmlFor="tipoMantenimiento"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tipo de Mantenimiento:
                  {!formulario.tipoMantenimiento && (
                    <span className="text-red-500"> *</span>
                  )}{" "}
               
                </label>
                <select
                  id="tipoMantenimiento"
                  name="tipoMantenimiento"
                  value={formulario.tipoMantenimiento}
                  onChange={manejarCambio}
                  required={true} 
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                {DatosTipoMantenimiento.map((tipoOpcion) => (
                    <option key={tipoOpcion.value} value={tipoOpcion.value}>
                      {tipoOpcion.label}
                    </option>
                  ))}
                </select>
              
              </div>

    
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

            
              <Entrada
                placeHolder="Técnico Asignado"
                tipo="text"
                name="tecnico"
                valor={formulario.tecnico} 
                required={true}
                manejarCambio={manejarCambio} 
                icono={<FiUser className="text-gray-400" />}
                label="Técnico:"
          
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
