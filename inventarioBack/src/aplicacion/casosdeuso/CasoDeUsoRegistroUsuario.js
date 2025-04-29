const ICasoDeUsoRegistroUsuario = require('../puertos/ICasoDeUsoRegistroUsuario');
const IUsuarioRepository = require('../puertos/IUsuarioRepository');

class CasoDeUsoRegistroUsuario extends ICasoDeUsoRegistroUsuario {
    constructor(usuarioRepository) {
        super();
        //this.usuarioRepository = usuarioRepository;
    }
}

module.exports = CasoDeUsoRegistroUsuario;