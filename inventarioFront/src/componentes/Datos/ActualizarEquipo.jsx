import { DatosUbicacion } from "./DatosUbicaciones.jsx"; // Verifica la ruta
import { DatosTipoEquipo } from "./DatosTipoEquipo.jsx"; // Verifica la ruta
import { MarcaMonitor } from "./MarcaMonitor.jsx"; // Verifica la ruta
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
// Definición de los campos del formulario
const camposFormularioEquipo = [
  {
    type: "select",
    name: "tipoEquipo",
    placeHolder: "Tipo Equipo:",
    required: true,
    options: DatosTipoEquipo.map((tipoEquipo) => ({
      value: tipoEquipo.value,
      label: tipoEquipo.label,
    })),
    icon: "FiMonitor",
  },
  
  {
    type: "select",
    name: "ubicacion",
    placeholder: "Ubicación:",
    required: true,
    options: DatosUbicacion.map((ubicacion) => ({
      value: ubicacion.value,
      label: ubicacion.label,
    })),
    icon: "FiMapPin",
    searchable: true,
  }, // Añadido 'searchable'

  {
    type: "select",
    name: "ram",
    placeholder: "RAM:",
    required: false,
    options: RAM.map((ram) => ({ value: ram.value, label: ram.label })),
    icon: "FiCpu",
  },
  {
    type: "select",
    name: "tipo_almacenamiento",
    placeholder: "Tipo de Almacenamiento:",
    required: false,
    options: TipoAlmacenamiento.map((tipoAlmacenamiento) => ({
      value: tipoAlmacenamiento.value,
      label: tipoAlmacenamiento.label,
    })),
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
    options: SistemaOperativo.map((sistemaOperativo) => ({
      value: sistemaOperativo.value,
      label: sistemaOperativo.label,
    })),
    icon: "FiCpu",
  },
  {
    type: "select",
    name: "office",
    required: false,
    options: VersionOffice.map((versionOffice) => ({
      value: versionOffice.value,
      label: versionOffice.label,
    })),
    icon: "FiMonitor",
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
    options: TiempoGarantia.map((tiempoGarantia) => ({
      value: tiempoGarantia.value,
      label: tiempoGarantia.label,
    })),
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
    options: MarcaMonitor.map((marcaMonitor) => ({
      value: marcaMonitor.value,
      label: marcaMonitor.label,
    })),
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
  {
    type: "date",
    name: "fecha_adquisicion",
    label: "Fecha de Entrega:",
    required: true,
    placeholder: "Fecha de Entrega",
    defaultValue: obtenerFechaActual(),
    icon: "FiCalendar",
  },
];

export { camposFormularioEquipo};

// Revisa rutas y nombres de exportación
