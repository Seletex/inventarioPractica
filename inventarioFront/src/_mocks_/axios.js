// src/__mocks__/axios.js
import { vi } from 'vitest';

// Creamos un objeto mock con los métodos que usamos (get, post, put, delete, etc.)
const mockAxios = {
  get: vi.fn(() => Promise.resolve({ data: {} })), // Por defecto, resuelve con data vacía
  post: vi.fn(() => Promise.resolve({ data: {} })),
  put: vi.fn(() => Promise.resolve({ data: {} })),
  delete: vi.fn(() => Promise.resolve({ data: {} })),
  create: vi.fn(function () { // Mock para axios.create
    // Devuelve el mismo mock para que las llamadas a api.get, api.post usen nuestros mocks
    return this;
  }),
  interceptors: { // Mockear interceptors para que no fallen
    request: { use: vi.fn(), eject: vi.fn() },
    response: { use: vi.fn(), eject: vi.fn() }
  }
};

export default mockAxios;
