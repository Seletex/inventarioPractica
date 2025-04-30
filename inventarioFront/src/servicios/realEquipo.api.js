// src/servicios/realEquipos.api.js

import api from './api'; // Importar la instancia configurada de Axios

// Funciones para interactuar con la API real de equipos

const getAll = async () => {
  try {
    console.log("Llamando a API REAL: GET /equipos"); // Log para depuración
    const response = await api.get('/equipos');
    return response.data;
  } catch (error) {
    console.error("Error en realEquiposService.getAll:", error);
    // Re-lanzar el error para que el llamador lo maneje o lanzar uno más específico
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

// Nota: Tu código actual usa PUT para dar de baja, podrías considerar usar DELETE
const deleteEquipo = async (id) => {
  try {
    console.log(`Llamando a API REAL: DELETE /equipos/${id}`);
    // Si usaras DELETE:
    // await api.delete(`/equipos/${id}`);
    // Si mantienes PUT para dar de baja (como en Api.js):
    await api.put(`/equipos/${id}`); // Asumiendo que PUT sin body significa dar de baja
    return true; // Indicar éxito
  } catch (error) {
    console.error(`Error en realEquiposService.deleteEquipo(${id}):`, error);
    throw new Error(error.response?.data?.message || `Error al eliminar/dar de baja el equipo ${id}`);
  }
};


// Exportar las funciones dentro de un objeto, como se espera en equipos.api.js
export const realEquiposService = {
  type: 'real', // Para diferenciarlo en las pruebas
  getAll,
  getById, // Asegúrate de exportar todas las funciones que uses
  create,
  update,
  delete: deleteEquipo, // Exportar la función de eliminar/dar de baja
};
