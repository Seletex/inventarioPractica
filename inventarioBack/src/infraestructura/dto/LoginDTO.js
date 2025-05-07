/**
 * @class LoginDTO
 * @description Data Transfer Object para las credenciales de inicio de sesión.
 *              Valida que el correo y la contraseña no estén vacíos y que el correo tenga un formato válido.
 */
const passwordRegexSegura = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#])[A-Za-z\d@$!%*?&_#+-/]{8,}$/ // Ajusta [@$!%*?&_#] si permites otros especiales
);
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
         const emailRegexSegura = new RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


        );

        if (!emailRegexSegura.test(correo.trim())) { // Usar la nueva regex
            throw new Error("El formato del correo no es válido.");
        }

     
        if (!contraseña || typeof contraseña !== 'string' || !passwordRegexSegura.test(contraseña)) {
          
            throw new Error(
                "La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&_#+-/)." // Ajusta el mensaje para listar los especiales permitidos
            );
        }

        this.correo = correo.trim();
        this.contraseña = contraseña.trim(); 
    }
}

module.exports = LoginDTO;