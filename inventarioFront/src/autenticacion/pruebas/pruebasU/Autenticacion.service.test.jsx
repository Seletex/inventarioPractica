// src/autenticacion/pruebas/pruebasU/Autenticacion.service.test.jsx
import { describe, test, expect, vi, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
globalThis.localStorage = localStorageMock;

// Mockear axios explícitamente
vi.mock('axios', () => {
    // Crear mocks para los métodos que usamos
    const mockAxiosInstance = {
      get: vi.fn(() => Promise.resolve({ data: {} })),
      post: vi.fn(() => Promise.resolve({ data: {} })),
      put: vi.fn(() => Promise.resolve({ data: {} })),
      delete: vi.fn(() => Promise.resolve({ data: {} })),
      // ¡Importante! Mockear interceptors para que existan
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn() }
      }
    };
    return {
      // Exportación por defecto (axios)
      default: {
        // Mock de axios.create para que devuelva nuestra instancia mockeada
        create: vi.fn(() => mockAxiosInstance),
        // También exponer los métodos directamente en axios si se usan así
        get: mockAxiosInstance.get,
        post: mockAxiosInstance.post,
        put: mockAxiosInstance.put,
        delete: mockAxiosInstance.delete,
        interceptors: mockAxiosInstance.interceptors,
      },
      // Exportaciones nombradas si axios las tuviera y las usaras (menos común)
      // CanceledError: class CanceledError {},
    };
  });

import axios from 'axios'; // Importará el mock configurado por vi.mock
import {
  loginUsuario,
  registrarUsuario,
  verificarSesion,
  logoutUsuario
} from '../../../servicios/Autenticacion.service'; // Ruta corregida

describe('Autenticacion.service', () => {

  beforeEach(() => {
    // Limpiar mocks de axios antes de cada test
    vi.clearAllMocks();
    localStorageMock.clear();
  
  });

  // --- Pruebas para loginUsuario ---
  describe('loginUsuario', () => {
    test('debería llamar a axios.post con /auth/login y las credenciales', async () => {
      const correo = 'test@test.com';
      const contraseña = 'password';
      const mockResponse = { token: 'fake-token', usuario: { id: 1 } };
      axios.post.mockResolvedValue({ data: mockResponse });

      const resultado = await loginUsuario(correo, contraseña);

      expect(axios.post).toHaveBeenCalledTimes(1);
      // Verifica la llamada al mock global de axios (a través de api.post)
      expect(axios.post).toHaveBeenCalledWith('/auth/login', { correo, contraseña });
      expect(resultado).toEqual(mockResponse);
    });

    test('debería lanzar un error si la llamada API falla', async () => {
      const correo = 'test@test.com';
      const contraseña = 'password';
      const errorMessage = 'Credenciales inválidas';
      axios.post.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await expect(loginUsuario(correo, contraseña))
            .rejects
            .toThrow(errorMessage);

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('/auth/login', { correo, contraseña });
    });

     test('debería lanzar un error genérico si el error de API no tiene mensaje', async () => {
      const correo = 'test@test.com';
      const contraseña = 'password';
      axios.post.mockRejectedValue(new Error('Network Error'));

      await expect(loginUsuario(correo, contraseña))
            .rejects
            .toThrow('Error al iniciar sesión'); // Mensaje genérico del catch

      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  // --- Pruebas para registrarUsuario ---
  describe('registrarUsuario', () => {
     test('debería llamar a axios.post con /auth/register y los datos', async () => {
      const datosRegistro = { nombre: 'Nuevo', correo: 'nuevo@test.com', contraseña: 'pass' };
      const mockResponse = { id: 2, ...datosRegistro };
      axios.post.mockResolvedValue({ data: mockResponse });

      const resultado = await registrarUsuario(datosRegistro);

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('/auth/register', datosRegistro);
      expect(resultado).toEqual(mockResponse);
    });

     test('debería lanzar un error si el registro falla', async () => {
      const datosRegistro = { nombre: 'Nuevo', correo: 'nuevo@test.com', contraseña: 'pass' };
      const errorMessage = 'El correo ya existe';
      axios.post.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await expect(registrarUsuario(datosRegistro))
            .rejects
            .toThrow(errorMessage); // Mensaje específico del error

      expect(axios.post).toHaveBeenCalledTimes(1);
    });

     test('debería lanzar un error genérico si el error de API no tiene mensaje', async () => {
      const datosRegistro = { nombre: 'Nuevo', correo: 'nuevo@test.com', contraseña: 'pass' };
      axios.post.mockRejectedValue(new Error('Network Error'));

      await expect(registrarUsuario(datosRegistro))
            .rejects
            .toThrow('Error al registrar usuario'); // Mensaje genérico del catch

      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  // --- Pruebas para verificarSesion ---
  describe('verificarSesion', () => {
    test('debería llamar a axios.get con /auth/verify y el token en cabeceras', async () => {
      const token = 'valid-token';
      const mockUsuario = { id: 1, nombre: 'Usuario Verificado' };
      axios.get.mockResolvedValue({ data: { usuario: mockUsuario } });

      const resultado = await verificarSesion(token);

      expect(axios.get).toHaveBeenCalledTimes(1);
      // Verifica la llamada al mock global de axios (a través de api.get)
      expect(axios.get).toHaveBeenCalledWith('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(resultado).toEqual(mockUsuario);
    });

    test('debería lanzar un error si la verificación falla (axios error)', async () => {
      const token = 'invalid-token';
      const axiosError = new Error('Token expirado');
      axios.get.mockRejectedValue(axiosError); // Simular error de axios

      // verificarSesion no tiene try/catch, así que debe lanzar el error original
      await expect(verificarSesion(token))
            .rejects
            .toThrow(axiosError); // Espera el error original

      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });

   // --- Pruebas para logoutUsuario ---
  describe('logoutUsuario', () => {
    test('debería llamar a axios.post con /auth/logout', async () => {
      axios.post.mockResolvedValue({ data: {} }); // Logout exitoso

      await logoutUsuario();

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('/auth/logout');
    });

    test('debería lanzar un error si el logout falla', async () => {
      const errorMessage = 'Error interno del servidor';
       axios.post.mockRejectedValue({ response: { data: { message: errorMessage } } });

      await expect(logoutUsuario())
            .rejects
            .toThrow(errorMessage); // Mensaje específico del error

      expect(axios.post).toHaveBeenCalledTimes(1);
    });

     test('debería lanzar un error genérico si el error de API no tiene mensaje', async () => {
       axios.post.mockRejectedValue(new Error('Network Error'));

      await expect(logoutUsuario())
            .rejects
            .toThrow('Error al cerrar sesión'); // Mensaje genérico del catch

      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

});
