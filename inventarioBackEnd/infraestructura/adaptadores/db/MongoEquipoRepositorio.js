import EquipoRepositorio from '../../../domain/puertos/EquipoRepositorio';

import EquipoModel from './models/EquipoModel';

export default class MongoEquipoRepositorio extends EquipoRepositorio {
    
    async guardar(equipo) {
        const equipoDoc = new EquipoModel.create(equipo);
        return equipoDoc.toObject();
        
    }
    async encontrarPorId(id) {
        return EquipoModel.findOne({codigo}).lean();
    }
}