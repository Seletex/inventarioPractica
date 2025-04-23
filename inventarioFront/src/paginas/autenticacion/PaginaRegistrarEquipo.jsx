import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from 'primereact/card';
import Boton from "../../componentes/InterfazUsuario/Boton.jsx";
import Entrada from "../../componentes/InterfazUsuario/Entrada.jsx";


import { Icono } from "../../componentes/utiles/Icono.jsx";
import { camposFormularioEquipo } from "../../componentes/Datos/CrearEquipos.jsx";
import { obtenerFechaActual } from "../../componentes/utiles/FechaActual.jsx";
import { marcasPorTipoEquipo } from "../../componentes/Datos/MarcasTipoEquipo.jsx";
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";
import { estadoinicial } from "../../componentes/utiles/EstadoInicial.jsx";

export default function PaginaRegistrarEquipos() {
  // Estado inicial del formulario basado en la configuración

  const [formulario, setFormulario] = useState(estadoinicial);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // Marcas disponibles basadas en el tipo seleccionado
  const marcasDisponibles = useMemo(() => {
    const tipoSeleccionado = formulario.tipoEquipo;
    const marcas = marcasPorTipoEquipo[tipoSeleccionado];
    // Incluir siempre la opción por defecto si los datos originales no la tienen,
    // o asegurar que los arrays de datos *sí* la incluyan.
    return marcas && marcas.length > 0
      ? marcas
      : [{ value: "", label: "Seleccionar Marca" }]; // Asegurar opción por defecto
  }, [formulario.tipoEquipo]);

  // Manejar el cambio en cualquier campo
  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormulario((prevFormulario) => {
      if (name === "tipoEquipo") {
        return { ...prevFormulario, [name]: newValue, marca: "" };
      } else {
        return { ...prevFormulario, [name]: newValue };
      }
    });
  };

  // Manejar envío del formulario
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    // Validaciones dinámicas
    let valid = true;
    const errores = [];
    // Iterar sobre camposFormularioEquipo para validar
    camposFormularioEquipo.forEach((campo) => {
      if (campo.required) {
        const valor = formulario[campo.name];
        // Lógica de validación ajustada para diferentes tipos
        if (campo.type === "select") {
          // Para selects, validar que el valor no sea la cadena vacía ("") de la opción por defecto
          if (valor === null || valor === undefined || valor === "") {
            valid = false;
            errores.push(`${campo.label} es requerido.`);
          }
        }else {
          // text, number, date, etc.
          if (valor === null || valor === undefined || valor === "") {
            valid = false;
            errores.push(`${campo.label} es requerido.`);
          }
        }
      }
    });

    // Validación específica para la marca si el tipo está seleccionado y hay opciones de marca (sin la opción por defecto)
    const hasRealMarcaOptions = marcasDisponibles.some(
      (opt) => opt.value !== ""
    );
    if (formulario.tipoEquipo && hasRealMarcaOptions && !formulario.marca) {
      valid = false;
      errores.push("Debes seleccionar una Marca válida.");
    }

    if (!valid) {
      // Mostrar errores acumulados
      setError(errores.join(" "));
      setCargando(false);
      return;
    }
    const datosParaEnviar = {
      ...formulario,
      obtenerFechaActual: obtenerFechaActual(), // Fecha actual en formato YYYY-MM-DD
      fecha_adquisicion: formulario.fecha_adquisicion || obtenerFechaActual(), // Si no se proporciona, usar la fecha actual
    };

    try {
      await equiposService.create(datosParaEnviar);
      alert("Equipo registrado exitosamente!"); // Considera Toast
      setFormulario(estadoinicial); // Limpiar
    } catch (err) {
      setError("Error al registrar el equipo: " + err.message);
      console.error("Error al registrar equipo:", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10">
          

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        <Card  title="Registrar Nuevo Equipo"
                className="w-full md:w-30rem"
                style={{
                    width: '400px', // Ajusta el ancho de la tarjeta según necesites
                    borderRadius: '10px',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    fontFamily: "'Times New Roman', Times, serif",
                }}>
          <form className="space-y-6" onSubmit={manejarEnvio}>
            {/* Renderizar campos dinámicamente */}
            {camposFormularioEquipo.map((campo) => {
              const valorCampo = formulario[campo.name];

              // Omitir renderizado si el campo es undefined o null en la config
              if (!campo) return null;

              // Contenedor para cada campo (usa flex para alinear label e input/select/checkbox)
              return (
                <div className="campo" key={campo.name}>
                  {" "}
                  {/* Considera añadir flexbox aquí si quieres label al lado */}
                  {campo.label && ( // Renderiza si la config tiene 'label'
                    <label
                      htmlFor={campo.name}
                      className={`block text-sm font-medium text-gray-700 ${
                        campo.type !== "boolean"
                          ? "mb-1"
                          : "ml-2 cursor-pointer"
                      }`} // Ajusta margen o alineación si es checkbox
                    >
                      {campo.label}
                      {campo.required && (
                        <span className="text-red-500"> *</span>
                      )}{" "}
                      {/* Indicador de requerido */}
                    </label>
                  )}
                  {(() => {
                    switch (campo.type) {
                      case "text":
                      case "number":
                      case "date": {
                        return (
                          <Entrada
                            placeHolder={campo.placeHolder || campo.label} // Usar placeholder, si no existe, usar el label
                            tipo={campo.type}
                            nombre={campo.name}
                            valor={valorCampo || ""}
                            required={campo.required}
                            manejarCambio={manejarCambio}
                            icono={
                              campo.icon ? <Icono nombre={campo.icon} /> : null
                            }
                            // Si tu componente Entrada puede tomar un label y renderizarlo DENTRO del input (como algunos diseños modernos), pásalo aquí:
                            // label={campo.label}
                          />
                        );
                      }

                      case "select": {
                        let opcionesSelect = campo.options;
                        // Usar marcas disponibles para el selector 'marca'
                        if (campo.name === "marca") {
                          opcionesSelect = marcasDisponibles;
                        }
                        // Asegurar que la primera opción sea el placeholder si no viene en los datos
                        const finalOptions =
                          opcionesSelect.length > 0 &&
                          opcionesSelect[0].value === ""
                            ? opcionesSelect // Los datos ya incluyen el placeholder
                            : [
                                {
                                  value: "",
                                  label: `Seleccionar ${campo.label.replace(
                                    ":",
                                    ""
                                  )}`,
                                },
                                ...opcionesSelect,
                              ]; // Añadir placeholder

                        return (
                          <select
                            style={{ width: "100%", textAlign: "center" }}
                            id={campo.name}
                            name={campo.name}
                            value={valorCampo || ""}
                            onChange={manejarCambio}
                            required={campo.required}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            disabled={
                              campo.name === "marca" && !formulario.tipoEquipo
                            }
                          >
                            {/* Iterar sobre las opciones (ahora con placeholder incluido si fue necesario) */}
                            {finalOptions.map((opcion) => (
                              // Asegúrate de que los value sean únicos para la key
                              <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                              </option>
                            ))}
                          </select>
                        );
                      }

                      case "boolean": {
                        // Para checkbox, el label se renderiza arriba por la lógica común,
                        // pero el input y el label "texto" del checkbox están juntos aquí
                        // Si quieres el label del checkbox SIEMPRE al lado, elimina el renderizado de label arriba para tipo boolean
                        return (
                          <div className="flex items-center mt-1">
                            {" "}
                            {/* Añadir margen superior y flex para checkbox+label */}
                            <Entrada
                              style={{
                                width: "100%",
                                textAlign: "center",
                                fontSize: "1.2rem",
                              }}
                              type="checkbox"
                              id={campo.name}
                              name={campo.name}
                              checked={valorCampo === true}
                              onChange={manejarCambio}
                              required={campo.required}
                              className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" // Añade estilos básicos de checkbox
                            />
                            {/* campo.label && ( // Si quieres el label al lado del checkbox
                                                            <label htmlFor={campo.name} className="text-sm font-medium text-gray-700 cursor-pointer">
                                                                {campo.label}
                                                                {campo.required && <span className="text-red-500"> *</span>}
                                                            </label>
                                                          )*/}
                          </div>
                        );
                      }

                      default:
                        return null;
                    }
                  })()}
                </div>
              );
            })}

            <Boton tipo="submit" disabled={cargando}>
              {cargando ? "Registrando..." : "Registrar Equipo"}
            </Boton>

            <div
              className="text-center text-sm text-gray-600"
              style={{ width: "100%", textAlign: "center", fontSize: "1.2rem" }}
            >
              <Link
                to="/gestionar-equipos"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Volver a la gestión de equipos
              </Link>
            </div>
          </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
