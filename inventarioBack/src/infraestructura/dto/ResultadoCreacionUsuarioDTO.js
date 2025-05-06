/**
 * @class ResultadoCreacionUsuarioDTO
 * @description Data Transfer Object para representar el resultado de la creación de un usuario.
 */
class ResultadoCreacionUsuarioDTO {
     /**
      * @param {string} id - El ID del usuario creado.
      * @param {string} nombreUsuario - El nombre del usuario creado.
      * @param {string} correo - El correo electrónico del usuario creado.
      */
     constructor(id, nombreUsuario, correo) {
         this.id = id;
         this.nombreUsuario = nombreUsuario;
         this.correo = correo;
     }
 }
 
 export { ResultadoCreacionUsuarioDTO };