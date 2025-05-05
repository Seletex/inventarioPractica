/**
 * @class LoginDTO
 * @description Data Transfer Object para las credenciales de inicio de sesión.
 *              Valida que el correo y la contraseña no estén vacíos y que el correo tenga un formato válido.
 */
class LoginDTO {
    /**
     * @param {string} correo - El correo electrónico del usuario.
     * @param {string} contraseña - La contraseña del usuario.
     * @throws {Error} Si el correo o la contraseña están vacíos o si el correo no tiene un formato válido.
     */
    constructor(correo, contraseña) { 
       
        if (!correo || typeof correo !== 'string' || correo.trim() === '') {
            throw new Error("El correo es requerido.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo.trim())) {
            throw new Error("El formato del correo no es válido.");
        }

     
        if (!contraseña || typeof contraseña !== 'string' || contraseña.trim() === '') {
            throw new Error("La contraseña es requerida.");
        }

        this.correo = correo.trim();
        this.contraseña = contraseña.trim(); 
    }
}

module.exports = LoginDTO;