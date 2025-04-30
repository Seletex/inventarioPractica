import {MarcaComputador} from "./MarcaComputador.jsx"; // Verificada la ruta
import { MarcaMonitor } from "./MarcaMonitor.jsx"; // Verificada la ruta
import { MarcaImpresora } from "./MarcaImpresora.jsx"; // Verificada la ruta
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