import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Cambia esto a la URL de tu API
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const obtenerEquipos = () => api.get('/equipos');
export const obtenerEquipoPorPlaca = (id) => api.get(`/equipos/${id}`);
export const crearEquipo = (datos) => api.post('/equipos', datos);
export const darDeBajaEquipo = (id) => api.put(`/equipos/${id}`);
export const actualizarEquipo = (id, datos) => api.put(`/equipos/${id}`, datos);