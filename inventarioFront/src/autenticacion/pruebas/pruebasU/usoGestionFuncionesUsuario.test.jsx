import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  mostrarExitoFn,
  mostrarErrorFn,
  cargarEntidadesFn,
  manejoEliminarEntidadFn,
} from "../../anzuelos/usoGestionFuncionesUsuario";

describe("usoGestionFuncionesUsuario", () => {
  describe("mostrarExitoFn", () => {
    test("debería llamar a toastRef.current.show con configuración de éxito", () => {
      const mockShow = vi.fn();
      const mockToastRef = { current: { show: mockShow } };
      const mensaje = "Operación exitosa";

      mostrarExitoFn(mensaje, mockToastRef);

      expect(mockShow).toHaveBeenCalledTimes(1);
      expect(mockShow).toHaveBeenCalledWith({
        severity: "success",
        summary: "Éxito",
        detail: mensaje,
        life: 3000,
      });
    });

    test("no debería fallar si toastRef o toastRef.current es null o undefined", () => {
      const mockToastRefCurrentNull = { current: null };
      const mockToastRefCurrentUndefined = { current: undefined };

      const mockToastRefItselfNull = null;
      const mockToastRefItselfUndefined = undefined;

      expect(() =>
        mostrarExitoFn("Mensaje", mockToastRefCurrentNull)
      ).not.toThrow();
      expect(() =>
        mostrarExitoFn("Mensaje", mockToastRefCurrentUndefined)
      ).not.toThrow();
      expect(() =>
        mostrarExitoFn("Mensaje", mockToastRefItselfNull)
      ).not.toThrow();
      expect(() =>
        mostrarExitoFn("Mensaje", mockToastRefItselfUndefined)
      ).not.toThrow();

      const mockToastRefNoShow = { current: {} };
      expect(() => mostrarExitoFn("Mensaje", mockToastRefNoShow)).not.toThrow();
    });
  });

  describe("mostrarErrorFn", () => {
    test("debería llamar a toastRef.current.show con configuración de error", () => {
      const mockShow = vi.fn();
      const mockToastRef = { current: { show: mockShow } };
      const mensaje = "Ocurrió un error";

      mostrarErrorFn(mensaje, mockToastRef);

      expect(mockShow).toHaveBeenCalledTimes(1);
      expect(mockShow).toHaveBeenCalledWith({
        severity: "error",
        summary: "Error",
        detail: mensaje,
        life: 5000,
      });
    });

    test("no debería fallar si toastRef o toastRef.current es null o undefined", () => {
      const mockToastRefCurrentNull = { current: null };
      const mockToastRefCurrentUndefined = { current: undefined };
      const mockToastRefItselfNull = null;
      const mockToastRefItselfUndefined = undefined;

      expect(() =>
        mostrarErrorFn("Mensaje", mockToastRefCurrentNull)
      ).not.toThrow();
      expect(() =>
        mostrarErrorFn("Mensaje", mockToastRefCurrentUndefined)
      ).not.toThrow();
      expect(() =>
        mostrarErrorFn("Mensaje", mockToastRefItselfNull)
      ).not.toThrow();
      expect(() =>
        mostrarErrorFn("Mensaje", mockToastRefItselfUndefined)
      ).not.toThrow();

      const mockToastRefNoShow = { current: {} };
      expect(() => mostrarErrorFn("Mensaje", mockToastRefNoShow)).not.toThrow(); // <-- Esta línea causaba el fallo
    });
  });

  describe("cargarEntidadesFn", () => {
    const mockSetCarga = vi.fn();
    const mockSetEntities = vi.fn();
    const mockSetFilteredEntities = vi.fn();
    const mockShowError = vi.fn();
    const mockEntityService = {
      getAll: vi.fn(),
    };
    const entityName = "usuarios";
    const mockData = [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
    ];

    beforeEach(() => {
      vi.clearAllMocks();
    });

    test("debería cargar entidades y actualizar estados en caso de éxito", async () => {
      mockEntityService.getAll.mockResolvedValue(mockData);

      await cargarEntidadesFn(
        mockSetCarga,
        mockEntityService,
        mockSetEntities,
        mockSetFilteredEntities,
        mockShowError,
        entityName
      );

      expect(mockSetCarga).toHaveBeenCalledWith(true);
      expect(mockEntityService.getAll).toHaveBeenCalledTimes(1);
      expect(mockSetEntities).toHaveBeenCalledWith(mockData);
      expect(mockSetFilteredEntities).toHaveBeenCalledWith(mockData);
      expect(mockShowError).not.toHaveBeenCalled();
      expect(mockSetCarga).toHaveBeenCalledWith(false);

      expect(mockSetCarga.mock.calls[0][0]).toBe(true);
      expect(mockSetCarga.mock.calls[1][0]).toBe(false);
    });

    test("debería llamar a showError y no actualizar entidades en caso de error", async () => {
      const errorMessage = "Error de red";
      mockEntityService.getAll.mockRejectedValue(new Error(errorMessage));

      await cargarEntidadesFn(
        mockSetCarga,
        mockEntityService,
        mockSetEntities,
        mockSetFilteredEntities,
        mockShowError,
        entityName
      );

      expect(mockSetCarga).toHaveBeenCalledWith(true);
      expect(mockEntityService.getAll).toHaveBeenCalledTimes(1);
      expect(mockSetEntities).not.toHaveBeenCalled();
      expect(mockSetFilteredEntities).not.toHaveBeenCalled();
      expect(mockShowError).toHaveBeenCalledWith(
        `Error cargando ${entityName}: ${errorMessage}`
      );
      expect(mockSetCarga).toHaveBeenCalledWith(false);

      expect(mockSetCarga.mock.calls[0][0]).toBe(true);
      expect(mockSetCarga.mock.calls[1][0]).toBe(false);
    });
  });

  describe("manejoEliminarEntidadFn", () => {
    const mockShowSuccess = vi.fn();
    const mockReloadEntities = vi.fn();
    const mockShowError = vi.fn();
    const mockEntityService = {
      delete: vi.fn(),
    };
    const entityId = 123;
    const entityName = "usuario";

    beforeEach(() => {
      vi.clearAllMocks();
    });

    test("debería llamar a delete, showSuccess y reloadEntities en caso de éxito", async () => {
      mockEntityService.delete.mockResolvedValue(undefined);

      await manejoEliminarEntidadFn(
        entityId,
        mockEntityService,
        mockShowSuccess,
        mockReloadEntities,
        mockShowError,
        entityName
      );

      expect(mockEntityService.delete).toHaveBeenCalledWith(entityId);
      expect(mockShowSuccess).toHaveBeenCalledWith(
        `${entityName} eliminada correctamente`
      );
      expect(mockReloadEntities).toHaveBeenCalledTimes(1);
      expect(mockShowError).not.toHaveBeenCalled();
    });

    test("debería llamar a delete y showError en caso de error", async () => {
      const errorMessage = "Permiso denegado";
      mockEntityService.delete.mockRejectedValue(new Error(errorMessage));

      await manejoEliminarEntidadFn(
        entityId,
        mockEntityService,
        mockShowSuccess,
        mockReloadEntities,
        mockShowError,
        entityName
      );

      expect(mockEntityService.delete).toHaveBeenCalledWith(entityId);
      expect(mockShowSuccess).not.toHaveBeenCalled();
      expect(mockReloadEntities).not.toHaveBeenCalled();
      expect(mockShowError).toHaveBeenCalledWith(
        `Error al eliminar ${entityName}: ${errorMessage}`
      );
    });
  });
});
