const crypto = require('crypto');
/**
 * @class UsuarioDTO
 * @description Data Transfer Object para representar la información de un usuario.
 *              Genera un ID único si no se proporciona uno.
 *              Valida los campos requeridos en el momento de la creación.
 */
class UsuarioDTO{
    /**
     * @param {string|null|undefined} id - El ID del usuario. Si es nulo, indefinido o vacío, se generará uno nuevo.
     * @param {string} nombre - El nombre del usuario (Requerido).
     * @param {string} correo - El correo electrónico del usuario (Requerido).
     * @param {string} contraseña - La contraseña del usuario (Requerido).
     * @param {string} rol - El rol del usuario (Requerido).
     * @throws {Error} Si alguno de los campos requeridos (nombre, correo, contraseña, rol) falta o es inválido.
     */
    constructor(id, nombre, correo, contraseña, rol){
        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            throw new Error("El 'nombre' es requerido y debe ser una cadena no vacía para UsuarioDTO.");
        }
        if (!correo || typeof correo !== 'string' || correo.trim() === '') { // Podrías añadir validación de formato de email aquí
            throw new Error("El 'correo' es requerido y debe ser una cadena no vacía para UsuarioDTO.");
        }
        if (!contraseña || typeof contraseña !== 'string' || contraseña.trim() === '') { // Considera no almacenar contraseñas en texto plano en DTOs que viajan mucho
            throw new Error("La 'contraseña' es requerida y debe ser una cadena no vacía para UsuarioDTO.");
        }
        if (!rol || typeof rol !== 'string' || rol.trim() === '') {
            throw new Error("El 'rol' es requerido y debe ser una cadena no vacía para UsuarioDTO.");
        }

        this.id = (id && String(id).trim()) ? String(id).trim() : crypto.randomUUID(); // Genera UUID si id es falsy o vacío
        this.nombre = nombre.trim();
        this.correo = correo.trim();
        this.contraseña = contraseña; // Generalmente no se hace trim a contraseñas
        this.rol = rol.trim();
    }

}
module.exports = UsuarioDTO;