import IEquipoRepositorio from "../../../../dominio/puertos/salida/IRepositorioEquipo.js"; // Ajusta la ruta a tu interfaz
import { db } from "../../configuracion/firebaseAdmin.js"; // Importa la instancia de Firestore
// Opcional: Importa una clase/modelo de Equipo si la tienes
import Equipo from "../../../../dominio/entidades/EquipoEntidad.js";

const COLECCION_EQUIPOS = "equipos";

class EquipoRepositorioFirestore extends IEquipoRepositorio {
  constructor() {
    super();
    this.coleccion = db.collection(COLECCION_EQUIPOS);
  }

  async guardar(equipo) {
    try {
      const docRef = await this.coleccion.add({
        nombre: equipo.nombre,
        marca: equipo.marca,
        modelo: equipo.modelo,
        numeroSerie: equipo.numeroSerie,
        estado: equipo.estado || "disponible", // Estado por defecto
        fechaAdquisicion: equipo.fechaAdquisicion || new Date(),
        ubicacionId: equipo.ubicacionId || null,
        tipoEquipoId: equipo.tipoEquipoId || null,
        usuarioIdResponsable: equipo.usuarioIdResponsable || null,
        placa: equipo.placa,
        descripcion: equipo.descripcion || null,
        // Referencia a otra colección
        // otros campos...
      });
      console.log(`Equipo guardado con ID: ${docRef.id}`);
      return { ...equipo, id: docRef.id };
    } catch (error) {
      console.error("Error guardando equipo en Firestore:", error);
      throw new Error(`Error al guardar equipo: ${error.message}`);
    }
  }

  async buscarPorId(placa) {
    try {
      const docSnap = await this.coleccion.doc(placa).get();
      if (docSnap.exists) {
        const data = docSnap.data();
        return { placa: docSnap.placa, ...data };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error buscando equipo por ID ${placa}:`, error);
      throw new Error(`Error al buscar equipo por ID: ${error.message}`);
    }
  }

  async buscarTodos() {
    try {
      const snapshot = await this.coleccion.get();
      const equipos = [];
      snapshot.forEach((doc) => {
        equipos.push({ id: doc.id, ...doc.data() });
      });
      return equipos;
    } catch (error) {
      console.error("Error buscando todos los equipos:", error);
      throw new Error(`Error al buscar todos los equipos: ${error.message}`);
    }
  }

  async actualizar(placa, datosActualizar) {
    try {
      const docRef = this.coleccion.doc(placa);
      await docRef.update({
        ...datosActualizar,
        fechaActualizacion: new Date(),
      });
      console.log(`Equipo con ID ${placa} actualizado.`);
    } catch (error) {
      console.error(`Error actualizando equipo con ID ${placa}:`, error);
      throw new Error(`Error al actualizar equipo: ${error.message}`);
    }
  }

  async eliminar(placa) {
    try {
      await this.coleccion.doc(placa).delete();
      console.log(`Equipo con ID ${placa} eliminado de Firestore.`);
    } catch (error) {
      console.error(`Error eliminando equipo con ID ${placa}:`, error);
      throw new Error(`Error al eliminar equipo: ${error.message}`);
    }
  }

  // Puedes añadir más métodos específicos si los necesitas
  // async buscarPorNumeroSerie(numeroSerie) { ... }
  // async buscarPorEstado(estado) { ... }
}

export default EquipoRepositorioFirestore;
