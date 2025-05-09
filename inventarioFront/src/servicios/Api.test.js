import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
} from "vitest";

vi.mock("axios", () => {
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

  return {
    default: {
      // axios.create devuelve la instancia interna que acabamos de crear
      create: vi.fn(() => mockInstanceInternal),

      // get: mockInstanceInternal.get,
      // post: mockInstanceInternal.post,
    },
  };
});

import api, {
  obtenerEquipos,
  crearEquipo,
  obtenerEquipoPorPlaca,
  darDeBajaEquipo,
  actualizarEquipo,
} from "./api";

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
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
    if (api.interceptors.request.use.mock.calls.length > 0) {
      requestInterceptorCallback =
        api.interceptors.request.use.mock.calls[0][0];
    } else {
      console.warn("Interceptor registration not captured in beforeAll.");
    }
  });

  beforeEach(() => {
    api.get.mockClear();
    api.post.mockClear();
    api.put.mockClear();
    api.delete.mockClear();

    if (window.localStorage.__isMock__) {
      localStorageMock.clear();

      localStorageMock.getItem.mockClear();
      localStorageMock.setItem.mockClear();
      localStorageMock.removeItem.mockClear();
      localStorageMock.clear.mockClear();
    } else {
      console.warn("window.localStorage no es el mock esperado en beforeEach");
    }

    api.get.mockResolvedValue({ data: {} });
    api.post.mockResolvedValue({ data: {} });
    api.put.mockResolvedValue({ data: {} });
    api.delete.mockResolvedValue({ data: {} });
  });
  afterEach(() => {});

  test("debe crear instancia de axios y registrar interceptor al cargar", () => {
    expect(api.interceptors.request.use).toHaveBeenCalledTimes(1);
    expect(api.interceptors.request.use).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    );
  });

  test("interceptor callback debe añadir token si existe", () => {
    if (typeof requestInterceptorCallback !== "function") {
      return test.skip("Interceptor callback no capturada.");
    }
    const token = "test-token-123";
    window.localStorage.setItem("token", token);
    const config = { headers: {} };
    const modifiedConfig = requestInterceptorCallback(config);
    expect(modifiedConfig.headers.Authorization).toBe(`Bearer ${token}`);
  });

  test("interceptor callback no debe añadir token si no existe", () => {
    if (typeof requestInterceptorCallback !== "function") {
      return test.skip("Interceptor callback no capturada.");
    }
    window.localStorage.removeItem("token");
    const config = { headers: {} };
    const modifiedConfig = requestInterceptorCallback(config);
    expect(modifiedConfig.headers.Authorization).toBeUndefined();
  });

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
