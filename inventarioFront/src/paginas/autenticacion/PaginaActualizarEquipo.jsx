import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Entrada from "../../componentes/InterfazUsuario/Entrada";

import { Card } from "primereact/card";
import { Icono } from "../../componentes/utiles/Icono.jsx";
import { camposFormularioEquipo } from "../../componentes/Datos/ActualizarEquipo.jsx";
// import { marcasPorTipoEquipo } from "../../componentes/Datos/MarcasTipoEquipo.jsx";
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";

export default function PaginaActualizarEquipos() {
  // *** CAMBIO AQUÍ: Obtener la PLACA de los parámetros de la URL ***
  const { placa } = useParams(); // <-- Desestructurar 'placa'
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState(null);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [error, setError] = useState("");
  const [cargandoEnvio, setCargandoEnvio] = useState(false);

  // --- Efecto para cargar los datos del equipo al montar el componente o cambiar la PLACA ---
  useEffect(() => {
    const cargarEquipo = async () => {
      setCargandoInicial(true);
      setError("");

      try {
        // *** CAMBIO AQUÍ: Llamar al servicio usando la PLACA ***
        // Asume que tu servicio 'getById' realmente busca por placa
        const datosEquipo = await equiposService.getById(placa);
        console.log("Datos del equipo:", datosEquipo);
        console.log("Placa en los parámetros:", placa);
        // Establecer los datos cargados en el estado del formulario
        setFormulario(datosEquipo);
      } catch (err) {
        // Ajustar el mensaje de error
        setError(
          `Error cargando datos del equipo con placa ${placa}: ` + err.message
        );

        console.error("Error cargando equipo:", err);
      } finally {
        setCargandoInicial(false);
      }
    };

    // *** CAMBIO AQUÍ: Solo cargar si tenemos una PLACA válida ***
    if (placa) {
      cargarEquipo();
      console.log("Placa en los parámetros:", placa);
    } else {
      // Manejar el caso si no hay PLACA en la URL
      setError("Placa de equipo no proporcionada.");
      setCargandoInicial(false);
    }
  }, [placa, setError]); // *** CAMBIO AQUÍ: Dependencia es PLACA ***
  //}, [placa, setError, equiposService]);

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormulario((prevFormulario) => {
      if (!prevFormulario) return null;

      return {
        ...prevFormulario,
        [name]: newValue,
      };
    });
  };

  // --- Manejar envío del formulario para ACTUALIZAR ---
  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");
    setCargandoEnvio(true);

    if (!formulario) {
      setError("Datos del formulario no cargados.");
      setCargandoEnvio(false);
      return;
    }

    let valid = true;
    const errores = [];
    camposFormularioEquipo.forEach((campo) => {
      if (["placa"].includes(campo.name)) {
        // Omitir validación de 'placa' si no es editable
        return;
      }
      // Asumiendo que la marca no es editable y por lo tanto no se valida su 'required' aquí
      if (["marca"].includes(campo.name)) {
        return;
      }

      if (campo.required) {
        const valor = formulario[campo.name];
        if (campo.type === "select") {
          if (valor === null || valor === undefined || valor === "") {
            valid = false;
            errores.push(`${campo.label} es requerido.`);
          }
        } else {
          // text, number, date
          if (valor === null || valor === undefined || valor === "") {
            valid = false;
            errores.push(`${campo.label} es requerido.`);
          }
        }
      }
    });

    if (!valid) {
      setError(errores.join(" "));
      setCargandoEnvio(false);
      return;
    }

    // --- Preparar datos antes de enviar (conversión de strings "true"/"false") ---
    const datosParaEnviar = { ...formulario };
    ["garantia", "teclado", "mouse", "entregado"].forEach((fieldName) => {
      const valorString = formulario[fieldName];
      if (valorString !== null && valorString !== undefined) {
        datosParaEnviar[fieldName] = valorString === "true";
      }
    });

    // Si el 'formulario' ya tiene la placa cargada, esto está bien.
    // Si no,  añadirla explícitamente: datosParaEnviar.placa = placa;

    try {
      await equiposService.update(placa, datosParaEnviar); // <-- Pasar PLACA y datos
      // Mostrar mensaje de éxito y NAVEGAR de vuelta
      alert("Equipo actualizado exitosamente!"); // Considera Toast
      navigate("/gestionar-equipos"); // Redirigir a la lista
    } catch (err) {
      // Mostrar mensaje de error
      setError("Error al actualizar el equipo: " + err.message);
      console.error("Error al actualizar equipo:", err);
    } finally {
      setCargandoEnvio(false);
    }
  };
  if (cargandoInicial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando datos del equipo con placa {placa}...</p>{" "}
        {/* Mostrar la placa en el mensaje */}
      </div>
    );
  }

  if (error && !formulario) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }
  // Si no está cargando inicialmente y hay datos en el formulario, renderiza el formulario
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10">
                    {/* Mostrar errores de carga O de envío */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <Card
            title="Actualizar Equipo"
            subTitle=<p className="text-gray-600 text-sm">Placa: {formulario?.placa || placa}</p>
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
              {camposFormularioEquipo
                .filter((campo) => !["placa", "marca"].includes(campo.name)) // Filtrar placa y marca
                .map((campo) => {
                  if (!formulario) return null; // Seguridad

                  const valorCampo = formulario[campo.name];

                  if (!campo) return null; // Seguridad

                  // Contenedor para cada campo
                  return (
                    <div className="campo" key={campo.name}>
                      {campo.label && (
                        <label
                          htmlFor={campo.name}
                          className={`block text-sm font-medium text-gray-700 ${
                            campo.type !== "boolean"
                              ? "mb-1"
                              : "ml-2 cursor-pointer"
                          }`}
                        >
                          {campo.label}
                          {/* Mostrar * solo si el campo es requerido Y ES EDITABLE */}
                          {campo.required &&
                            !["placa", "marca"].includes(campo.name) && (
                              <span className="text-red-500"> *</span>
                            )}
                        </label>
                      )}

                      {(() => {
                        switch (campo.type) {
                          case "text":
                          case "number":
                          case "date": {
                            return (
                              <Entrada
                                placeHolder={campo.placeHolder || campo.label}
                                tipo={campo.type}
                                nombre={campo.name}
                                // Usar valorCampo del estado, asegurar string vacío si es null/undefined
                                valor={
                                  valorCampo === null ||
                                  valorCampo === undefined
                                    ? ""
                                    : valorCampo
                                }
                                required={campo.required}
                                manejarCambio={manejarCambio}
                                icono={
                                  campo.icon ? (
                                    <Icono nombre={campo.icon} />
                                  ) : null
                                }
                              />
                            );
                          }

                          case "select": {
                            let opcionesSelect = campo.options;

                            // Si decides MOSTRAR la marca como un select deshabilitado, necesitarías cargar sus opciones aquí.
                            // if (campo.name === 'marca') { opcionesSelect = tusOpcionesDeMarcaCargadas; }
                            const finalOptions =
                              opcionesSelect?.length > 0 &&
                              opcionesSelect[0]?.value === ""
                                ? opcionesSelect
                                : [
                                    {
                                      value: "",
                                      label: `Seleccionar ${
                                        campo.label?.replace(":", "") || ""
                                      }`,
                                    },
                                    ...(opcionesSelect || []),
                                  ];

                            return (
                              <select
                                id={campo.name}
                                name={campo.name}
                                // Usar valorCampo del estado, asegurar string vacío si es null/undefined
                                value={
                                  valorCampo === null ||
                                  valorCampo === undefined
                                    ? ""
                                    : valorCampo
                                }
                                onChange={manejarCambio}
                                required={campo.required}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                // *** Deshabilitar el selector si no es editable ***
                                // disabled={campo.name === 'tipoEquipo'} // Ejemplo: hacer tipo no editable
                              >
                                {finalOptions.map((opcion) => (
                                  // Asegúrate de que los value sean únicos
                                  <option
                                    key={opcion.value}
                                    value={opcion.value}
                                  >
                                    {opcion.label}
                                  </option>
                                ))}
                              </select>
                            );
                          }

                          default:
                            return null;
                        }
                      })()}
                    </div>
                  );
                })}

              {/* Botón de envío */}
              <button
                tipo="submit"
                disabled={cargandoEnvio}
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "1.2rem",
                }}
              >
                {cargandoEnvio ? "Guardando..." : "Actualizar Equipo"}
              </button>

              <div className="text-center text-sm text-gray-600">
                <Link
                  to="/gestionar-equipos"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Cancelar y Volver
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
