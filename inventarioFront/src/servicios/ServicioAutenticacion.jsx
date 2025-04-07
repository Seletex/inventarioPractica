import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Cambia esto a la URL de tu API

export const loginUsuario = async (credenciales) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credenciales);
        return response.data;
    } catch (error) {
        throw new Error('Error al iniciar sesión',error);
    }
};

export const registrarUsuario = async (datosRegistro) => {
    try {
        const response = await axios.post(`${API_URL}/register`, datosRegistro);
        return response.data;
    } catch (error) {
        throw new Error('Error al registrar usuario',error);
    }
};

export const verifyToken = async (token) => {   
    try {
        const response = await axios.get(`${API_URL}/verify-token`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error('Error al verificar token',error);
    }
}
