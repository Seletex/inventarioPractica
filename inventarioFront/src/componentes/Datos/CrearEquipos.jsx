import { DatosUbicacion } from "./DatosUbicaciones.jsx"; // Verifica la ruta

import { DatosTipoEquipo } from "./DatosTipoEquipo.jsx"; // Verifica la ruta
import { MarcaComputador } from "./MarcaComputador.jsx"; // Verifica la ruta
import { MarcaMonitor } from "./MarcaMonitor.jsx"; // Verifica la ruta
import { MarcaImpresora } from "./MarcaImpresora.jsx"; // Verifica la ruta
import { RAM } from "./RAM.jsx"; // Verifica la ruta
import { TipoAlmacenamiento } from "./TipoAlmacenamiento.jsx"; // Verifica la ruta
import { SistemaOperativo } from "./SistemaOperativo.jsx"; // Verifica la ruta
import { TiempoGarantia } from "./TiempoGarantia.jsx"; // Verifica la ruta
import { VersionOffice } from "./VersionOffice.jsx"; // Verifica la ruta

import {
  siNoOpcionesEntrega,
  siNoOpcionesGarantia,
  siNoOpcionesMouse,
  siNoOpcionesTeclado,
} from "./SiNoOpciones.jsx";

import { obtenerFechaActual } from "../utiles/FechaActual.jsx";

// Función auxiliar para generar opciones de select
const generarOpcionesSelect = (dataArray) => {
  return dataArray.map((item) => ({ value: item.value, label: item.label }));
};

// Definición de los campos del formulario
const camposFormularioEquipo = [
  {
    type: "text",
    name: "placa",
    placeHolder: "Placa",
    required: false,
    icon: "FiTag",
  },
  {
    type: "select",
    name: "tipoEquipo",
    placeHolder: "Tipo Equipo:",
    required: true,
    options: generarOpcionesSelect(DatosTipoEquipo), // Usar función auxiliar
    icon: "FiMonitor",
  },
  // Marca depende del tipo, se maneja dinámicamente, puede ser searchable
  {
    type: "select",
    name: "marca",
    required: true,
    icon: "FiTag",
    searchable: true,
  }, // Añadido 'searchable'

  {
    type: "text",
    name: "modelo",
    placeHolder: "Modelo",
    required: false,
    icon: "FiMonitor",
  },
  {
    type: "text",
    name: "serial",
    placeHolder: "Número de Serie:",
    required: true,
    icon: "FiTag",
  },
  {
    type: "text",
    name: "ip",
    placeHolder: "Dirección IP:",
    required: false,
    icon: "FiGlobe",
  },
  {
    type: "text",
    name: "nombre",
    placeHolder: "Nombre de Equipo: ",
    required: false,
    icon: "FiMonitor",
  },


  // --- CAMBIO AQUÍ: Añadimos searchable a Ubicación ---
  {
    type: "select",
    name: "ubicacion",
    placeholder: "Ubicación:",
    required: true,
    options: generarOpcionesSelect(DatosUbicacion), // Usar función auxiliar
    icon: "FiMapPin",
    searchable: true,
  }, // Añadido 'searchable'

  {
    type: "select",
    name: "ram",
    placeholder: "RAM:",
    required: false,
    options: generarOpcionesSelect(RAM), // Usar función auxiliar
    icon: "FiCpu",
  },
  {
    type: "select",
    name: "tipo_almacenamiento",
    placeholder: "Tipo de Almacenamiento:",
    required: false,
    options: generarOpcionesSelect(TipoAlmacenamiento), // Usar función auxiliar
    icon: "FiHardDrive",
  },
  {
    type: "number",
    name: "almacenamiento",
    placeHolder: "Ej: 500",
    required: false,
    icon: "FiHardDrive",
  },

  {
    type: "select",
    name: "sistema_operativo",
    placeHolder: "Sistema Operativo: ",
    required: false,
    options: generarOpcionesSelect(SistemaOperativo), // Usar función auxiliar
    icon: "FiCpu",
  },
  {
    type: "select",
    name: "office",
    required: false,
    options: generarOpcionesSelect(VersionOffice), // Usar función auxiliar
    icon: "FiMonitor",
  },
  {
    type: "date",
    name: "fecha_adquisicion",
    label: "Fecha de Adquisición:",
    required: true,
    placeholder: "Fecha de Adquisición",
    defaultValue: obtenerFechaActual(),
    icon: "FiCalendar",
  },

  {
    type: "select",
    name: "garantia",
    options: siNoOpcionesGarantia,
    required: false,
  },
  {
    type: "select",
    name: "tiempo_garantia",
    placeHolder: "Tiempo de Garantía:",
    required: false,
    options: generarOpcionesSelect(TiempoGarantia), // Usar función auxiliar
    icon: "FiCalendar",
  },

  {
    type: "select",
    name: "teclado",
    options: siNoOpcionesTeclado,
    required: false,
  },
  {
    type: "select",
    name: "mouse",
    options: siNoOpcionesMouse,
    required: false,
  },

  {
    type: "select",
    name: "monitor",
    required: false,
    options: generarOpcionesSelect(MarcaMonitor), // Usar función auxiliar
    icon: "FiMonitor",
    searchable: true, // Puede ser searchable
  },
  {
    type: "text",
    name: "modelo_monitor",
    required: false,
    placeHolder: "Modelo del Monitor",
    icon: "FiMonitor",
  },

  {
    type: "text",
    name: "responsable",
    placeHolder: "Nombre del responsable",
    required: false,
    icon: "FiUser",
  },
  {
    type: "text",
    name: "usaurioAsignado",
    placeHolder: "Usuario asignado",
    required: false,
    icon: "FiUser",
  },

  {
    type: "select",
    name: "entregado",
    options: siNoOpcionesEntrega,
    required: false,
  },
];

export { camposFormularioEquipo };

// Revisa rutas y nombres de exportación
