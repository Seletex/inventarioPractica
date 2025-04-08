import {DatosUbicacion} from "../Datos/DatosUbicacion.jsx";
import {DatosTipoEquipo} from "../Datos/DatosTipoEquipo.jsx";
import {MarcaComputador} from "../Datos/MarcaComputador.jsx";
import { MarcaMonitor } from "./MarcaMonitor.jsx";
import { MarcaImpresora } from "./MarcaImpresora.jsx";
import { RAM } from "./RAM.jsx";
import { TipoAlmacenamiento } from "./TipoAlmacenamiento.jsx";
import { SistemaOperativo } from "./SistemaOperativo.jsx";
import { TiempoGarantia} from "./TiempoGarantia.jsx";
import { VersionOffice } from "./VersionOffice.jsx";

const obtenerFechaActual = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
export const crearEquipo = [
    {  type: "number", id: "placa", name: "placa", label: "Placa", placeHolder: "Placa 11111", required: true,},
    { type: "select", id: "tipoEquipo",  name: "tipoEquipo", label: "Tipo Equipo:",  required: true,
       options: DatosTipoEquipo.map(tipoEquipo => ({ value: tipoEquipo.value, label: tipoEquipo.label, }))},
    { type: "select",  id: "marca", name: "marca", label: "Marca:", required: false,
        options: MarcaComputador.map(marca => ({ value: marca.value, label: marca.label, }))},
     
    {type: "text", id: "modelo", name: "modelo", label: "Modelo", placeHolder: "Modelo", required: false,},
    { type: "text", id: "serie", name: "serie", label: "Número de serie", placeHolder: "Número de serie", required: false,},
    {type: "select", id: "ubicacion", name: "ubicacion", label: "Ubicación:", required: true,
        options: DatosUbicacion.map(ubicacion => ({ value: ubicacion.value, label: ubicacion.label,}))},
    {type: "select", id: "ram", name: "ram", label: "RAM:", required: true, options: RAM.map(ram => ({
          value: ram.value,
          placeHolder: ram.label,
        })),
    },
    {type: "select", id: "tipo_almacenamiento", name: "tipo_almacenamiento", label: "Tipo de Almacenamiento:",
        required: false,
        options: TipoAlmacenamiento.map(tipoAlmacenamiento => ({value: tipoAlmacenamiento.value, label: tipoAlmacenamiento.label,
        })),
    },
    {type: "number", id: "almacenamiento", name: "almacenamiento", placeHolder: "Capacidad de Almacenamiento",
        required: false,},
    {type: "select", id:"sistema_operativo", name: "sistema_operativo", label: "Sistema Operativo:", required: false,
        options: SistemaOperativo.map(sistemaOperativo => ({value: sistemaOperativo.value, label: sistemaOperativo.label,})),
    },
    {type: "select", id:"office", name: "office", label: "Versión Office:", required: false,
        options: VersionOffice.map(versionOfficeArray => ({value: versionOfficeArray.value, label: versionOfficeArray.label,
        })),
    },{type: "date",id: "fecha_adquisicion",name: "fecha_adquisicion",required: true,placeholder: "Fecha de Adquisición",
        label: "Fecha de Adquisición:", defaultValue: obtenerFechaActual(), // Establece el valor predeterminado
      },{type: "boolean", id: "garantia", name: "garantia", required: false, placeholder: "¿Tiene Garantía?", },
    {type: "select", id: "tiempo_garantia", name: "tiempo_garantia", label: "Tiempo de Garantía:", required: false,
        options: TiempoGarantia.map(tiempoGarantia => ({value: tiempoGarantia.value, label: tiempoGarantia.label,})),},
        {type: "boolean", id: "teclado", name: "teclado", required: false, placeholder: "¿Tiene Teclado?", },
        {type: "boolean", id: "mouse", name: "mouse", required: false, placeholder: "¿Tiene Mouse?", },
    {type: "select", id: "monitor", name: "monitor", label: "Marca Monitor:", required: false,
        options: MarcaMonitor.map(marcaMonitor => ({value: marcaMonitor.value, label: marcaMonitor.label,})),
    },
    {type: "text", id: "modelo_monitor", name: "modelo_monitor", label: "Modelo Monitor:", required: false,
        placeholder: "Modelo Monitor",},
        {type: "boolean", id: "entregado", name: "entregado", required: false, placeholder: "¿Ha sido entregado?", },

]