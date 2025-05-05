// src/infraestructura/adaptadores-manejando/http/EquipoControlador.js

// Importar Casos de Uso
import CrearEquipoCasoUso from '../../../aplicacion/casos-uso/equipo/CrearEquipoCasoUso.js';
import ObtenerEquipoPorIdCasoUso from '../../../aplicacion/casos-uso/equipo/ObtenerEquipoPorIdCasoUso.js';
import ListarEquiposCasoUso from '../../../aplicacion/casos-uso/equipo/ListarEquiposCasoUso.js';
import ActualizarEquipoCasoUso from '../../../aplicacion/casos-uso/equipo/ActualizarEquipoCasoUso.js';
import EliminarEquipoCasoUso from '../../../aplicacion/casos-uso/equipo/EliminarEquipoCasoUso.js';

// Importar Repositorios (para inyección de dependencias)
import EquipoRepositorioFirestore from '../../adaptadores-accionados/persistencia-firestore/EquipoRepositorioFirestore.js';

// --- Inyección de Dependencias (Ejemplo simple) ---
const equipoRepositorio = new EquipoRepositorioFirestore();

const crearEquipoCasoUso = new CrearEquipoCasoUso(equipoRepositorio);
const obtenerEquipoPorIdCasoUso = new ObtenerEquipoPorIdCasoUso(equipoRepositorio);
const listarEquiposCasoUso = new ListarEquiposCasoUso(equipoRepositorio);
const actualizarEquipoCasoUso = new ActualizarEquipoCasoUso(equipoRepositorio);
const eliminarEquipoCasoUso = new EliminarEquipoCasoUso(equipoRepositorio);
// --- Fin Inyección de Dependencias ---

class EquipoControlador {

    async crear(req, res, next) {
        const datosEquipo = req.body; // { nombre, marca, modelo, numeroSerie, etc. }

        // Aquí irían validaciones de entrada más robustas
        if (!datosEquipo.nombre || !datosEquipo.marca || !datosEquipo.numeroSerie) {
            return res.status(400).json({ mensaje: 'Nombre, marca y número de serie son requeridos.' });
        }

        try {
            const nuevoEquipo = await crearEquipoCasoUso.ejecutar(datosEquipo);
            res.status(201).json({ mensaje: 'Equipo creado exitosamente', equipo: nuevoEquipo });
        } catch (error) {
            console.error("Error en EquipoControlador.crear:", error);
             if (error.message.includes('Número de serie duplicado')) { // Ejemplo de error específico
                 res.status(409).json({ mensaje: 'El número de serie ya existe.' });
             } else {
                 next(error);
             }
        }
    }

    async obtenerPorId(req, res, next) {
        const { id } = req.params; // El ID viene de la URL (ej: /api/equipos/xyz123)

        try {
            const equipo = await obtenerEquipoPorIdCasoUso.ejecutar(id);
            if (!equipo) {
                return res.status(404).json({ mensaje: 'Equipo no encontrado.' });
            }
            res.status(200).json(equipo);
        } catch (error) {
            console.error(`Error en EquipoControlador.obtenerPorId (${id}):`, error);
            next(error);
        }
    }

    async listar(req, res, next) {
        try {
            // Aquí podrías pasar filtros o paginación desde req.query si el caso de uso lo soporta
            // const { pagina, limite, filtroMarca } = req.query;
            const equipos = await listarEquiposCasoUso.ejecutar(/* { pagina, limite, filtroMarca } */);
            res.status(200).json(equipos);
        } catch (error) {
            console.error("Error en EquipoControlador.listar:", error);
            next(error);
        }
    }

    async actualizar(req, res, next) {
        const { id } = req.params;
        const datosActualizar = req.body;

        if (Object.keys(datosActualizar).length === 0) {
             return res.status(400).json({ mensaje: 'No se proporcionaron datos para actualizar.' });
        }
         // Validaciones adicionales...

        try {
            const equipoActualizado = await actualizarEquipoCasoUso.ejecutar(id, datosActualizar);
             if (!equipoActualizado) { // El caso de uso podría devolver null si no se encontró
                 return res.status(404).json({ mensaje: 'Equipo no encontrado para actualizar.' });
             }
            res.status(200).json({ mensaje: 'Equipo actualizado exitosamente', equipo: equipoActualizado });
        } catch (error) {
            console.error(`Error en EquipoControlador.actualizar (${id}):`, error);
             if (error.message.includes('Número de serie duplicado')) {
                 res.status(409).json({ mensaje: 'El número de serie ya pertenece a otro equipo.' });
             } else if (error.message.includes('no encontrado')) { // Error desde el repositorio
                 res.status(404).json({ mensaje: 'Equipo no encontrado.' });
             }
             else {
                 next(error);
             }
        }
    }

    async eliminar(req, res, next) {
        const { id } = req.params;

        try {
            await eliminarEquipoCasoUso.ejecutar(id);
            res.status(200).json({ mensaje: 'Equipo eliminado exitosamente.' });
            // O res.status(204).send(); // No Content
        } catch (error) {
            console.error(`Error en EquipoControlador.eliminar (${id}):`, error);
             if (error.message.includes('no encontrado')) {
                 res.status(404).json({ mensaje: 'Equipo no encontrado para eliminar.' });
             } else if (error.message.includes('asignado')) { // Si tienes lógica que impide borrar equipos asignados
                 res.status(409).json({ mensaje: 'No se puede eliminar un equipo que está asignado.' });
             }
             else {
                 next(error);
             }
        }
    }
}

export default new EquipoControlador();
