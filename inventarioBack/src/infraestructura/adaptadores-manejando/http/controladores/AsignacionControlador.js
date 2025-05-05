// src/infraestructura/adaptadores-manejando/http/controladores/AsignacionControlador.js

// --- Importar Casos de Uso ---
// (Asegúrate de que estos casos de uso existan en tu capa de aplicación)
import CrearAsignacionCasoUso from '../../../../aplicacion/casos-uso/asignacion/CrearAsignacionCasoUso.js';
import ObtenerAsignacionPorIdCasoUso from '../../../../aplicacion/casos-uso/asignacion/ObtenerAsignacionPorIdCasoUso.js';
import FinalizarAsignacionCasoUso from '../../../../aplicacion/casos-uso/asignacion/FinalizarAsignacionCasoUso.js';
import ListarHistorialPorEquipoCasoUso from '../../../../aplicacion/casos-uso/asignacion/ListarHistorialPorEquipoCasoUso.js';
import ListarActivasPorUsuarioCasoUso from '../../../../aplicacion/casos-uso/asignacion/ListarActivasPorUsuarioCasoUso.js';
import ObtenerAsignacionActivaPorEquipoCasoUso from '../../../../aplicacion/casos-uso/asignacion/ObtenerAsignacionActivaPorEquipoCasoUso.js';

// --- Importar Repositorios (para Inyección de Dependencias - Ejemplo) ---
// En una aplicación real, esto vendría de un contenedor DI o del punto de entrada principal
import AsignacionRepositorioFirestore from '../../../adaptadores-accionados/persistencia-firestore/AsignacionRepositorioFirestore.js';
import EquipoRepositorioFirestore from '../../../adaptadores-accionados/persistencia-firestore/EquipoRepositorioFirestore.js'; // Necesario para validar estado del equipo

// --- Inyección de Dependencias (Ejemplo Simple) ---
const asignacionRepositorio = new AsignacionRepositorioFirestore();
const equipoRepositorio = new EquipoRepositorioFirestore(); // El caso de uso podría necesitarlo

const crearAsignacionCasoUso = new CrearAsignacionCasoUso(asignacionRepositorio, equipoRepositorio); // Pasar dependencias necesarias
const obtenerAsignacionPorIdCasoUso = new ObtenerAsignacionPorIdCasoUso(asignacionRepositorio);
const finalizarAsignacionCasoUso = new FinalizarAsignacionCasoUso(asignacionRepositorio, equipoRepositorio);
const listarHistorialPorEquipoCasoUso = new ListarHistorialPorEquipoCasoUso(asignacionRepositorio);
const listarActivasPorUsuarioCasoUso = new ListarActivasPorUsuarioCasoUso(asignacionRepositorio);
const obtenerAsignacionActivaPorEquipoCasoUso = new ObtenerAsignacionActivaPorEquipoCasoUso(asignacionRepositorio);
// --- Fin Inyección de Dependencias ---


class AsignacionControlador {

    /**
     * Maneja la creación de una nueva asignación.
     * POST /api/asignaciones
     */
    async crear(req, res, next) {
        const { equipoId, usuarioId, ubicacionId, notas } = req.body;

        // Validación básica de entrada
        if (!equipoId || (!usuarioId && !ubicacionId)) {
            return res.status(400).json({ mensaje: 'Se requiere equipoId y al menos usuarioId o ubicacionId.' });
        }

        try {
            const datosAsignacion = { equipoId, usuarioId, ubicacionId, notas };
            const nuevaAsignacion = await crearAsignacionCasoUso.ejecutar(datosAsignacion);
            res.status(201).json({ mensaje: 'Asignación creada exitosamente', asignacion: nuevaAsignacion });
        } catch (error) {
            console.error("Error en AsignacionControlador.crear:", error);
            // Manejar errores específicos del caso de uso
            if (error.message.includes('Equipo no encontrado') || error.message.includes('Usuario no encontrado') || error.message.includes('Ubicación no encontrada')) {
                res.status(404).json({ mensaje: error.message });
            } else if (error.message.includes('Equipo ya está asignado')) {
                res.status(409).json({ mensaje: error.message });
            } else if (error.message.includes('Equipo no disponible')) {
                 res.status(409).json({ mensaje: 'El equipo no está en estado disponible para ser asignado.' });
            }
            else {
                next(error); // Pasar a middleware de manejo de errores
            }
        }
    }

