import { currentMode } from "./apiSwitch";
import { mockEquiposService } from "./mockEquipos.api";
import { realEquiposService } from "./realEquipos.api";

import { API_MODE } from "./apiConstants"; // Ensure API_MODE is defined in this file or imported from the correct module

export const equiposService =
  currentMode === API_MODE.MOCK ? mockEquiposService : realEquiposService;
