class Usuario {
  constructor(id, nombre, correo, passwordHash, rol) {
    if (!nombre || !correo || !passwordHash || !rol) {
      throw new Error(
        "El nombre, apellido y email son obligatorios, ya que son necesarios para crear la cuenta de usuario."
      );
    }
    this.id(id);
    this.nombre(nombre);

    this.email(correo);
    this.passwordHash(passwordHash);
    this.rol(rol);
  }
  static async crearNuevo(
    { nombre, correo, passwordPlana, rol },
    { generarId, servicioHash }
  ) {
    if (!passwordPlana) {
      throw new Error("La contraseña es obligatoria para crear un usuario.");
    }
    const id = generarId();
    const passwordHash = await servicioHash.generarHash(passwordPlana);
    return new Usuario(id, nombre, correo, passwordHash, rol);
  }
  toPlainObject() {
    return {
      id: this.id,
      nombre: this.nombre,
      correo: this.correo,
      rol: this.rol,
      fechaCreacion: this.fechaCreacion.toISOString(), // Formato estándar ISO
    };
  }
}
module.exports = Usuario;
