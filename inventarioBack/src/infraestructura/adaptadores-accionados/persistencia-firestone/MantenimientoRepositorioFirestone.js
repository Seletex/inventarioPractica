import IEquipoRepositorio from "../../../dominio/puertos/salida/IRepositorioMantenimiento.js";
import { db } from "../configuracion/firebaseAdmin.js";

const COLECCION_MANTENIMIENTOS = "mantenimientos";

class MantenimientoRepositorioFirestore extends IRepositorioMantenimiento {
  constructor() {
    super();
    this.coleccion = db.collection(COLECCION_MANTENIMIENTOS);
  }

  async guardar(mantenimiento) {
    try {
      const docRef = await this.coleccion.add({
        equipoId: mantenimiento.equipoId, // ID del equipo
        fechaMantenimiento: mantenimiento.fechaMantenimiento || new Date(),
        tipo: mantenimiento.tipo || "correctivo", // 'preventivo', 'correctivo', 'mejora'
        descripcion: mantenimiento.descripcion,
        costo: mantenimiento.costo || 0,
        tecnicoResponsable: mantenimiento.tecnicoResponsable || null, // Podría ser un ID de usuario
        fechaProximoMantenimiento:
          mantenimiento.fechaProximoMantenimiento || null,
        estado: mantenimiento.estado || "completado", // 'programado', 'en_proceso', 'completado', 'cancelado'
      });
      console.log(`Mantenimiento guardado con ID: ${docRef.id}`);
      return { ...mantenimiento, id: docRef.id };
    } catch (error) {
      console.error("Error guardando mantenimiento en Firestore:", error);
      throw new Error(`Error al guardar mantenimiento: ${error.message}`);
    }
  }

  async buscarPorId(id) {
    try {
      const docSnap = await this.coleccion.doc(id).get();
      if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error buscando mantenimiento por ID ${id}:`, error);
      throw new Error(`Error al buscar mantenimiento por ID: ${error.message}`);
    }
  }

  async buscarPorEquipoId(equipoId) {
    try {
      const snapshot = await this.coleccion
        .where("equipoId", "==", equipoId)
        .orderBy("fechaMantenimiento", "desc") // Ordenar por fecha
        .get();

      const mantenimientos = [];
      snapshot.forEach((doc) => {
        mantenimientos.push({ id: doc.id, ...doc.data() });
      });
      return mantenimientos;
    } catch (error) {
      console.error(
        `Error buscando mantenimientos para equipo ${equipoId}:`,
        error
      );
      throw new Error(
        `Error al buscar mantenimientos por equipo: ${error.message}`
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
      console.log(`Mantenimiento con ID ${id} actualizado.`);
    } catch (error) {
      console.error(`Error actualizando mantenimiento con ID ${id}:`, error);
      throw new Error(`Error al actualizar mantenimiento: ${error.message}`);
    }
  }
  async buscarProgramados() {
    try {
      const snapshot = await this.coleccion
        .where("estado", "==", "programado")
        .get();

      const mantenimientos = [];
    } catch (error) {
      console.error(`Error buscando mantenimientos programados:`, error);
      throw new Error(
        `Error al buscar mantenimientos programados: ${error.message}`
      );
    }
  }
  async cambiarEstado(id, nuevoEstado) {
    try {
      const snapshot = await this.coleccion.doc(id).get();
      if (snapshot.exists) {
        await snapshot.ref.update({ estado: nuevoEstado });
        console.log(
          `Estado del mantenimiento con ID ${id} actualizado a ${nuevoEstado}.`
        );
      } else {
        console.log(`No se encontró un mantenimiento con ID ${id}.`);
      }
    } catch (error) {
      console.error(
        `Error cambiando estado del mantenimiento con ID ${id}:`,
        error
      );
      throw new Error(
        `Error al cambiar estado del mantenimiento: ${error.message}`
      );
    }
  }
}

export default MantenimientoRepositorioFirestore;
