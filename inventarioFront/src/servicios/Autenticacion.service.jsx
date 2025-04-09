
import api from './api'; // Asegúrate de que la ruta sea correcta

//const API_URL = import.meta.env.VITE_API_URL; // Cambia esto a la URL de tu API

export const loginUsuario = async (correo, contraseña) => {
    try {
      const response = await api.post('/auth/login', { correo, contraseña });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };
  export const registrarUsuario = async (datos) => {
    try {
      const response = await api.post('/auth/register', datos);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  };
  export const verificarSesion = async (token) => {
    const response = await api.get('/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.usuario;
  };