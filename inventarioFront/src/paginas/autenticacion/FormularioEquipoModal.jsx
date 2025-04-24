// Archivo: src/componentes/Equipo/FormularioEquipoModal.jsx (Crear este nuevo archivo)

import React, { useState, useEffect, useMemo} from "react"; // Importar useEffect y useMemo
import { Dialog } from "primereact/dialog"; // Importar Dialog de PrimeReact
import { Button } from "primereact/button"; // Importar Button
import Entrada from "../InterfazUsuario/Entrada"; // Importar Entrada

import { toast } from "react-toastify"; // Importar toast (asumimos que está configurado globalmente)
// Importar configuración de campos y datos
import { camposFormularioEquipo, marcasPorTipoEquipo, siNoOptions } from "../Datos/CrearEquipo.jsx"; // Asegúrate de la ruta correcta
// Importar servicios
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js"; // Asegúrate de la ruta correcta
import PropTypes from "prop-types"; // Para validación de props
import { Icono } from "../../componentes/utiles/Icono.jsx";
// Componente para renderizar iconos dinámicamente (Puedes moverlo a un archivo de utilidades si no está ya)



/**
 * Modal/Formulario para crear o editar un equipo.
 * @param {object} props - Propiedades del componente.
 * @param {boolean} props.visible - Controla la visibilidad del modal.
 * @param {function} props.onHide - Callback para cerrar el modal.
 * @param {object | null} props.equipo - Objeto del equipo a editar, o null para crear nuevo.
 * @param {function} props.onSaveSuccess - Callback al guardar exitosamente.
 */
