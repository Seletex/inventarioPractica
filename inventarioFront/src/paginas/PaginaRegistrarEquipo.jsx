// Archivo: PaginaRegistrarEquipo.jsx

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Entrada from "../../componentes/InterfazUsuario/Entrada";
import Boton from "../../componentes/InterfazUsuario/Boton";
import * as FiIcons from "react-icons/fi";

// Importar configuración de campos y datos
import { camposFormularioEquipo, marcasPorTipoEquipo,
   //  obtenerFechaActual } 
 } from "../componentes/Datos/formDataEquipos.js"; // Asegúrate de la ruta correcta

// Importar servicio
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js"; // Asegúrate de la ruta correcta


// Componente para renderizar iconos dinámicamente
const Icono = ({ nombre }) => {
    const FeatherIcon = FiIcons[nombre];
    return FeatherIcon ? <FeatherIcon className="text-gray-400" /> : null;
};


export default function PaginaRegistrarEquipos() {
    // Estado inicial construido desde la configuración
    const initialState = useMemo(() => {
        const state = {};
        camposFormularioEquipo.forEach(campo => {
            if (campo.defaultValue !== undefined) {
                 state[campo.name] = campo.defaultValue;
            } else {
                switch (campo.type) {
                    case 'text':
                    case 'number':
                    case 'date':
                    case 'select':
                        state[campo.name] = '';
                        break;
                    case 'boolean':
                        state[campo.name] = false;
                        break;
                    default:
                        state[campo.name] = '';
                }
            }
        });
        return state;
    }, []);

    const [formulario, setFormulario] = useState(initialState);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    // Marcas disponibles basadas en el tipo seleccionado
    const marcasDisponibles = useMemo(() => {
        const tipoSeleccionado = formulario.tipoEquipo;
        const marcas = marcasPorTipoEquipo[tipoSeleccionado];
        return marcas || [];
    }, [formulario.tipoEquipo]);


    // --- Manejar el cambio en cualquier campo (consolidado) ---
    const manejarCambio = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormulario(prevFormulario => {
            // Lógica especial para 'tipoEquipo': resetear 'marca'
            if (name === 'tipoEquipo') {
                return {
                    ...prevFormulario,
                    [name]: newValue, // Actualiza el tipoEquipo
                    marca: "" // Resetea la marca
                };
            } else {
                // Lógica genérica para otros campos
                return {
                    ...prevFormulario,
                    [name]: newValue
                };
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
        camposFormularioEquipo.forEach(campo => {
            if (campo.required) {
                const valor = formulario[campo.name];
                if (campo.type !== 'boolean' && (valor === null || valor === undefined || valor === '')) {
                   valid = false;
                   errores.push(`${campo.label} es requerido.`);
                }
                // Puedes añadir validación para booleanos si es necesario (ej: debe ser true)
                // if (campo.type === 'boolean' && campo.required && valor !== true) { valid = false; errores.push(`${campo.label} debe estar marcado.`); }
            }
        });

        // Validación específica para la marca
        if(formulario.tipoEquipo && marcasDisponibles.length > 0 && !formulario.marca) {
             valid = false;
             errores.push("Debes seleccionar una Marca válida.");
        }

        if (!valid) {
            setError(errores.join(" "));
            setCargando(false);
            return;
        }

        try {
            await equiposService.create(formulario);
            alert("Equipo registrado exitosamente!"); // Considera Toast
            setFormulario(initialState); // Limpiar formulario
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
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Registrar Nuevo Equipo</h2>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={manejarEnvio}>

                        {/* Renderizar campos dinámicamente */}
                        {camposFormularioEquipo.map(campo => {
                            const valorCampo = formulario[campo.name];

                            switch (campo.type) {
                                case 'text':
                                case 'number':
                                case 'date': { // <-- Abre bloque aquí
                                    return (
                                        <Entrada
                                            key={campo.name}
                                            placeHolder={campo.placeHolder}
                                            tipo={campo.type}
                                            nombre={campo.name}
                                            valor={valorCampo || ''}
                                            required={campo.required}
                                            manejarCambio={manejarCambio} // Usar genérica
                                            icono={campo.icon ? <Icono nombre={campo.icon} /> : null}
                                        />
                                    );
                                } // <-- Cierra bloque aquí

                                case 'select': { // <-- Abre bloque aquí
                                     let opcionesSelect = campo.options;
                                     if (campo.name === 'marca') {
                                         opcionesSelect = marcasDisponibles;
                                     }

                                    return (
                                        <div className="campo" key={campo.name}>
                                            <label htmlFor={campo.name} className="block text-sm font-medium text-gray-700 mb-1">{campo.label}</label>
                                            <select
                                                id={campo.name}
                                                name={campo.name}
                                                value={valorCampo || ''}
                                                onChange={manejarCambio} // Usar genérica (la lógica de reset está dentro)
                                                required={campo.required}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                disabled={campo.name === 'marca' && !formulario.tipoEquipo}
                                            >
                                                 <option value="" disabled>
                                                      {campo.name === 'marca' && !formulario.tipoEquipo
                                                          ? "Selecciona Tipo primero"
                                                          : `Seleccionar ${campo.label.replace(':', '')}`
                                                      }
                                                 </option>
                                                {opcionesSelect.map((opcion) => (
                                                  <option key={opcion.value} value={opcion.value}>
                                                    {opcion.label}
                                                  </option>
                                                ))}
                                            </select>
                                        </div>
                                    );
                                } // <-- Cierra bloque aquí

                                case 'boolean': { // <-- Abre bloque aquí
                                    return (
                                         <div className="campo flex items-center" key={campo.name}>
                                             <input
                                                 type="checkbox"
                                                 id={campo.name}
                                                 name={campo.name}
                                                 checked={valorCampo === true}
                                                 onChange={manejarCambio}
                                                 required={campo.required}
                                                 className="mr-2"
                                             />
                                             <label htmlFor={campo.name} className="text-sm font-medium text-gray-700">{campo.label}</label>
                                         </div>
                                    );
                                } // <-- Cierra bloque aquí

                                default:
                                    return <p key={campo.name}>Tipo de campo desconocido: {campo.type}</p>;
                            }
                        })}


                        <Boton tipo="submit" disabled={cargando}>
                            {cargando ? "Registrando..." : "Registrar Equipo"}
                        </Boton>

                        <div className="text-center text-sm text-gray-600">
                            <Link to="/gestionar-equipos" className="text-blue-600 hover:text-blue-800 font-medium">
                                Volver a la gestión de equipos
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}