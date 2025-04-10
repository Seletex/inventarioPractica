import api from './api';

export const equiposService = {
  async obtenerTodo() {
    try {
      const response = await api.get('/equipos');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener equipos', error);
    }
  },
  
  async obtenerEquipoPorPlaca(id) {
    try {
      const response = await api.get(`/equipos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener equipo',error);
    }
  },
  
  async crear(equipo) {
    try {
      const response = await api.post('/equipos', equipo);
      return response.data;
    } catch (error) {
      throw new Error('Error al crear equipo', error);
    }
  },
  
  async actualizar(id, equipo) {
    try {
      const response = await api.put(`/equipos/${id}`, equipo);
      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar equipo', error);
    }
  },
  
  async darDeBaja(id) {
    try {
      const response = await api.delete(`/equipos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al eliminar equipo', error);
    }
  },
  
  async buscar(filtro) {
    try {
      const response = await api.get('/equipos/buscar', { params: { filtro } });
      return response.data;
    } catch (error) {
      throw new Error('Error al buscar equipos', error);
    }
  }
};