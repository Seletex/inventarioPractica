import { CrearUsuarioAdminCasoUso } from '../../../aplicacion/casos-uso/usuario/CrearUsuarioAdminCasoUso.js';
import { UsuarioRepositorio } from '../../repositorios/UsuarioRepositorio.js';
import { encriptarClave } from '../../../aplicacion/servicios/encriptarClave.js';
import { Usuario } from '../../../dominio/entidades/UsuarioEntidad.js';

export class CrearUsuarioAdminComando {
  constructor() {
    this.usuarioRepositorio = new UsuarioRepositorio();
    this.crearUsuarioAdminCasoUso = new CrearUsuarioAdminCasoUso(
      this.usuarioRepositorio,
      encriptarClave,
      Usuario
    );
  }

  async ejecutar(nombre, clave) {
    try {
      await this.crearUsuarioAdminCasoUso.ejecutar(nombre, clave);
      console.log('Usuario administrador creado exitosamente.');
    } catch (error) {
      console.error('Error al crear el usuario administrador:', error.message);
    }
  }
}
