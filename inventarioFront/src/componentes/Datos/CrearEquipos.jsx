import {DatosUbicacion} from "./DatosUbicaciones.jsx"; // Verifica la ruta

import {DatosTipoEquipo} from "./DatosTipoEquipo.jsx"; // Verifica la ruta
import {MarcaComputador} from "./MarcaComputador.jsx"; // Verifica la ruta
import { MarcaMonitor } from "./MarcaMonitor.jsx"; // Verifica la ruta
import { MarcaImpresora } from "./MarcaImpresora.jsx"; // Verifica la ruta
import { RAM } from "./RAM.jsx"; // Verifica la ruta
import { TipoAlmacenamiento } from "./TipoAlmacenamiento.jsx"; // Verifica la ruta
import { SistemaOperativo } from "./SistemaOperativo.jsx"; // Verifica la ruta
import { TiempoGarantia} from "./TiempoGarantia.jsx"; // Verifica la ruta
import { VersionOffice } from "./VersionOffice.jsx"; // Verifica la ruta

const obtenerFechaActual = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Mapeo de Tipos de Equipo a sus arrays de Marcas
const marcasPorTipoEquipo = {
  'Laptop': MarcaComputador,
  'Computador': MarcaComputador,
  'Impresora': MarcaImpresora,
  'Proyector': MarcaComputador,
  'Escáner': MarcaImpresora,
  'Monitor': MarcaMonitor,
  'MiniPC': MarcaComputador,
  'Computadores': MarcaComputador,
    'Servidor': MarcaComputador,
};


// Definición de los campos del formulario
const camposFormularioEquipo = [
    {  type: "text", name: "placa", placeHolder: "Placa", required: true, icon: 'FiTag'},
    { type: "select", name: "tipoEquipo", placeHolder: "Tipo Equipo:", required: true,
       options: DatosTipoEquipo.map(tipoEquipo => ({ value: tipoEquipo.value, label: tipoEquipo.label })), icon: 'FiMonitor'},
    // Marca depende del tipo, se maneja dinámicamente, puede ser searchable
    { type: "select",  name: "marca", required: true, icon: 'FiTag', searchable: true }, // Añadido 'searchable'

    {type: "text", name: "modelo",placeHolder: "Modelo", required: false, icon: 'FiMonitor'},
    { type: "text", name: "serial", placeHolder: "Número de Serie:",  required: false, icon: 'FiTag'},

    // --- CAMBIO AQUÍ: Añadimos searchable a Ubicación ---
    {type: "select", name: "ubicacion", placeholder: "Ubicación:", required: true,
        options: DatosUbicacion.map(ubicacion => ({value: ubicacion.value, label: ubicacion.label,})) , icon: 'FiMapPin', searchable: true}, // Añadido 'searchable'

    {type: "select", name: "ram", placeholder: "RAM:", required: false,
        options: RAM.map(ram => ({ value: ram.value, label: ram.label, })), icon: 'FiCpu'
    },
    {type: "select", name: "tipo_almacenamiento", placeholder: "Tipo de Almacenamiento:", required: false,
        options: TipoAlmacenamiento.map(tipoAlmacenamiento => ({value: tipoAlmacenamiento.value, label: tipoAlmacenamiento.label,})), icon: 'FiHardDrive'
    },
    {type: "number", name: "almacenamiento", placeHolder: "Ej: 500", required: false, icon: 'FiHardDrive'},

    {type: "select", name: "sistema_operativo",placeHolder:"Sistema Operativo: ", required: false,
        options: SistemaOperativo.map(sistemaOperativo => ({value: sistemaOperativo.value, label: sistemaOperativo.label,})), icon: 'FiCpu'
    },
    {type: "select", name: "office",  required: false,
        options: VersionOffice.map(versionOffice => ({value: versionOffice.value, label: versionOffice.label,})), icon: 'FiMonitor'
    },
    {type: "date", name: "fecha_adquisicion", label: "Fecha de Adquisición:", required: true, placeholder: "Fecha de Adquisición", defaultValue: obtenerFechaActual(), icon: 'FiCalendar'},
   
    {type: "boolean", name: "garantia", label: "¿Tiene Garantía?", required: false},
    {type: "select", name: "tiempo_garantia", placeHolder: "Tiempo de Garantía:", required: false,
        options: TiempoGarantia.map(tiempoGarantia => ({value: tiempoGarantia.value, label: tiempoGarantia.label,})), icon: 'FiCalendar'},

    {type: "boolean", name: "teclado", label: "¿Tiene Teclado?", required: false},
    {type: "boolean", name: "mouse", label: "¿Tiene Mouse?", required: false},

    {type: "select", name: "monitor", required: false,
        options: MarcaMonitor.map(marcaMonitor => ({value: marcaMonitor.value, label: marcaMonitor.label,})), icon: 'FiMonitor', searchable: true // Puede ser searchable
    },
    {type: "text", name: "modelo_monitor", required: false, placeHolder: "Modelo del Monitor", icon: 'FiMonitor'},

    {type: "text", name: "responsable",  placeHolder: "Nombre del responsable", required: false, icon: 'FiUser'},

    {type: "boolean", name: "entregado", label: "¿Ha sido entregado?", required: false},
];

export { camposFormularioEquipo, marcasPorTipoEquipo, obtenerFechaActual };

// Revisa rutas y nombres de exportación