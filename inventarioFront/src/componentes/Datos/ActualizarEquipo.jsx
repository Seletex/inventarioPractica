// Archivo: CodigosMensajes.js (O donde tengas las definiciones de datos y helpers)

// Importa todos los arrays de datos que necesitas
import { DatosUbicacion } from "./DatosUbicaciones.jsx";
import { DatosTipoEquipo } from "./DatosTipoEquipo.jsx";
import { MarcaMonitor } from "./MarcaMonitor.jsx";
import { RAM } from "./RAM.jsx";
import { TipoAlmacenamiento } from "./TipoAlmacenamiento.jsx";
import { SistemaOperativo } from "./SistemaOperativo.jsx";
import { TiempoGarantia } from "./TiempoGarantia.jsx";
import { VersionOffice } from "./VersionOffice.jsx";
import { MarcaComputador } from "./MarcaComputador.jsx";
import { MarcaImpresora } from "./MarcaImpresora.jsx";
import {
  crearSiNoOptionsConPlaceholder, 
} from "./SiNoOpciones.jsx";

import { obtenerFechaActual } from "../utiles/FechaActual.jsx";
import { generarOpcionesSelect } from "../utiles/FormulariosAyuda.jsx";

export const marcasPorTipoEquipo = {
  Portatil: MarcaComputador, // Usa los arrays importados
  Escritorio: MarcaComputador,
  Impresora: MarcaImpresora,
  Monitor: MarcaMonitor, 
};

const createTextField = ({
  name,
  label,
  placeHolder,
  required = false,
  icon,
}) => ({
  type: "text",
  name,
  label,
  placeHolder,
  required,
  icon,
});

/*const createNumberField = ({ name, label, placeHolder, required = false, icon }) => ({
  type: "number",
  name,
  label,
  placeHolder,
  required,
  icon,
});
*/
const createDateField = ({
  name,
  label,
  placeHolder,
  required = false,
  icon,
  defaultValue,
}) => ({
  type: "date",
  name,
  label,
  placeHolder,
  required,
  icon,
  defaultValue,
});

// Para selects con opciones predefinidas (como ubicacion, ram, so, etc.)
const createSelectField = ({
  name,
  label,
  placeholder,
  required = false,
  icon,
  options,
}) => ({
  type: "select",
  name,
  label,
  placeholder, // Usar placeholder para el texto de la opción por defecto
  required,
  icon,
  options: generarOpcionesSelect(options), // Usar la función auxiliar para mapear y añadir placeholder si no está
});

// Para selects Sí/No (usando la función generadora de SiNoOpciones)
const createSiNoSelectField = ({
  name,
  label,
  required = false,
  icon,
  placeholderLabel,
}) => ({
  type: "select",
  name,
  label,
  required,
  icon,
  options: crearSiNoOptionsConPlaceholder(placeholderLabel || label), // Generar las opciones Sí/No con placeholder
});

export const camposFormularioEquipo = [
  // Campos de texto
  createTextField({
    name: "placa",
    label: "Placa:",
    placeHolder: "Placa 11111",
    required: false,
    icon: "FiTag",
  }),
  createTextField({
    name: "modelo",
    label: "Modelo:",
    placeHolder: "Modelo",
    required: false,
    icon: "FiMonitor",
  }),
  createTextField({
    name: "serial",
    label: "Número de Serie:",
    placeHolder: "Número de serie",
    required: true,
    icon: "FiTag",
  }),
  createTextField({
    name: "almacenamiento",
    label: "Capacidad Almacenamiento:",
    placeHolder: "Capacidad de Almacenamiento (GB)",
    required: false,
    icon: "FiHardDrive",
  }), // Campo de almacenamiento como texto/número
  createTextField({
    name: "modelo_monitor",
    label: "Modelo Monitor:",
    placeHolder: "Modelo del Monitor",
    required: false,
    icon: "FiMonitor",
  }),
  createTextField({
    name: "responsable",
    label: "Responsable:",
    placeHolder: "Nombre del responsable",
    required: false,
    icon: "FiUser",
  }),
  createTextField({
    name: "usaurioAsignado",
    label: "Usuario Asignado:",
    placeHolder: "Usuario asignado",
    required: false,
    icon: "FiUser",
  }),

  createDateField({
    name: "fecha_adquisicion",
    label: "Fecha de Adquisición:",
    placeholder: "Fecha de Adquisición",
    required: true,
    defaultValue: obtenerFechaActual(),
    icon: "FiCalendar",
  }),

  createSelectField({
    name: "tipoEquipo",
    label: "Tipo Equipo:",
    placeholder: "Seleccionar Tipo",
    required: true,
    options: DatosTipoEquipo,
    icon: "FiMonitor",
  }),
  createSelectField({
    name: "ubicacion",
    label: "Ubicación:",
    placeholder: "Seleccionar Ubicación",
    required: true,
    options: DatosUbicacion,
    icon: "FiMapPin",
  }),
  createSelectField({
    name: "ram",
    label: "RAM:",
    placeholder: "Seleccionar RAM",
    required: false,
    options: RAM,
    icon: "FiCpu",
  }),
  createSelectField({
    name: "tipo_almacenamiento",
    label: "Tipo Almacenamiento:",
    placeholder: "Seleccionar Tipo Almacenamiento",
    required: false,
    options: TipoAlmacenamiento,
    icon: "FiHardDrive",
  }),
  createSelectField({
    name: "sistema_operativo",
    label: "Sistema Operativo:",
    placeholder: "Seleccionar SO",
    required: false,
    options: SistemaOperativo,
    icon: "FiCpu",
  }),
  createSelectField({
    name: "office",
    label: "Versión Office:",
    placeholder: "Seleccionar Office",
    required: false,
    options: VersionOffice,
    icon: "FiMonitor",
  }),
  createSelectField({
    name: "tiempo_garantia",
    label: "Tiempo de Garantía:",
    placeholder: "Seleccionar Tiempo Garantía",
    required: false,
    options: TiempoGarantia,
    icon: "FiCalendar",
  }),
  createSelectField({
    name: "monitor",
    label: "Marca Monitor:",
    placeholder: "Seleccionar Marca Monitor",
    required: false,
    options: MarcaMonitor,
    icon: "FiMonitor",
  }),
  createSiNoSelectField({
    name: "garantia",
    label: "¿Tiene Garantía?",
    required: false,
  }),
  createSiNoSelectField({
    name: "teclado",
    label: "¿Tiene Teclado?",
    required: false,
  }),
  createSiNoSelectField({
    name: "mouse",
    label: "¿Tiene Mouse?",
    required: false,
  }),
  createSiNoSelectField({
    name: "entregado",
    label: "¿Ha sido Entregado?",
    required: false,
  }),
];

// Exportamos las definiciones
export { obtenerFechaActual };
