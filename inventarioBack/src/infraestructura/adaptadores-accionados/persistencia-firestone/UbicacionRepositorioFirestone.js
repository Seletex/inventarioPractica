// src/infraestructura/adaptadores-accionados/persistencia-firestore/UbicacionRepositorioFirestore.js

import IUbicacionRepositorio from "../../../dominio/puertos/salida/IUbicacionRepositorio.js"; // Ajusta la ruta
import { db } from "../configuracion/firebaseAdmin.js";

const COLECCION_UBICACIONES = "ubicaciones";

class UbicacionRepositorioFirestore extends IUbicacionRepositorio {
  constructor() {
    super();
    this.coleccion = db.collection(COLECCION_UBICACIONES);
  }

  /**
   * Guarda una nueva ubicación.
   * @param {Ubicacion} ubicacion - Datos de la ubicación.
   * @returns {Promise<Ubicacion>} La ubicación guardada con su ID.
   */
  async guardar(ubicacion) {
    try {
      const docRef = await this.coleccion.add({
        nombre: ubicacion.nombre,
        descripcion: ubicacion.descripcion || "",
        direccion: ubicacion.direccion || null, // Podría ser un objeto con calle, ciudad, etc.
        responsableId: ubicacion.responsableId || null, // ID del usuario responsable
        activa: ubicacion.activa !== undefined ? ubicacion.activa : true, // Por defecto activa
      });
      console.log(`Ubicación guardada con ID: ${docRef.id}`);
      return { ...ubicacion, id: docRef.id };
    } catch (error) {
      console.error("Error guardando ubicación en Firestore:", error);
      throw new Error(`Error al guardar ubicación: ${error.message}`);
    }
  }

  /**
   * Busca una ubicación por su ID.
   * @param {string} id - El ID de la ubicación.
   * @returns {Promise<Ubicacion|null>} La ubicación encontrada o null.
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
      console.error(`Error buscando ubicación por ID ${id}:`, error);
      throw new Error(`Error al buscar ubicación por ID: ${error.message}`);
    }
  }

  /**
   * Busca todas las ubicaciones (posiblemente filtrando por activas).
   * @param {boolean} [soloActivas=true] - Si es true, devuelve solo ubicaciones activas.
   * @returns {Promise<Ubicacion[]>} Lista de ubicaciones.
   */
  async buscarTodos(soloActivas = true) {
    try {
      let query = this.coleccion;
      if (soloActivas) {
        query = query.where("activa", "==", true);
      }
      const snapshot = await query.orderBy("nombre").get(); // Ordenar por nombre

      const ubicaciones = [];
      snapshot.forEach((doc) => {
        ubicaciones.push({ id: doc.id, ...doc.data() });
      });
      return ubicaciones;
    } catch (error) {
      console.error("Error buscando todas las ubicaciones:", error);
      throw new Error(
        `Error al buscar todas las ubicaciones: ${error.message}`
      );
    }
  }

  /**
   * Actualiza una ubicación.
   * @param {string} id - El ID de la ubicación a actualizar.
   * @param {object} datosActualizar - Campos a actualizar.
   * @returns {Promise<void>}
   */
  async actualizar(id, datosActualizar) {
    try {
      const docRef = this.coleccion.doc(id);
      await docRef.update({
        ...datosActualizar,
        fechaActualizacion: new Date(), // Opcional
      });
      console.log(`Ubicación con ID ${id} actualizada.`);
    } catch (error) {
      console.error(`Error actualizando ubicación con ID ${id}:`, error);
      throw new Error(`Error al actualizar ubicación: ${error.message}`);
    }
  }
}

export default UbicacionRepositorioFirestore;
