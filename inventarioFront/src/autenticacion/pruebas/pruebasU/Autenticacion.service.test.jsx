import { describe, test, expect, vi, beforeEach } from "vitest";

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
globalThis.localStorage = localStorageMock;

vi.mock("axios", () => {
  const mockAxiosInstance = {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),

    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  };
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),

      get: mockAxiosInstance.get,
      post: mockAxiosInstance.post,
      put: mockAxiosInstance.put,
      delete: mockAxiosInstance.delete,
      interceptors: mockAxiosInstance.interceptors,
    },
  };
});

import axios from "axios";
import {
  loginUsuario,
  registrarUsuario,
  verificarSesion,
  logoutUsuario,
} from "../../../servicios/Autenticacion.service";

describe("Autenticacion.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe("loginUsuario", () => {
    test("debería llamar a axios.post con /auth/login y las credenciales", async () => {
      const correo = "test@test.com";
      const contraseña = "password";
      const mockResponse = { token: "fake-token", usuario: { id: 1 } };
      axios.post.mockResolvedValue({ data: mockResponse });

      const resultado = await loginUsuario(correo, contraseña);

      expect(axios.post).toHaveBeenCalledTimes(1);

      expect(axios.post).toHaveBeenCalledWith("/auth/login", {
        correo,
        contraseña,
      });
      expect(resultado).toEqual(mockResponse);
    });

    test("debería lanzar un error si la llamada API falla", async () => {
      const correo = "test@test.com";
      const contraseña = "password";
      const errorMessage = "Credenciales inválidas";
      axios.post.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await expect(loginUsuario(correo, contraseña)).rejects.toThrow(
        errorMessage
      );

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith("/auth/login", {
        correo,
        contraseña,
      });
    });

    test("debería lanzar un error genérico si el error de API no tiene mensaje", async () => {
      const correo = "test@test.com";
      const contraseña = "password";
      axios.post.mockRejectedValue(new Error("Network Error"));

      await expect(loginUsuario(correo, contraseña)).rejects.toThrow(
        "Error al iniciar sesión"
      );

      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  describe("registrarUsuario", () => {
    test("debería llamar a axios.post con /auth/register y los datos", async () => {
      const datosRegistro = {
        nombre: "Nuevo",
        correo: "nuevo@test.com",
        contraseña: "pass",
      };
      const mockResponse = { id: 2, ...datosRegistro };
      axios.post.mockResolvedValue({ data: mockResponse });

      const resultado = await registrarUsuario(datosRegistro);

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith("/auth/register", datosRegistro);
      expect(resultado).toEqual(mockResponse);
    });

    test("debería lanzar un error si el registro falla", async () => {
      const datosRegistro = {
        nombre: "Nuevo",
        correo: "nuevo@test.com",
        contraseña: "pass",
      };
      const errorMessage = "El correo ya existe";
      axios.post.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await expect(registrarUsuario(datosRegistro)).rejects.toThrow(
        errorMessage
      );

      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    test("debería lanzar un error genérico si el error de API no tiene mensaje", async () => {
      const datosRegistro = {
        nombre: "Nuevo",
        correo: "nuevo@test.com",
        contraseña: "pass",
      };
      axios.post.mockRejectedValue(new Error("Network Error"));

      await expect(registrarUsuario(datosRegistro)).rejects.toThrow(
        "Error al registrar usuario"
      );

      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });

  describe("verificarSesion", () => {
    test("debería llamar a axios.get con /auth/verify y el token en cabeceras", async () => {
      const token = "valid-token";
      const mockUsuario = { id: 1, nombre: "Usuario Verificado" };
      axios.get.mockResolvedValue({ data: { usuario: mockUsuario } });

      const resultado = await verificarSesion(token);

      expect(axios.get).toHaveBeenCalledTimes(1);

      expect(axios.get).toHaveBeenCalledWith("/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(resultado).toEqual(mockUsuario);
    });

    test("debería lanzar un error si la verificación falla (axios error)", async () => {
      const token = "invalid-token";
      const axiosError = new Error("Token expirado");
      axios.get.mockRejectedValue(axiosError);

      await expect(verificarSesion(token)).rejects.toThrow(axiosError);

      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });

  describe("logoutUsuario", () => {
    test("debería llamar a axios.post con /auth/logout", async () => {
      axios.post.mockResolvedValue({ data: {} });

      await logoutUsuario();

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith("/auth/logout");
    });

    test("debería lanzar un error si el logout falla", async () => {
      const errorMessage = "Error interno del servidor";
      axios.post.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await expect(logoutUsuario()).rejects.toThrow(errorMessage);

      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    test("debería lanzar un error genérico si el error de API no tiene mensaje", async () => {
      axios.post.mockRejectedValue(new Error("Network Error"));

      await expect(logoutUsuario()).rejects.toThrow("Error al cerrar sesión");

      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });
});
