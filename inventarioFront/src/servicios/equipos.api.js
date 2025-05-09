// src/servicios/equipos.api.js
import { currentMode, API_MODE } from "./ApiSwitch"; // Importar API_MODE desde aquí
import { mockEquiposService } from "./mockEquipos.api";
import { realEquiposService } from "./realEquipo.api"; // Asegúrate que este archivo existe



export const equiposService =
  currentMode === API_MODE.MOCK ? mockEquiposService : realEquiposService;
