// infrastructure/adapters/FirestoreEquipoRepository.js
import { firestore } from 'firebase-admin';
import EquipoRepositorio from '../../../domain/puertos/EquipoRepositorio';


export default class FirestoreEquipoRepositorio extends EquipoRepositorio {
  constructor() {
    super();
    this.db = firestore();
    this.collection = this.db.collection('equipos');
  }

  async guardar(equipo) {
    const docRef = await this.collection.add(equipo);
    return { id: docRef.id, ...equipo };
  }

  async encontrarPorPlaca(codigo) {
    const snapshot = await this.collection.where('codigo', '==', codigo).get();
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }
}