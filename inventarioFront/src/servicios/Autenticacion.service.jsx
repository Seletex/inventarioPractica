import axios from 'axios';
import api from './api'; // Asegúrate de que la ruta sea correcta

//const API_URL = import.meta.env.VITE_API_URL; // Cambia esto a la URL de tu API

export const loginUsuario = async (correo, contraseña) => {
    try {
        const response = await api.post(`/auth/login`, correo, contraseña);
        return response.data;
    } catch (error) {
        throw new Error('Error al iniciar sesión',error);
    }
};

export const registrarUsuario = async (datosUsuario) => {
    try {
        const response = await api.post(`/auth/register`, datosUsuario);
        return response.data;
    } catch (error) {
        throw new Error('Error al registrar usuario',error);
    }
};

export const verifyToken = async (token) => {   
    try {
        const response = await axios.get(`/auth/verify-token`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error al verificar token',error);
    }
}
