// src/infraestructura/adaptadores-accionados/persistencia-firestore/AsignacionRepositorioFirestore.js

import IAsignacionRepositorio from "../../../dominio/puertos/salida/IAsignacionRepositorio.js"; // Ajusta la ruta
import { db } from "../configuracion/firebaseAdmin.js";

const COLECCION_ASIGNACIONES = "asignaciones";

class AsignacionRepositorioFirestore extends IAsignacionRepositorio {
  constructor() {
    super();
    this.coleccion = db.collection(COLECCION_ASIGNACIONES);
  }

  /**
   * Guarda un nuevo registro de asignación.
   * @param {Asignacion} asignacion - Datos de la asignación.
   * @returns {Promise<Asignacion>} La asignación guardada con su ID.
   */
  async guardar(asignacion) {
    try {
      const docRef = await this.coleccion.add({
        equipoId: asignacion.equipoId, // ID del equipo asignado
        usuarioId: asignacion.usuarioId || null, // ID del usuario (si aplica)
        ubicacionId: asignacion.ubicacionId || null, // ID de la ubicación (si aplica)
        fechaAsignacion: asignacion.fechaAsignacion || new Date(),
        fechaDevolucion: asignacion.fechaDevolucion || null, // Se llena al devolver
        estado: asignacion.estado || "activa", // 'activa', 'devuelta'
        notas: asignacion.notas || "",
      });
      console.log(`Asignación guardada con ID: ${docRef.id}`);
      return { ...asignacion, id: docRef.id };
    } catch (error) {
      console.error("Error guardando asignación en Firestore:", error);
      throw new Error(`Error al guardar asignación: ${error.message}`);
    }
  }

  /**
   * Busca una asignación por su ID.
   * @param {string} id - El ID de la asignación.
   * @returns {Promise<Asignacion|null>} La asignación encontrada o null.
   */
  async buscarPorId(id) {
    try {
      const docSnap = await this.coleccion.doc(id).get();
      if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error buscando asignación por ID ${id}:`, error);
      throw new Error(`Error al buscar asignación por ID: ${error.message}`);
    }
  }

  /**
   * Busca la asignación activa de un equipo específico.
   * @param {string} equipoId - El ID del equipo.
   * @returns {Promise<Asignacion|null>} La asignación activa o null si no hay.
   */
  async buscarActivaPorEquipoId(equipoId) {
    try {
      const snapshot = await this.coleccion
        .where("equipoId", "==", equipoId)
        .where("estado", "==", "activa")
        .limit(1) // Solo debería haber una activa por equipo
        .get();

      if (snapshot.empty) {
        return null;
      }
      const docSnap = snapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error(
        `Error buscando asignación activa para equipo ${equipoId}:`,
        error
      );
      throw new Error(
        `Error al buscar asignación activa por equipo: ${error.message}`
      );
    }
  }

  async actualizar(id, datosActualizar) {
    try {
      const docRef = this.coleccion.doc(id);
      await docRef.update({
        ...datosActualizar,
        fechaActualizacion: new Date(), // Opcional
      });
      console.log(`Asignación con ID ${id} actualizada.`);
    } catch (error) {
      console.error(`Error actualizando asignación con ID ${id}:`, error);
      throw new Error(`Error al actualizar asignación: ${error.message}`);
    }
  }
  async buscarHistorialPorEquipoPlaca(equipoPlaca) {
    try {
        const snapshot = await this.coleccion
          .where("equipoPlaca", "==", equipoPlaca)
          .orderBy("fechaAsignacion", "desc")
          .get();
  
        if (snapshot.empty) {
          return null;
        }
  
    } catch (error) {
        console.log("Hubo un problema o al buscar el historial por la placa", error)
    }
  }
  async buscarActivaPorUsuarioId(usuarioId) {
    try {
        const snapshot = await this.coleccion
          .where("usuarioId", "==", usuarioId)

    } catch (error) {
        console.error(`Error buscando asignación activa para usuario ${usuarioId}:`, error);
        throw new Error(`Error al buscar asignación activa por usuario: ${error.message}`);
    }
  }

  // Podrías añadir más métodos:
  // async buscarHistorialPorEquipoId(equipoId) { ... }
  // async buscarActivasPorUsuarioId(usuarioId) { ... }
}

export default AsignacionRepositorioFirestore;
