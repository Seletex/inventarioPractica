import IRepositorioMantenimiento from "../../../../dominio/puertos/salida/IRepositorioMantenimiento.js"; // Corregido el import de la interfaz
import { db } from "../../configuracion/firebaseAdmin.js";
 
const COLECCION_MANTENIMIENTOS = "mantenimientos";

class MantenimientoRepositorioFirestore extends IRepositorioMantenimiento {
  constructor() {
    super();
    this.coleccion = db.collection(COLECCION_MANTENIMIENTOS);
  }

  /**
   * Método privado para manejar errores comunes de Firestore.
   * @private
   * @param {Error} error - El error original capturado.
   * @param {string} mensajePrefijo - Mensaje para el log y el nuevo error.
   */
  _manejarError(error, mensajePrefijo) {
    console.error(`${mensajePrefijo}:`, error);
    throw new Error(`${mensajePrefijo}: ${error.message}`);
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
      this._manejarError(error, "Error al guardar mantenimiento");
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
      this._manejarError(error, `Error al buscar mantenimiento por ID ${id}`);
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
      this._manejarError(error, `Error al buscar mantenimientos para equipo ${equipoId}`);
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
      this._manejarError(error, `Error al actualizar mantenimiento con ID ${id}`);
    }
  }
  async buscarProgramados() {
    try {
      const snapshot = await this.coleccion
        .where("estado", "==", "programado")
        .get();

      const mantenimientos = [];
      // Falta llenar el array mantenimientos aquí
      snapshot.forEach((doc) => {
        mantenimientos.push({ id: doc.id, ...doc.data() });
      });
      return mantenimientos; // Devolver el array
    } catch (error) {
      this._manejarError(error, "Error al buscar mantenimientos programados");
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
      this._manejarError(error, `Error cambiando estado del mantenimiento con ID ${id}`);
    }
  }
}

export default MantenimientoRepositorioFirestore;
