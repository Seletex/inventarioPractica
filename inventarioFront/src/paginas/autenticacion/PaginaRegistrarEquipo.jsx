import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import Boton from "../../componentes/InterfazUsuario/Boton.jsx";
import Entrada from "../../componentes/InterfazUsuario/Entrada.jsx";

import { Icono } from "../../componentes/utiles/Icono.jsx";
import { camposFormularioEquipo } from "../../componentes/Datos/CrearEquipos.jsx";
import { obtenerFechaActual } from "../../componentes/utiles/FechaActual.jsx";
import { marcasPorTipoEquipo } from "../../componentes/Datos/MarcasTipoEquipo.jsx";
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";
import { estadoinicial } from "../../componentes/utiles/EstadoInicial.jsx";

export default function PaginaRegistrarEquipos() {
  // Asegúrate que estadoinicial incluya los nuevos campos y placa sea opcional
  const estadoInicialFormulario = {
    ...estadoinicial, // Asume que estadoinicial ya tiene los campos base
    serial: "", // Obligatorio
    nombreDelEquipo: "",
    ip: "",
    placa: "", // Opcional
  };
  const [formulario, setFormulario] = useState(estadoInicialFormulario);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const marcasDisponibles = useMemo(() => {
    const tipoSeleccionado = formulario.tipoEquipo;
    const marcas = marcasPorTipoEquipo[tipoSeleccionado];
    return marcas && marcas.length > 0
      ? marcas
      : [{ value: "", label: "Seleccionar Marca" }];
  }, [formulario.tipoEquipo]);

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

  async function manejarEnvio(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    let valid = true;
    const errores = [];

    // Validar serial específicamente si es el identificador principal
    if (!formulario.serial || formulario.serial.trim() === "") {
      valid = false;
      errores.push("El campo Serial es requerido.");
    }

    camposFormularioEquipo.forEach((campo) => {
      if (campo.required) {
        const valor = formulario[campo.name];

        if (valor === null || valor === undefined || valor === "") {
          valid = false;
          errores.push(`${campo.label} es requerido.`);
        }
      } else if (
        campo.name === "placa" &&
        formulario.placa &&
        formulario.placa.trim() === ""
      ) {
        // Si la placa tiene un valor pero es solo espacios, considerarlo vacío para no enviar
        // formulario.placa = ""; // Opcional: limpiar si solo son espacios
      }
    });

    const hasRealMarcaOptions = marcasDisponibles.some(
      (opt) => opt.value !== ""
    );
    if (formulario.tipoEquipo && hasRealMarcaOptions && !formulario.marca) {
      valid = false;
      errores.push("Debes seleccionar una Marca válida.");
    }

    if (!valid) {
      setError(errores.join(" "));
      setCargando(false);
      return;
    }

    const datosParaEnviar = {
      ...formulario,
      // Considera si 'obtenerFechaActual' es un campo que el backend espera,
      // o si solo necesitas 'fecha_adquisicion'.
      // Si 'fecha_adquisicion' puede ser nula y quieres la fecha actual por defecto:
      fecha_adquisicion: formulario.fecha_adquisicion || obtenerFechaActual(),
      // Si necesitas una fecha de registro separada:
      // fecha_registro: obtenerFechaActual(),
    };

    try {
      await equiposService.create(datosParaEnviar);
      alert("Equipo registrado exitosamente!");
      setFormulario(estadoInicialFormulario);
    } catch (err) {
      setError("Error al registrar el equipo: " + err.message);
      console.error("Error al registrar equipo:", err);
    } finally {
      setCargando(false);
    }
  } // Cierre de la función manejarEnvio

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <Card
            title="Registrar Nuevo Equipo"
            className="w-full md:w-30rem"
            style={{
              width: "400px",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              fontFamily: "'Times New Roman', Times, serif",
            }}
          >
            <form className="space-y-6" onSubmit={manejarEnvio}>
              {camposFormularioEquipo.map((campo) => {
                const valorCampo = formulario[campo.name];

                if (!campo) return null;

                return (
                  <div className="campo" key={campo.name}>
                    {" "}
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
                        {campo.required && (
                          <span className="text-red-500"> *</span>
                        )}{" "}
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
                              valor={valorCampo || ""}
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

                          if (campo.name === "marca") {
                            opcionesSelect = marcasDisponibles;
                          }

                          const finalOptions =
                            opcionesSelect.length > 0 &&
                            opcionesSelect[0].value === ""
                              ? opcionesSelect
                              : [
                                  {
                                    value: "",
                                    label: `Seleccionar ${campo.label.replace(
                                      ":",
                                      ""
                                    )}`,
                                  },
                                  ...opcionesSelect,
                                ];

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
                                campo.name === "marca" &&
                                !formulario.tipoEquipo
                              }
                            >
                              {finalOptions.map((opcion) => (
                                <option key={opcion.value} value={opcion.value}>
                                  {opcion.label}
                                </option>
                              ))}
                            </select>
                          );
                        }

                        case "boolean": {
                          return (
                            <div className="flex items-center mt-1">
                              {" "}
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
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "1.2rem",
                }}
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
