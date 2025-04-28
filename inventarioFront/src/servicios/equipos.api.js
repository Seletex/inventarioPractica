// src/servicios/equipos.api.js
import { currentMode, API_MODE } from "./apiSwitch"; // Importar API_MODE desde aquí
import { mockEquiposService } from "./mockEquipos.api";
import { realEquiposService } from "./realEquipo.api"; // Asegúrate que este archivo existe

// Ya no se necesita importar desde apiConstants
// import { API_MODE } from "./apiConstants";

export const equiposService =
  currentMode === API_MODE.MOCK ? mockEquiposService : realEquiposService;
