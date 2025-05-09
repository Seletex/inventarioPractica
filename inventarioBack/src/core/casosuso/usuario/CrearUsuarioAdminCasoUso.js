import Usuario from "../../../aplicacion/dominio/Usuario";
import { Resultado } from "../../../aplicacion/dominio/valueObjects/Resultado";
import { ResultadoCreacionUsuarioDTO } from "../dtos/ResultadoCreacionUsuarioDTO";
import { UsuarioRol } from "../../../aplicacion/dominio/valueObjects/usuario/UsuarioRol";
import { UsuarioEstatus } from "../../../aplicacion/dominio/valueObjects/usuario/UsuarioEstatus";

export default class CrearUsuarioAdminCasoUso {
    
    constructor(usuarioRepositorio) {
        this.usuarioRepositorio = usuarioRepositorio;
    }

    async ejecutar(nombre, correo, contrasena) {
        const usuarioRol = UsuarioRol.crear(UsuarioRol.ADMINISTRADOR);
        if (usuarioRol.esFallido) {
            return Resultado.falla<ResultadoCreacionUsuarioDTO>(usuarioRol.error);
        }

        const usuarioEstatus = UsuarioEstatus.crear(UsuarioEstatus.ACTIVO);
        if (usuarioEstatus.esFallido) {
            return Resultado.falla<ResultadoCreacionUsuarioDTO>(usuarioEstatus.error);
        }

        const usuario = Usuario.crear(nombre, correo, contrasena, usuarioRol.getValue(), usuarioEstatus.getValue());
        if (usuario.esFallido) {
            return Resultado.falla<ResultadoCreacionUsuarioDTO>(usuario.error);
        }

        const resultado = await this.usuarioRepositorio.guardar(usuario.getValue());
        if (resultado.esFallido) {
            return Resultado.falla<ResultadoCreacionUsuarioDTO>(resultado.error);
        }

        return Resultado.ok<ResultadoCreacionUsuarioDTO>({ id: resultado.getValue() });
    }
}