    /**
     * Maneja la obtención de una asignación por su ID.
     * GET /api/asignaciones/:id
     */
    async obtenerPorId(req, res, next) {
        const { id } = req.params;

        try {
            const asignacion = await obtenerAsignacionPorIdCasoUso.ejecutar(id);
            if (!asignacion) {
                return res.status(404).json({ mensaje: 'Asignación no encontrada.' });
            }
            res.status(200).json(asignacion);
        } catch (error) {
            console.error(`Error en AsignacionControlador.obtenerPorId (${id}):`, error);
            next(error);
        }
    }

    /**
     * Maneja la finalización (devolución) de una asignación activa.
     * PATCH /api/asignaciones/:id/finalizar
     */
    async finalizar(req, res, next) {
        const { id } = req.params;
        const { fechaDevolucion, notasDevolucion } = req.body; // Opcional: permitir pasar fecha y notas

        try {
            const asignacionFinalizada = await finalizarAsignacionCasoUso.ejecutar(id, fechaDevolucion, notasDevolucion);
             if (!asignacionFinalizada) { // Si el caso de uso devuelve null por no encontrarla
                 return res.status(404).json({ mensaje: 'Asignación no encontrada o ya finalizada.' });
             }
            res.status(200).json({ mensaje: 'Asignación finalizada exitosamente.', asignacion: asignacionFinalizada });
        } catch (error) {
            console.error(`Error en AsignacionControlador.finalizar (${id}):`, error);
             if (error.message.includes('no encontrada') || error.message.includes('ya finalizada')) {
                 res.status(404).json({ mensaje: error.message });
             } else {
                next(error);
             }
        }
    }

    /**
     * Maneja la obtención del historial de asignaciones de un equipo.
     * GET /api/equipos/:equipoId/asignaciones
     */
    async listarPorEquipo(req, res, next) {
        const { equipoId } = req.params;

        try {
            const historial = await listarHistorialPorEquipoCasoUso.ejecutar(equipoId);
            // Devuelve un array vacío si no hay historial, no un 404.
            res.status(200).json(historial);
        } catch (error) {
            console.error(`Error en AsignacionControlador.listarPorEquipo (${equipoId}):`, error);
            // Podría haber un error si el equipoId no es válido, aunque el caso de uso podría manejarlo devolviendo []
            next(error);
        }
    }

     /**
     * Maneja la obtención de la asignación activa de un equipo.
     * GET /api/equipos/:equipoId/asignacion-activa
     */
    async obtenerActivaPorEquipo(req, res, next) {
        const { equipoId } = req.params;

        try {
            const asignacionActiva = await obtenerAsignacionActivaPorEquipoCasoUso.ejecutar(equipoId);
            if (!asignacionActiva) {
                // No es un error, simplemente no hay asignación activa
                return res.status(200).json(null);
                // O podrías devolver 404 si prefieres indicar que "no existe" una asignación activa
                // return res.status(404).json({ mensaje: 'No se encontró asignación activa para este equipo.' });
            }
            res.status(200).json(asignacionActiva);
        } catch (error) {
            console.error(`Error en AsignacionControlador.obtenerActivaPorEquipo (${equipoId}):`, error);
            next(error);
        }
    }


    /**
     * Maneja la obtención de las asignaciones activas de un usuario.
     * GET /api/usuarios/:usuarioId/asignaciones-activas
     */
    async listarActivasPorUsuario(req, res, next) {
        const { usuarioId } = req.params;

        try {
            const asignacionesActivas = await listarActivasPorUsuarioCasoUso.ejecutar(usuarioId);
            // Devuelve un array vacío si no tiene asignaciones activas.
            res.status(200).json(asignacionesActivas);
        } catch (error) {
            console.error(`Error en AsignacionControlador.listarActivasPorUsuario (${usuarioId}):`, error);
            // Podría haber un error si el usuarioId no es válido
            next(error);
        }
    }

}

export default new AsignacionControlador();
