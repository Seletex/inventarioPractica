import {MarcaComputador} from "./MarcaComputador.jsx";
import { MarcaMonitor } from "./MarcaMonitor.jsx"; 
import { MarcaImpresora } from "./MarcaImpresora.jsx"; 
export const marcasPorTipoEquipo = {
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