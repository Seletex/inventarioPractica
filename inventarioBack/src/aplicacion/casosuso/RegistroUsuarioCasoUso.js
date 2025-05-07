const ICasoDeUsoRegistroUsuario = require('../puertos/ICasoDeUsoRegistroUsuario');


class RegistroUsuarioCasoUso extends ICasoDeUsoRegistroUsuario {
    constructor(usuarioRepository) {
        super();
        this.usuarioRepository = usuarioRepository;
    }
}

module.exports = RegistroUsuarioCasoUso;