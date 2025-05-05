import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!serviceAccountPath) {
  console.error(
    "Error: La variable de entorno GOOGLE_APPLICATION_CREDENTIALS no está definida."
  );
  process.exit(1); // Salir si no está configurada
}
// const serviceAccount = require(serviceAccountPath); // Carga el archivo JSON

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Reemplaza \\n por \n
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || "googleapis.com", // Añade un valor por defecto si es necesario
};

// Validar que las variables esenciales estén presentes (ejemplo)
if (
  !serviceAccount.project_id ||
  !serviceAccount.private_key ||
  !serviceAccount.client_email
) {
  console.error(
    "Error: Faltan variables de entorno esenciales de Firebase Admin."
  );
  throw new Error("Configuración de Firebase Admin incompleta.");
}

// Inicializar Firebase Admin SDK (elige UNA de las opciones de credenciales de arriba)
if (!admin.apps.length) {
  // Evita inicializar la app múltiples veces si este archivo se importa en varios lugares
  admin.initializeApp({
    // Usar Opción 1 o 2:
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: `https://${serviceAccount.project_id}.firebaseio.com` // Opcional, si usas Realtime Database
    // storageBucket: `${serviceAccount.project_id}.appspot.com` // Opcional, si usas Cloud Storage
  });
  console.log("Firebase Admin SDK inicializado correctamente.");
} else {
  console.log("Firebase Admin SDK ya estaba inicializado.");
}

// Obtener instancias de los servicios que necesitas
const db = admin.firestore(); // Instancia de Firestore
const auth = admin.auth(); // Instancia de Firebase Authentication
// const storage = admin.storage(); // Instancia de Cloud Storage (si se necesita)
// const rtdb = admin.database(); // Instancia de Realtime Database (si se necesita)

// Exportar las instancias para que puedan ser usadas por los adaptadores
export { db, auth }; // Exporta solo lo que necesites
