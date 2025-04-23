// Archivo: PaginaDarDeBajaEquipo.jsx (Crear este nuevo archivo)

import { useState,useParams } from "react";
import { useNavigate, Link } from "react-router-dom"; // Necesitamos Link para el enlace "Cancelar"
import Entrada from "../../componentes/InterfazUsuario/Entrada";
import Boton from "../../componentes/InterfazUsuario/Boton";
import{Card} from "primereact/card"; 
import { FiTag, FiMapPin, FiUser } from "react-icons/fi"; // Iconos para los campos
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js"; // Asegúrate de la ruta y nombre correctos
import {
  mostrarExitoFn,
  mostrarErrorFn,
} from "../../autenticacion/anzuelos/usoGestionFuncionesUsuario"; // Importar funciones de éxito y error
import {toast} from "react-toastify";

import "react-toastify/dist/ReactToastify.css"; // Import toast styles
export default function PaginaDarDeBajaEquipo() {
  // --- Estado para los campos del formulario ---
  const [formulario, setFormulario] = useState({
    placa: "",
    ubicacion: "", // Asumimos que la ubicación se registra AL dar de baja
    responsable: "", // Asumimos que el responsable se registra AL dar de baja
  });

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const { placa } = useParams();
  const navigate = useNavigate(); // Para redirigir después

  // --- Manejar el cambio en cualquier campo ---
  const manejarCambio = (e) => {
    const { name, value } = e.target; // Solo necesitamos name y value para estos campos
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      [name]: value,
    }));
  };

  // --- Manejar el envío del formulario para DAR DE BAJA ---
  const manejarEnvio = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    setError(""); // Limpiar errores anteriores
    setCargando(true); // Indicar que la operación está en curso

    // --- Validaciones ---
    if (!formulario.placa) {
      setError("El campo Placa es requerido.");
      setCargando(false);
      return;
    }
    if (!formulario.ubicacion) {
      setError("La Ubicación es requerida.");
      setCargando(false);
      return;
    }
    if (!formulario.responsable) {
      setError("El Responsable es requerido.");
      setCargando(false);
      return;
    }
    const datosParaBaja = {
      placa: formulario.placa,
      estado: "Baja", // El nuevo estado fijo
      ubicacion_baja: formulario.ubicacion,
      responsable_baja: formulario.responsable,
      fecha_baja: new Date().toISOString(), // La fecha de baja suele registrarla el backend
    };

    try {
      await equiposService.update(formulario.placa, datosParaBaja); // <-- Pasar PLACA y datosParaBaja

      toast.success(`Equipo ${formulario.placa} dado de baja correctamente`);
      mostrarExitoFn(`Equipo ${formulario.placa} dado de baja correctamente`);
      alert(`Equipo con placa ${formulario.placa} dado de baja exitosamente.`); // O usar Toast
      mostrarExitoFn(
        `Equipo ${formulario.placa} dado de baja correctamente`,
        toast
      );

      // --- Redirigir después de la acción ---
      navigate("/gestionar-equipos"); // Redirigir a la lista después de dar de baja
    } catch (err) {
      setError(`Error al dar de baja equipo: ${err.message}`);
      console.error("Error dando de baja equipo:", err);
      mostrarErrorFn(`Error al dar de baja: ${err.message}`, toast);
    } finally {
      setCargando(false); // Finalizar el estado de carga
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10">
          {/* Mostrar errores */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Card
            title="Actualizar Equipo"
            subTitle=<p className="text-gray-600 text-sm">
              Placa: {formulario?.placa || placa}
            </p>
            className="w-full md:w-30rem"
            style={{
              width: "350px", // Ajusta el ancho de la tarjeta según necesites
              borderRadius: "5px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              fontFamily: "'Times New Roman', Times, serif",
            }}
          >
            <form className="space-y-6" onSubmit={manejarEnvio}>
              {/* Campo Placa */}
              <Entrada
                placeHolder="Placa del Equipo"
                tipo="text"
                name="placa" // Nombre del campo en el estado
                valor={formulario.placa} // Valor del estado
                required={true}
                manejarCambio={manejarCambio} // Función genérica para actualizar estado
                icono={<FiTag className="text-gray-400" />} // Icono
                // Puedes añadir label si quieres la etiqueta arriba, como en el formulario de actualización
                label="Placa:"
              />

              {/* Campo Ubicación (Opcional para registrar al dar de baja) */}
              {/* Si esto es un selector de ubicaciones existentes, necesitarías cargar los datos de ubicaciones */}
              <Entrada
                placeHolder="Ubicación al dar de baja"
                tipo="text" // O 'select' si es un dropdown
                name="ubicacion" // Nombre del campo en el estado
                valor={formulario.ubicacion} // Valor del estado
                required={false} // Ajusta si es requerido
                manejarCambio={manejarCambio}
                icono={<FiMapPin className="text-gray-400" />}
                label="Ubicación:"
              />

              {/* Campo Responsable (Opcional para registrar al dar de baja) */}
              <Entrada
                placeHolder="Responsable al dar de baja"
                tipo="text" // O 'select' si es un dropdown de usuarios/responsables
                name="responsable" // Nombre del campo en el estado
                valor={formulario.responsable} // Valor del estado
                required={false} // Ajusta si es requerido
                manejarCambio={manejarCambio}
                icono={<FiUser className="text-gray-400" />}
                label="Responsable:"
              />

              {/* --- Botón para Dar de Baja --- */}
              {/* El texto del mockup es "Registrar", pero "Dar de Baja" es más claro */}
              <Boton tipo="submit" disabled={cargando}>
                {cargando ? "Procesando..." : "Dar de Baja"}{" "}
                {/* Texto del botón */}
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