export function FormularioEquipoModal({ visible, onHide, equipo, onSaveSuccess }) {

    // --- Estado del formulario ---
    // Inicializar el estado basado en si se está editando un equipo o creando uno nuevo
    const initialState = useMemo(() => {
        if (equipo) {
            // Si estamos editando, usar los datos del equipo prop
            // Asegurar que todas las propiedades del formulario existan, aunque el equipo prop no las tenga todas
            const defaultState = {};
             camposFormularioEquipo.forEach(campo => {
                 defaultState[campo.name] = ''; // Valor por defecto vacío
                 if (campo.type === 'boolean') defaultState[campo.name] = false; // Default para booleanos
                 if (campo.defaultValue !== undefined) defaultState[campo.name] = campo.defaultValue; // Usar defaultValue si existe
             });
             // Combinar defaults con los datos del equipo existente
            return { ...defaultState, ...equipo };
        } else {
            // Si estamos creando, usar el estado inicial por defecto definido anteriormente
            const state = {};
            camposFormularioEquipo.forEach(campo => {
                 state[campo.name] = campo.defaultValue !== undefined ? campo.defaultValue : '';
                 if (campo.type === 'boolean' && state[campo.name] === '') state[campo.name] = false;
             });
            return state;
        }
    }, [equipo]); // Recalcular estado inicial si el 'equipo' prop cambia

    const [formulario, setFormulario] = useState(initialState);

    // Resetear el formulario cuando el modal se hace visible (útil para reabrir)
    useEffect(() => {
        if (visible) {
            setFormulario(initialState);
        }
    }, [visible, initialState]); // Ejecutar cuando cambia la visibilidad o el estado inicial

    const [error, setError] = useState(""); // Estado para errores de validación o del servicio
    const [cargandoEnvio, setCargandoEnvio] = useState(false); // Estado para el loading del botón


    // --- Lógica para obtener las marcas disponibles dinámicamente ---
    // Solo se ejecuta si el formulario tiene datos
     const marcasDisponibles = useMemo(() => {
        if (!formulario) return [];
        const tipoSeleccionado = formulario.tipoEquipo;
        const marcas = marcasPorTipoEquipo[tipoSeleccionado];
         // Asegurar opción por defecto
         return marcas && marcas.length > 0 ? marcas : [{ value: "", label: "Seleccionar Marca" }];
     }, [formulario?.tipoEquipo]); // Recalcular cuando formulario.tipoEquipo cambie


    // --- Manejar el cambio en cualquier campo ---
    const manejarCambio = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormulario(prevFormulario => {
            if (name === 'tipoEquipo') {
                return { ...prevFormulario, [name]: newValue, marca: "" }; // Resetear marca al cambiar tipo
            } else {
                 // Manejar conversión para selects Sí/No si tu backend lo espera
                 const campoConfig = camposFormularioEquipo.find(c => c.name === name);
                 let finalValue = newValue;
                 if (campoConfig?.options === siNoOptions) { // Si las opciones son las de Sí/No
                     // Si el valor es "true" o "false", convertirlos a booleanos si es necesario
                     // Esto es solo para el estado local, la conversión final para enviar es en manejarEnvio
                     // Si tu estado local debe ser string ("true"/"false") o boolean (true/false), ajusta
                     // Para mantenerlo simple y consistente con selects, dejamos strings aquí
                 }

                return {
                    ...prevFormulario,
                    [name]: finalValue
                };
            }
        });
    };

    // --- Manejar envío del formulario (Crear o Actualizar) ---
    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError("");
        setCargandoEnvio(true);

        // Validaciones dinámicas
        let valid = true;
        const errores = [];
        camposFormularioEquipo.forEach(campo => {
            // En edición, la placa NO es requerida en el formulario, pero sí debe estar en los datos
            // En creación, la placa SÍ es requerida en el formulario
            const isPlacaField = campo.name === 'placa';
       //     const isMarcaField = campo.name === 'marca'; // La marca es requerida si el tipo está seleccionado

            if (campo.required) { // Si el campo está marcado como requerido en la configuración
                 const valor = formulario[campo.name];

                 // La placa solo es requerida si estamos CREANDO un equipo
                 if (isPlacaField && !equipo) { // Si es el campo placa Y no estamos editando
                     if (valor === null || valor === undefined || valor === '') {
                         valid = false; errores.push(`${campo.label} es requerido.`);
                     }
                 }
                 // Otros campos requeridos (que no sean placa) siempre se validan
                 else if (!isPlacaField) {
                      if (campo.type === 'select') {
                         if (valor === null || valor === undefined || valor === '') {
                              valid = false; errores.push(`${campo.label} es requerido.`);
                         }
                      } else { // text, number, date, etc.
                         if (valor === null || valor === undefined || valor === '') {
                            valid = false; errores.push(`${campo.label} es requerido.`);
                         }
                     }
                 }
            }
        });

        // Validación específica para la marca (si el tipo está seleccionado y hay opciones)
        const hasRealMarcaOptions = marcasDisponibles.some(opt => opt.value !== ""); // Verifica si hay marcas disponibles aparte del placeholder
        if(formulario?.tipoEquipo && hasRealMarcaOptions && (formulario.marca === null || formulario.marca === undefined || formulario.marca === '')) {
             valid = false;
             errores.push("Debes seleccionar una Marca válida.");
        }


        if (!valid) {
            setError(errores.join(" "));
            setCargandoEnvio(false);
            return;
        }

        // --- Preparar datos antes de enviar (conversión de booleanos, etc.) ---
        const datosParaEnviar = { ...formulario };
        // Convertir strings "true"/"false" a booleanos si el backend lo espera
        ['garantia', 'teclado', 'mouse', 'entregado'].forEach(fieldName => {
             const valorString = formulario[fieldName];
             if (valorString !== null && valorString !== undefined) {
                 // Si el valor es "", se convierte a false, lo cual es razonable para selects Sí/No no seleccionados
                datosParaEnviar[fieldName] = valorString === "true";
             }
         });
         // Asegurar que campos booleanos que no fueron seleccionados ("") se envíen como false si el backend espera booleanos
         camposFormularioEquipo.filter(c => c.type === 'select' && c.options === siNoOptions && (formulario[c.name] === '' || formulario[c.name] === undefined || formulario[c.name] === null)).forEach(campoBool => {
             datosParaEnviar[campoBool.name] = false;
         });


        try {
            let mensajeExito = '';
            let resultado;

            if (equipo) {
                // --- ACTUALIZAR EQUIPO ---
                // La API update necesita la placa del equipo original
                resultado = await equiposService.update(equipo.placa, datosParaEnviar);
                mensajeExito = `Equipo con placa ${equipo.placa} actualizado exitosamente.`;
            } else {
                // --- CREAR NUEVO EQUIPO ---
                // Asegúrate de que la placa esté en datosParaEnviar (viene del formulario)
                 if (!datosParaEnviar.placa) { // Doble check, aunque ya se validó
                    throw new Error("La placa es necesaria para crear el equipo.");
                 }
                resultado = await equiposService.create(datosParaEnviar);
                mensajeExito = `Equipo con placa ${datosParaEnviar.placa} registrado exitosamente.`,resultado;
            }

            toast.success(mensajeExito);

            // Llamar al callback de éxito (para que el componente padre recargue la tabla y cierre el modal)
            onSaveSuccess();

        } catch (err) {
            const errorMessage = err.message || (equipo ? "Error desconocido al actualizar." : "Error desconocido al registrar.");
            setError(`Error: ${errorMessage}`);
            console.error("Error guardando equipo:", err);
            toast.error(`Error: ${errorMessage}`);
        } finally {
            setCargandoEnvio(false);
        }
    };


     // --- Renderizado del cuerpo del formulario (igual que antes) ---
     const renderFormFields = () => {
         return camposFormularioEquipo.map(campo => {
             // Omitir renderizado si el campo es undefined o null en la config
             if (!campo) return null;

             // No renderizar campo Placa si estamos editando (ya se muestra en el título)
             // Si quieres mostrarlo deshabilitado, quita esta condición y añade disabled={true} abajo
             if (campo.name === 'placa' && equipo) return null;

             // Si estamos creando, la marca es un select dependiente del tipo
             // Si estamos editando, la marca NO es editable (simplemente la mostraremos o la omitimos, no un select editable)
             if (campo.name === 'marca' && equipo) {
                 // Opción 1: Omitir el campo Marca por completo en edición
                 return null;
                 // Opción 2: Mostrar la Marca actual como texto plano o campo deshabilitado
                 // Mostrar la marca cargada (deshabilitado o como texto plano)
                 /* return (
                     <div className="campo" key={campo.name}>
                         <label className="block text-sm font-medium text-gray-700">Marca:</label>
                         <p className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                              {equipo.marca || 'N/A'} // Mostrar la marca cargada
                         </p>
                     </div>
                 ); */
             }


             const valorCampo = formulario[campo.name];

             // Contenedor para cada campo
             return (
                 <div className="campo" key={campo.name}>
                     {/* Renderizar Etiqueta (Label) para todos los campos que tengan label */}
                     {campo.label && (
                         <label
                             htmlFor={campo.name}
                             className={`block text-sm font-medium text-gray-700 ${campo.type !== 'boolean' ? 'mb-1' : 'ml-2 cursor-pointer'}`}
                         >
                             {campo.label}
                             {/* Mostrar * si el campo es requerido Y ES EDITABLE */}
                             {campo.required && !(campo.name === 'placa' && equipo) && <span className="text-red-500"> *</span>}
                         </label>
                     )}

                     {/* Renderizar el Input/Select/Checkbox basado en el tipo */}
                     {(() => {
                         switch (campo.type) {
                             case 'text':
                             case 'number':
                             case 'date': {
                                 return (
                                     <Entrada
                                         placeHolder={campo.placeHolder || campo.label}
                                         tipo={campo.type}
                                         nombre={campo.name}
                                         valor={valorCampo === null || valorCampo === undefined ? '' : valorCampo}
                                         required={campo.required} // El input HTML puede ser requerido
                                         manejarCambio={manejarCambio}
                                         icono={campo.icon ? <Icono nombre={campo.icon} /> : null}
                                         // Campo Placa: deshabilitado solo en edición
                                         disabled={campo.name === 'placa' && equipo}
                                     />
                                 );
                             }

                             case 'select': {
                                 let opcionesSelect = campo.options;

                                 // Usar marcas disponibles para el selector 'marca' SOLO EN CREACIÓN
                                 if (campo.name === 'marca' && !equipo) {
                                     opcionesSelect = marcasDisponibles;
                                 }

                                 // Asegurar opción por defecto y que opcionesSelect no sea null
                                 const finalOptions = opcionesSelect?.length > 0 && opcionesSelect[0]?.value === ""
                                     ? opcionesSelect
                                     : [{ value: "", label: `Seleccionar ${campo.label?.replace(':', '') || ''}` }, ...(opcionesSelect || [])];

                                 return (
                                     <select
                                         id={campo.name}
                                         name={campo.name}
                                         value={valorCampo === null || valorCampo === undefined ? '' : valorCampo}
                                         onChange={manejarCambio}
                                         required={campo.required} // El select HTML puede ser requerido
                                         className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                         // Deshabilitar el selector si no es editable (ej: marca en edición, o tipoEquipo si decides no editarlo)
                                         disabled={(campo.name === 'marca' && equipo) || (campo.name === 'tipoEquipo' && equipo)} // Ejemplo: marca y tipo no editables en edición
                                     >
                                         {/* Renderizar la opción por defecto solo si existe o se añadió */}
                                          {finalOptions.length > 0 && finalOptions[0].value === "" && (
                                              <option value="" disabled key="">
                                                  {finalOptions[0].label}
                                              </option>
                                          )}
                                         {/* Mapear las opciones (excluir la por defecto si ya se renderizó) */}
                                         {finalOptions.filter(opt => opt.value !== "").map((opcion) => (
                                             <option key={opcion.value} value={opcion.value}>
                                                 {opcion.label}
                                             </option>
                                         ))}
                                     </select>
                                 );
                             }

                            // Si tienes campos booleanos (checkboxes)
                             case 'boolean': {
                                 return (
                                      <div className="flex items-center mt-1">
                                          <input
                                              type="checkbox"
                                              id={campo.name}
                                              name={campo.name}
                                              checked={valorCampo === true}
                                              onChange={manejarCambio}
                                              required={campo.required}
                                              className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                          />
                                           {campo.label && (
                                               <label htmlFor={campo.name} className="text-sm font-medium text-gray-700 cursor-pointer">
                                                  {campo.label}
                                                  {campo.required && <span className="text-red-500"> *</span>}
                                               </label>
                                           )}
                                      </div>
                                 );
                             }

                             default:
                                 return null; // Tipo desconocido
                         }
                     })()}
                 </div>
             );
         });
     };


    // Renderiza el modal
    return (
        <Dialog
            header={equipo ? "Actualizar Equipo" : "Registrar Nuevo Equipo"} // Título dinámico
            visible={visible} // Controla visibilidad
            style={{ width: '50vw' }} // Estilos del modal
            breakpoints={{ '960px': '75vw', '641px': '100vw' }} // Breakpoints responsivos
            modal // Hace que el modal bloquee el fondo
            className="p-fluid" // Clase para PrimeReact (maneja padding/espaciado interno)
            onHide={onHide} // Manejador para cerrar el modal al hacer clic fuera o en la 'X'
            // Footer del modal (botones de acción)
            footer={(
                <div>
                    <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                    <Button label={equipo ? "Actualizar" : "Registrar"} icon="pi pi-check" onClick={manejarEnvio} disabled={cargandoEnvio} />
                </div>
            )}
        >
            {/* Contenido del modal: Errores y Formulario */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Renderizar los campos */}
             {renderFormFields()}

             {/* Mover el contenedor Toast aquí si quieres que los toasts aparezcan sobre el modal */}
             {/* <Toast ref={toast} /> */}

        </Dialog>
    );
}


// PropTypes para validar las props
FormularioEquipoModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    equipo: PropTypes.object, // Puede ser null o un objeto
    onSaveSuccess: PropTypes.func.isRequired,
};