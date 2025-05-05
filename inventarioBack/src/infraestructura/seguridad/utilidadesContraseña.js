const bcrypt = require("bcryptjs");

// SALT_ROUNDS con valor por defecto (solo para desarrollo)
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

/**
 * Genera un hash de una contraseña usando bcrypt.
 * @param {string} contraseñaPlana - La contraseña sin hashear.
 * @returns {Promise<string>} El hash de la contraseña.
 */
async function hashearContraseña(contraseñaPlana) {
  if (!contraseñaPlana) {
    throw new Error("La contraseña no puede estar vacía para hashear.");
  }
  return await bcrypt.hash(contraseñaPlana, SALT_ROUNDS);
}

/**
 * Compara una contraseña plana con un hash existente.
 * @param {string} contraseñaPlana - La contraseña ingresada por el usuario.
 * @param {string} hashGuardado - El hash almacenado en la base de datos.
 * @returns {Promise<boolean>} True si las contraseñas coinciden, false en caso contrario.
 */
async function compararContraseña(contraseñaPlana, hashGuardado) {
  if (!contraseñaPlana || !hashGuardado) {
    return false; // No se puede comparar si falta alguna
  }
  return await bcrypt.compare(contraseñaPlana, hashGuardado);
}

module.exports = {
    hashearContraseña,
    compararContraseña,
    SALT_ROUNDS // Exportar si se necesita en otro lugar, aunque es menos común
};