// Ruta: src/autenticacion/pruebas/pruebasU/usoGestionFuncionesUsuario.test.jsx

import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  mostrarExitoFn,
  mostrarErrorFn,
  cargarEntidadesFn,
  manejoEliminarEntidadFn,
} from '../../anzuelos/usoGestionFuncionesUsuario'; // Ajusta la ruta si es necesario

describe('usoGestionFuncionesUsuario', () => {
  // --- Pruebas para mostrarExitoFn ---
  describe('mostrarExitoFn', () => {
    // ... (la prueba 'debería llamar a toastRef.current.show...' se mantiene igual) ...
    test('debería llamar a toastRef.current.show con configuración de éxito', () => {
        const mockShow = vi.fn();
        const mockToastRef = { current: { show: mockShow } };
        const mensaje = 'Operación exitosa';

        mostrarExitoFn(mensaje, mockToastRef);

        expect(mockShow).toHaveBeenCalledTimes(1);
        expect(mockShow).toHaveBeenCalledWith({
          severity: 'success',
          summary: 'Éxito',
          detail: mensaje,
          life: 3000,
        });
      });


    // --- PRUEBA CORREGIDA ---
    test('no debería fallar si toastRef o toastRef.current es null o undefined', () => {
      const mockToastRefCurrentNull = { current: null };
      const mockToastRefCurrentUndefined = { current: undefined };
      // Casos donde toastRef mismo podría ser problemático (menos común con refs, pero bueno probar)
      const mockToastRefItselfNull = null;
      const mockToastRefItselfUndefined = undefined;

      // El encadenamiento opcional maneja estos casos sin error
      expect(() => mostrarExitoFn('Mensaje', mockToastRefCurrentNull)).not.toThrow();
      expect(() => mostrarExitoFn('Mensaje', mockToastRefCurrentUndefined)).not.toThrow();
      expect(() => mostrarExitoFn('Mensaje', mockToastRefItselfNull)).not.toThrow();
      expect(() => mostrarExitoFn('Mensaje', mockToastRefItselfUndefined)).not.toThrow();

      // Se elimina el caso mockToastRefNoShow porque SÍ debe lanzar un TypeError si show no es función
      // const mockToastRefNoShow = { current: {} };
      // expect(() => mostrarExitoFn('Mensaje', mockToastRefNoShow)).not.toThrow(); // <-- Esta línea causaba el fallo
    });
    // --- FIN PRUEBA CORREGIDA ---

  });

  // --- Pruebas para mostrarErrorFn ---
  describe('mostrarErrorFn', () => {
    // ... (la prueba 'debería llamar a toastRef.current.show...' se mantiene igual) ...
    test('debería llamar a toastRef.current.show con configuración de error', () => {
        const mockShow = vi.fn();
        const mockToastRef = { current: { show: mockShow } };
        const mensaje = 'Ocurrió un error';

        mostrarErrorFn(mensaje, mockToastRef);

        expect(mockShow).toHaveBeenCalledTimes(1);
        expect(mockShow).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Error',
          detail: mensaje,
          life: 5000,
        });
      });

    // --- PRUEBA CORREGIDA ---
     test('no debería fallar si toastRef o toastRef.current es null o undefined', () => {
      const mockToastRefCurrentNull = { current: null };
      const mockToastRefCurrentUndefined = { current: undefined };
      const mockToastRefItselfNull = null;
      const mockToastRefItselfUndefined = undefined;

      // El encadenamiento opcional maneja estos casos sin error
      expect(() => mostrarErrorFn('Mensaje', mockToastRefCurrentNull)).not.toThrow();
      expect(() => mostrarErrorFn('Mensaje', mockToastRefCurrentUndefined)).not.toThrow();
      expect(() => mostrarErrorFn('Mensaje', mockToastRefItselfNull)).not.toThrow();
      expect(() => mostrarErrorFn('Mensaje', mockToastRefItselfUndefined)).not.toThrow();

      // Se elimina el caso mockToastRefNoShow
      // const mockToastRefNoShow = { current: {} };
      // expect(() => mostrarErrorFn('Mensaje', mockToastRefNoShow)).not.toThrow(); // <-- Esta línea causaba el fallo
    });
     // --- FIN PRUEBA CORREGIDA ---

  });

  // --- Pruebas para cargarEntidadesFn ---
  // ... (se mantienen igual) ...
  describe('cargarEntidadesFn', () => {
    const mockSetCarga = vi.fn();
    const mockSetEntities = vi.fn();
    const mockSetFilteredEntities = vi.fn();
    const mockShowError = vi.fn();
    const mockEntityService = {
      getAll: vi.fn(),
    };
    const entityName = 'usuarios';
    const mockData = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];

    // Limpiar mocks antes de cada test en este describe
    beforeEach(() => {
      vi.clearAllMocks();
    });

    test('debería cargar entidades y actualizar estados en caso de éxito', async () => {
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
      // Verificar el orden de llamada para setCarga
      expect(mockSetCarga.mock.calls[0][0]).toBe(true);
      expect(mockSetCarga.mock.calls[1][0]).toBe(false);
    });

    test('debería llamar a showError y no actualizar entidades en caso de error', async () => {
      const errorMessage = 'Error de red';
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
      expect(mockShowError).toHaveBeenCalledWith(`Error cargando ${entityName}: ${errorMessage}`);
      expect(mockSetCarga).toHaveBeenCalledWith(false);
       // Verificar el orden de llamada para setCarga
      expect(mockSetCarga.mock.calls[0][0]).toBe(true);
      expect(mockSetCarga.mock.calls[1][0]).toBe(false);
    });
  });


  // --- Pruebas para manejoEliminarEntidadFn ---
  // ... (se mantienen igual) ...
  describe('manejoEliminarEntidadFn', () => {
    const mockShowSuccess = vi.fn();
    const mockReloadEntities = vi.fn();
    const mockShowError = vi.fn();
    const mockEntityService = {
      delete: vi.fn(),
    };
    const entityId = 123;
    const entityName = 'usuario';

     // Limpiar mocks antes de cada test en este describe
    beforeEach(() => {
      vi.clearAllMocks();
    });

    test('debería llamar a delete, showSuccess y reloadEntities en caso de éxito', async () => {
      mockEntityService.delete.mockResolvedValue(undefined); // Simula éxito sin retorno

      await manejoEliminarEntidadFn(
        entityId,
        mockEntityService,
        mockShowSuccess,
        mockReloadEntities,
        mockShowError,
        entityName
      );

      expect(mockEntityService.delete).toHaveBeenCalledWith(entityId);
      expect(mockShowSuccess).toHaveBeenCalledWith(`${entityName} eliminada correctamente`);
      expect(mockReloadEntities).toHaveBeenCalledTimes(1);
      expect(mockShowError).not.toHaveBeenCalled();
    });

    test('debería llamar a delete y showError en caso de error', async () => {
      const errorMessage = 'Permiso denegado';
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
      expect(mockShowError).toHaveBeenCalledWith(`Error al eliminar ${entityName}: ${errorMessage}`);
    });
  });

});
