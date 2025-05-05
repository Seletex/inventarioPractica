import IUsuarioRepositorio from "../../../aplicacion/puertos/IUsuarioRepositorio.js"; // Ajusta la ruta a tu interfaz
import { db } from "../configuracion/firebaseAdmin.js"; // Importa la instancia de Firestore
import Usuario from "../../../dominio/entidades/UsuarioEntidad.js";

const COLECCION_USUARIOS = "usuarios";

class UsuarioRepositorioFirestore extends IUsuarioRepositorio {
  constructor() {
    super(); // Llama al constructor de la clase base (interfaz simulada)
    this.coleccion = db.collection(COLECCION_USUARIOS);
  }

  async guardar(usuario) {
    try {
      // Firestore asigna un ID automáticamente si no se especifica .doc(id)
      const docRef = await this.coleccion.add({
        nombre: usuario.nombre,
        email: usuario.email,
        // No guardes la contraseña directamente, guarda el hash si aplica
        passwordHash: usuario.passwordHash, // Ejemplo
        roles: usuario.roles || ["usuario"], // Rol por defecto
        fechaCreacion: new Date(),
        // otros campos...
      });
      console.log(`Usuario guardado con ID: ${docRef.id}`);
      // Devuelve el usuario con su nuevo ID
      return { ...usuario, id: docRef.id };
    } catch (error) {
      console.error("Error guardando usuario en Firestore:", error);
      throw new Error(`Error al guardar usuario: ${error.message}`);
    }
  }

  async buscarPorId(id) {
    try {
      const docSnap = await this.coleccion.doc(id).get();
      if (docSnap.exists) {
        const data = docSnap.data();
        // Opcional: Mapear a una clase Usuario
        // return new Usuario(id, data.nombre, data.email, /* ... */);
        return { id: docSnap.id, ...data };
      } else {
        return null; // No encontrado
      }
    } catch (error) {
      console.error(`Error buscando usuario por ID ${id}:`, error);
      throw new Error(`Error al buscar usuario por ID: ${error.message}`);
    }
  }

  async buscarPorEmail(email) {
    try {
      const snapshot = await this.coleccion
        .where("email", "==", email)
        .limit(1)
        .get();
      if (snapshot.empty) {
        return null; // No encontrado
      }
      // Debería haber solo uno por la lógica de negocio (email único)
      const docSnap = snapshot.docs[0];
      const data = docSnap.data();
      return { id: docSnap.id, ...data };
    } catch (error) {
      console.error(`Error buscando usuario por email ${email}:`, error);
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }

  async actualizar(id, datosActualizar) {
    try {
      const docRef = this.coleccion.doc(id);
      await docRef.update({
        ...datosActualizar,
        fechaActualizacion: new Date(), // Opcional: guardar fecha de modif.
      });
      console.log(`Usuario con ID ${id} actualizado.`);
    } catch (error) {
      console.error(`Error actualizando usuario con ID ${id}:`, error);
      // Podrías verificar si el error es porque no existe (error.code === 'not-found')
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  async eliminar(id) {
    try {
      await this.coleccion.doc(id).delete();
      console.log(`Usuario con ID ${id} eliminado de Firestore.`);
    } catch (error) {
      console.error(`Error eliminando usuario con ID ${id}:`, error);
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  async buscarTodos() {
    try {
      const snapshot = await this.coleccion.get();
      const usuarios = [];
      snapshot.forEach((doc) => {
        usuarios.push({ id: doc.id, ...doc.data() });
      });
      return usuarios;
    } catch (error) {
      console.error("Error buscando todos los usuarios:", error);
      throw new Error(`Error al buscar todos los usuarios: ${error.message}`);
    }
  }
}

export default UsuarioRepositorioFirestore;
