import { DatosUbicacion } from "./DatosUbicaciones.jsx";

import { DatosTipoEquipo } from "./DatosTipoEquipo.jsx";

import { MarcaMonitor } from "./MarcaMonitor.jsx";

import { RAM } from "./RAM.jsx";
import { TipoAlmacenamiento } from "./TipoAlmacenamiento.jsx";
import { SistemaOperativo } from "./SistemaOperativo.jsx";
import { TiempoGarantia } from "./TiempoGarantia.jsx";
import { VersionOffice } from "./VersionOffice.jsx";

import {
  siNoOpcionesEntrega,
  siNoOpcionesGarantia,
  siNoOpcionesMouse,
  siNoOpcionesTeclado,
} from "./SiNoOpciones.jsx";

import { obtenerFechaActual } from "../utiles/FechaActual.jsx";

const generarOpcionesSelect = (dataArray) => {
  return dataArray.map((item) => ({ value: item.value, label: item.label }));
};

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
    options: generarOpcionesSelect(DatosTipoEquipo),
    icon: "FiMonitor",
  },

  {
    type: "select",
    name: "marca",
    required: true,
    icon: "FiTag",
    searchable: true,
  },

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

  {
    type: "select",
    name: "ubicacion",
    placeholder: "Ubicación:",
    required: true,
    options: generarOpcionesSelect(DatosUbicacion),
    icon: "FiMapPin",
    searchable: true,
  },

  {
    type: "select",
    name: "ram",
    placeholder: "RAM:",
    required: false,
    options: generarOpcionesSelect(RAM),
    icon: "FiCpu",
  },
  {
    type: "select",
    name: "tipo_almacenamiento",
    placeholder: "Tipo de Almacenamiento:",
    required: false,
    options: generarOpcionesSelect(TipoAlmacenamiento),
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
    options: generarOpcionesSelect(SistemaOperativo),
    icon: "FiCpu",
  },
  {
    type: "select",
    name: "office",
    required: false,
    options: generarOpcionesSelect(VersionOffice),
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
    options: generarOpcionesSelect(TiempoGarantia),
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
    options: generarOpcionesSelect(MarcaMonitor),
    icon: "FiMonitor",
    searchable: true,
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
