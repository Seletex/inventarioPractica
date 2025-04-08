import { Router } from 'express';
import EquipoControlador from '../controladores/EquipoControlador';
import MongoEquipoRepositorio from '../../infraestructura/adaptadores/db/MongoEquipoRepositorio';
import EmisorEventos from 'events';

const router = Router();
const equipoRepositorio = new MongoEquipoRepositorio();
const editorEventos = new EmisorEventos();
const equipoControlador = new EquipoControlador(equipoRepositorio, editorEventos);

router.post('/equipos', (req, res) => equipoControlador.crear(req, res));

export default router;