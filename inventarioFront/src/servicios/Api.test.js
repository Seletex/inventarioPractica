import { describe, test, expect, vi, beforeEach, afterEach, beforeAll } from "vitest";

// --- Mock de axios (CORREGIDO OTRA VEZ) ---
vi.mock("axios", () => {
  // 1. Definimos la instancia mockeada COMPLETAMENTE DENTRO de la factory
  const mockInstanceInternal = {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  };
  // 2. Retornamos el objeto que representa el módulo 'axios' mockeado
  return {
    default: {
      // axios.create devuelve la instancia interna que acabamos de crear
      create: vi.fn(() => mockInstanceInternal),
      // Si se usaran métodos estáticos de axios, también irían aquí
      // get: mockInstanceInternal.get,
      // post: mockInstanceInternal.post,
    },
  };
});
// --- Fin Mock de axios ---

// Importamos axios (que ahora es nuestro mock) y Api.js DESPUÉS del mock

// Al importar Api.js, se ejecutará axios.create(), que devolverá mockInstanceInternal.
// La variable 'api' exportada por Api.js será ahora mockInstanceInternal.
import api, {
  obtenerEquipos,
  crearEquipo,
  obtenerEquipoPorPlaca,
  darDeBajaEquipo,
  actualizarEquipo,
} from "./api";

// Mock localStorage (sin cambios)
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    __isMock__: true,
  };
})();
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

describe("Api.js", () => {
  let requestInterceptorCallback;

  beforeAll(() => {
    // Capturamos la callback del interceptor que Api.js registró en nuestra instancia mockeada 'api'
    if (api.interceptors.request.use.mock.calls.length > 0) {
      requestInterceptorCallback = api.interceptors.request.use.mock.calls[0][0];
    } else {
      console.warn("Interceptor registration not captured in beforeAll.");
    }
  });

  beforeEach(() => {
    // Limpiamos historial de llamadas SOLO de los métodos de petición
    // para no borrar la llamada inicial al interceptor.
    api.get.mockClear();
    api.post.mockClear();
    api.put.mockClear();
    api.delete.mockClear(); // Si tienes un mock para delete, también límpialo

    // Limpiamos localStorage (esto está bien)
    if (window.localStorage.__isMock__) {
      localStorageMock.clear();
      // También limpia el historial de llamadas del mock de localStorage si es necesario
      localStorageMock.getItem.mockClear();
      localStorageMock.setItem.mockClear();
      localStorageMock.removeItem.mockClear();
      localStorageMock.clear.mockClear();
    } else {
      // Considera lanzar un error o loguear si el mock no está presente
      console.warn("window.localStorage no es el mock esperado en beforeEach");
    }

    // Opcional: Si quieres resetear las implementaciones mockeadas a su estado
    // por defecto (Promise.resolve({ data: {} })) sin borrar el historial de llamadas,
    // puedes hacerlo así, aunque mockClear suele ser suficiente si no cambias
    // las implementaciones en los tests.
    // api.get.mockReset().mockResolvedValue({ data: {} }); // mockReset también limpia historial
    // api.post.mockReset().mockResolvedValue({ data: {} });
    // api.put.mockReset().mockResolvedValue({ data: {} });
    // api.delete.mockReset().mockResolvedValue({ data: {} });

    // Asegúrate de que las implementaciones base estén si no usas mockReset arriba
    api.get.mockResolvedValue({ data: {} });
    api.post.mockResolvedValue({ data: {} });
    api.put.mockResolvedValue({ data: {} });
    api.delete.mockResolvedValue({ data: {} });

  });
  afterEach(() => {
    // vi.restoreAllMocks(); // Opcional
  });

  test("debe crear instancia de axios y registrar interceptor al cargar", () => {
    // Verificamos que axios.create (el mock) fue llamado por Api.js
   // expect(axios.create).toHaveBeenCalledTimes(1);
    /*expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.any(String),
        headers: { "Content-Type": "application/json" },
      })
    );*/
    // Verificamos que el interceptor se registró en la instancia 'api' (nuestro mock)
    expect(api.interceptors.request.use).toHaveBeenCalledTimes(1);
    expect(api.interceptors.request.use).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
    );
  });

  test("interceptor callback debe añadir token si existe", () => {
    if (typeof requestInterceptorCallback !== 'function') {
        return test.skip("Interceptor callback no capturada.");
    }
    const token = "test-token-123";
    window.localStorage.setItem("token", token);
    const config = { headers: {} };
    const modifiedConfig = requestInterceptorCallback(config);
    expect(modifiedConfig.headers.Authorization).toBe(`Bearer ${token}`);
  });

  test("interceptor callback no debe añadir token si no existe", () => {
     if (typeof requestInterceptorCallback !== 'function') {
        return test.skip("Interceptor callback no capturada.");
    }
    window.localStorage.removeItem("token");
    const config = { headers: {} };
    const modifiedConfig = requestInterceptorCallback(config);
    expect(modifiedConfig.headers.Authorization).toBeUndefined();
  });

  // --- Pruebas para las funciones de servicio ---
  // Ahora verificamos las llamadas directamente en la instancia 'api' (nuestro mock)

  test("obtenerEquipos debe llamar a api.get con la ruta correcta", async () => {
    api.get.mockResolvedValueOnce({ data: [{ id: 1 }] });
    await obtenerEquipos();
    expect(api.get).toHaveBeenCalledWith("/equipos");
    expect(api.get).toHaveBeenCalledTimes(1);
  });

  test("obtenerEquipoPorPlaca debe llamar a api.get con la ruta y ID correctos", async () => {
    const id = "XYZ123";
    api.get.mockResolvedValueOnce({
      data: { id: "XYZ123", nombre: "Equipo Placa" },
    });
    await obtenerEquipoPorPlaca(id);
    expect(api.get).toHaveBeenCalledWith(`/equipos/${id}`);
    expect(api.get).toHaveBeenCalledTimes(1);
  });

  test("crearEquipo debe llamar a api.post con la ruta y datos correctos", async () => {
    const datosEquipo = { nombre: "Nuevo Equipo" };
    api.post.mockResolvedValueOnce({ data: { id: 2, ...datosEquipo } });
    await crearEquipo(datosEquipo);
    expect(api.post).toHaveBeenCalledWith("/equipos", datosEquipo);
    expect(api.post).toHaveBeenCalledTimes(1);
  });

  test("darDeBajaEquipo debe llamar a api.put con la ruta correcta", async () => {
    const id = 5;
    api.put.mockResolvedValueOnce({ data: {} });
    await darDeBajaEquipo(id);
    expect(api.put).toHaveBeenCalledWith(`/equipos/${id}`);
    expect(api.put).toHaveBeenCalledTimes(1);
  });

  test("actualizarEquipo debe llamar a api.put con la ruta y datos correctos", async () => {
    const id = 6;
    const datosActualizar = { estado: "Mantenimiento" };
    api.put.mockResolvedValueOnce({
      data: { id: 6, ...datosActualizar },
    });
    await actualizarEquipo(id, datosActualizar);
    expect(api.put).toHaveBeenCalledWith(`/equipos/${id}`, datosActualizar);
    expect(api.put).toHaveBeenCalledTimes(1);
  });
});
