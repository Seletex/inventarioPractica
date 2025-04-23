import mongoose from "mongoose";

const EquipoEsquema = new mongoose.Schema({
    placa: {type: int, required: true, unique: true},
    marca: {type: String, required: false},
    modelo: {type: String, required: false},
    ubicacion: {type: String,
        enum: ['CM', 'PM', 'OACR', 'AM', 'BM', 'DM', 'SM'],
         required: true},
    estado: {type: Boolean,
        enum: ['activo', 'mantenimiento', 'baja'],
         required: true}},
     {timestamps: true});
export default mongoose.model('Equipo', EquipoEsquema);