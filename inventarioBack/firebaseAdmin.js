// Usar ES Modules
import admin from 'firebase-admin';
// Importar dotenv para cargar variables de entorno desde .env en desarrollo
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

// --- Manejo seguro de credenciales usando variables de entorno ---
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  // Asegúrate de que la variable de entorno FIREBASE_PRIVATE_KEY contenga los saltos de línea como \n
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || "googleapis.com"
};

// Validar que las variables esenciales estén presentes
if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
  console.error("Error: Faltan variables de entorno esenciales de Firebase Admin.");
  // Considera lanzar un error o salir de forma controlada
  process.exit(1); // Detener la aplicación si Firebase no puede configurarse
}

// Variables para almacenar las instancias de los servicios
let db;
let auth;

try {
  // --- Prevenir múltiples inicializaciones ---
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK inicializado correctamente.');
  }
  // Obtener instancias de los servicios necesarios
  db = admin.firestore(); // Instancia de Firestore
  auth = admin.auth();   // Instancia de Firebase Authentication
} catch (error) {
  console.error('Error inicializando Firebase Admin SDK:', error);
  process.exit(1); // Detener la aplicación si Firebase no inicializa
}

// Exportar solo las instancias necesarias usando ES Modules
export { db, auth }; // Exporta db y auth (o solo db si no usas auth)