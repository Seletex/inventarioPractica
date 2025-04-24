
import { camposFormularioEquipo} from "../../componentes/Datos/CrearEquipos.jsx";
export const estadoinicial = (() => {
    const state = {};
    camposFormularioEquipo.forEach(campo => {
        state[campo.name] = campo.defaultValue !== undefined ? campo.defaultValue : '';
        if (campo.type === 'boolean' && state[campo.name] === '') state[campo.name] = false;
    });
    return state;
})();