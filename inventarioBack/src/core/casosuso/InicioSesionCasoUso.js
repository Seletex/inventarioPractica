const ICasoDeUsoInicioSesion = require("../dominio/puertos/ICasoDeUsoInicioSesion");
// const IUserRepository = require('../../domain/ports/output/IUserRepository'); // Ejemplo si usaras DB
// const ITokenService = require('../../domain/ports/output/ITokenService'); // Ejemplo si usaras un servicio de token

class InicioSesionCasoUso extends ICasoDeUsoInicioSesion {
  constructor(usuarioRepository, tokenService) {
    super();
    // this.usuarioRepository = usuarioRepository; // Ejemplo si usaras DB
    // this.tokenService = tokenService; // Ejemplo si usaras un servicio de token
  }
  async executar(correo, contrasena) {
    console.log("Ejecutando caso de uso de inicio de sesión...", correo);
    // --- Lógica de autenticación ---
    // En un caso real:
    // 1. const user = await this.userRepository.findByEmail(correo);
    // 2. if (!user) throw new Error('Usuario no encontrado');
    // 3. const isPasswordValid = await bcrypt.compare(contraseña, user.passwordHash);
    // 4. if (!isPasswordValid) throw new Error('Credenciales inválidas');
    // 5. return { message: 'Login exitoso', usuario: { nombre: user.nombre } };
    // 6. const token = this.tokenService.generateToken(user.id); // Ejemplo si usaras un servicio de token
    // 7. return { token, usuario: { nombre: user.nombre } };

    if (correo === "usuario@valido.com" && contraseña === "passwordcorrecto") {
      return {
        message: "Login exitoso",
        usuario: { nombre: "Usuario Válido" },
      };
    } else {
      // Lanzar un error específico que el controlador pueda manejar
      const error = new Error("Credenciales inválidas");
      error.statusCode = 401; // Añadir status code para el controlador
      throw error;
    }
  }
}

module.exports = InicioSesionCasoUso;
