import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Entrada from "../../componentes/InterfazUsuario/Entrada.jsx";

import { Card } from "primereact/card";
import { Icono } from "../../componentes/utiles/Icono.jsx";
import { camposFormularioEquipo } from "../../componentes/Datos/ActualizarEquipo.jsx";

import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";

export default function PaginaActualizarEquipos() {
  const { placa } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState(null);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [error, setError] = useState("");
  const [cargandoEnvio, setCargandoEnvio] = useState(false);

  useEffect(() => {
    const cargarEquipo = async () => {
      setCargandoInicial(true);
      setError("");
      try {
        const datosEquipo = await equiposService.getById(placa);
        console.log("Datos del equipo:", datosEquipo);
        console.log("Placa en los parámetros:", placa);

        setFormulario(datosEquipo);
      } catch (err) {
        setError(
          `Error cargando datos del equipo con placa ${placa}: ` + err.message
        );

        console.error("Error cargando equipo:", err);
      } finally {
        setCargandoInicial(false);
      }
    };

    if (placa) {
      cargarEquipo();
      console.log("Placa en los parámetros:", placa);
    } else {
      setError("Placa de equipo no proporcionada.");
      setCargandoInicial(false);
    }
  }, [placa, setError]);

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
        return;
      }

      if (["marca"].includes(campo.name)) {
        return;
      }

      if (campo.required) {
        const valor = formulario[campo.name];
        if (valor === null || valor === undefined || valor === "") {
          valid = false;
          errores.push(`${campo.label} es requerido.`);
        }
      }
    });

    if (!valid) {
      setError(errores.join(" "));
      setCargandoEnvio(false);
      return;
    }

    const datosParaEnviar = { ...formulario };
    ["garantia", "teclado", "mouse", "entregado"].forEach((fieldName) => {
      const valorString = formulario[fieldName];
      if (valorString !== null && valorString !== undefined) {
        datosParaEnviar[fieldName] = valorString === "true";
      }
    });

    try {
      await equiposService.update(placa, datosParaEnviar);

      alert("Equipo actualizado exitosamente!");
      navigate("/gestionar-equipos");
    } catch (err) {
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
            subTitle=<p className="text-gray-600 text-sm">
              Placa: {formulario?.placa || placa}
            </p>
            className="w-full md:w-30rem"
            style={{
              width: "350px",
              borderRadius: "5px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              fontFamily: "'Times New Roman', Times, serif",
            }}
          >
            <form className="space-y-6" onSubmit={manejarEnvio}>
              {camposFormularioEquipo
                .filter((campo) => !["placa", "marca"].includes(campo.name))
                .map((campo) => {
                  if (!formulario) return null;

                  const valorCampo = formulario[campo.name];

                  if (!campo) return null;

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
                                value={
                                  valorCampo === null ||
                                  valorCampo === undefined
                                    ? ""
                                    : valorCampo
                                }
                                onChange={manejarCambio}
                                required={campo.required}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                              >
                                {finalOptions.map((opcion) => (
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
