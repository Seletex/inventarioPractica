const admin = require('firebase-admin');

// Ruta al archivo de credenciales que descargaste
// Asegúrate que la ruta sea correcta desde la raíz del proyecto o usa __dirname
const serviceAccount = require('./firebase-service-account.json'); // Ajusta la ruta si es necesario

let db; // Variable para almacenar la instancia de Firestore

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    // databaseURL: "https://<TU_PROYECTO_ID>.firebaseio.com" // Opcional, si usas Realtime Database
  });

  console.log('Firebase Admin SDK inicializado correctamente.');

  // Obtener una instancia de Firestore (si planeas usarla)
  db = admin.firestore();

} catch (error) {
  console.error('Error inicializando Firebase Admin SDK:', error);
  process.exit(1); // Detener la aplicación si Firebase no inicializa
}

// Exportar la instancia de admin y db (Firestore) para usarla en otros módulos
module.exports = { admin, db };