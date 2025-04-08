// infrastructure/server/index.js
import express from 'express';
// Elige el adaptador:
import EquipoRepository from './adapters/MongoEquipoRepository'; 
// import EquipoRepository from './adapters/PostgresEquipoRepository';

const equipoRepository = new EquipoRepository();