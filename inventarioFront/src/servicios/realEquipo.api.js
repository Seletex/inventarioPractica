// src/servicios/realEquipos.api.js

import api from './api'; 



const getAll = async () => {
  try {
    console.log("Llamando a API REAL: GET /equipos");
    const response = await api.get('/equipos');
    return response.data;
  } catch (error) {
    console.error("Error en realEquiposService.getAll:", error);
 
    throw new Error(error.response?.data?.message || 'Error al obtener equipos');
  }
};

const getById = async (id) => {
  try {
    console.log(`Llamando a API REAL: GET /equipos/${id}`);
    const response = await api.get(`/equipos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error en realEquiposService.getById(${id}):`, error);
    throw new Error(error.response?.data?.message || `Error al obtener el equipo ${id}`);
  }
};

const create = async (datosEquipo) => {
  try {
    console.log("Llamando a API REAL: POST /equipos", datosEquipo);
    const response = await api.post('/equipos', datosEquipo);
    return response.data;
  } catch (error) {
    console.error("Error en realEquiposService.create:", error);
    throw new Error(error.response?.data?.message || 'Error al crear el equipo');
  }
};

const update = async (id, datosEquipo) => {
  try {
    console.log(`Llamando a API REAL: PUT /equipos/${id}`, datosEquipo);
    const response = await api.put(`/equipos/${id}`, datosEquipo);
    return response.data; // O simplemente retornar éxito si la API no devuelve el objeto actualizado
  } catch (error) {
    console.error(`Error en realEquiposService.update(${id}):`, error);
    throw new Error(error.response?.data?.message || `Error al actualizar el equipo ${id}`);
  }
};


const deleteEquipo = async (id) => {
  try {
    console.log(`Llamando a API REAL: DELETE /equipos/${id}`);

    await api.put(`/equipos/${id}`); 
    return true; 
  } catch (error) {
    console.error(`Error en realEquiposService.deleteEquipo(${id}):`, error);
    throw new Error(error.response?.data?.message || `Error al eliminar/dar de baja el equipo ${id}`);
  }
};



export const realEquiposService = {
  type: 'real', 
  getAll,
  getById, 
  create,
  update,
  delete: deleteEquipo, 
};
