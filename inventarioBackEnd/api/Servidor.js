import express from 'express';
import { conectarMongoDB } from '../infraestructura/configuracion/ConectarMongoDB';
import MongoEquipoRepositorio from '../infraestructura/adaptadores/db/MongoEquipoRepositorio';
import EmisorEventos from 'events';
import EquipoControlador from './controladores/EquipoControlador';

await conectarMongoDB();

const equipoRepositorio = new MongoEquipoRepositorio();
const editorEventos = new EmisorEventos();
const equipoControlador = new EquipoControlador(equipoRepositorio, editorEventos);

const app = express();
app.use(express.json());
app.post('/equipos', (req, res) => equipoControlador.crear(req, res));
app.listen(3000,() => console.log('Servidor en http://localhost:3000'));
