// Ruta: src/autenticacion/pruebas/pruebasU/usoGestionFuncionesEquipo.test.jsx
// (Asegúrate de que la extensión sea .jsx si usas JSX, o .js si no)

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  confirmarCambioEstadoFn,
  cambiarEstadoEquipoFn,
  cargarEquiposFn,
  manejoEliminarFn,
  setMantenimientos, // Asumiendo que se exporta para probarla directamente
  registrarRealizacion,
  editarMantenimiento,
  guardarMantenimiento,
  // Importar desde el archivo original si ya no están duplicadas
  mostrarExitoFn,
  mostrarErrorFn,
} from '../../anzuelos/usoGestionFuncionesEquipo'; // Ajusta la ruta si es necesario

describe('usoGestionFuncionesEquipo', () => {
  // --- Pruebas para confirmarCambioEstadoFn ---
  describe('confirmarCambioEstadoFn', () => {
    const mockCambiarEstadoEquipo = vi.fn();
    const id = 1;
    const nuevoEstado = 'Baja';

    // Espiar window.confirm
    let confirmSpy;
    beforeEach(() => {
      // Limpiar mocks generales antes de cada test en este describe
      vi.clearAllMocks();
      // Configurar el espía para window.confirm
      confirmSpy = vi.spyOn(window, 'confirm');
    });
    afterEach(() => {
      // Restaurar todos los mocks y espías
      vi.restoreAllMocks();
    });

    test('debería llamar a cambiarEstadoEquipo si el usuario confirma', () => {
      confirmSpy.mockReturnValue(true); // Simular confirmación

      confirmarCambioEstadoFn(id, nuevoEstado, mockCambiarEstadoEquipo);

      expect(confirmSpy).toHaveBeenCalledTimes(1);
      // Ajusta el mensaje si es diferente en tu código real
      expect(confirmSpy).toHaveBeenCalledWith('¿Estás seguro de dar de baja este equipo?');
      expect(mockCambiarEstadoEquipo).toHaveBeenCalledTimes(1);
      expect(mockCambiarEstadoEquipo).toHaveBeenCalledWith(id, nuevoEstado);
    });

    test('no debería llamar a cambiarEstadoEquipo si el usuario cancela', () => {
      confirmSpy.mockReturnValue(false); // Simular cancelación

      confirmarCambioEstadoFn(id, nuevoEstado, mockCambiarEstadoEquipo);

      expect(confirmSpy).toHaveBeenCalledTimes(1);
      expect(confirmSpy).toHaveBeenCalledWith('¿Estás seguro de dar de baja este equipo?');
      expect(mockCambiarEstadoEquipo).not.toHaveBeenCalled();
    });
  });

  // --- Pruebas para cambiarEstadoEquipoFn ---
  describe('cambiarEstadoEquipoFn', () => {
    // Mocks específicos para este grupo de pruebas
    const mockMostrarExito = vi.fn();
    const mockCargarEquipos = vi.fn();
    const mockMostrarError = vi.fn();
    const mockEquiposService = { update: vi.fn() };
    const id = 1;
    const nuevoEstado = 'Baja';
    // Array de equipos de prueba
    const equipos = [
      { id: 1, nombre: 'Laptop 1', estado: 'Activo' },
      { id: 2, nombre: 'Monitor 2', estado: 'Activo' },
    ];
    const equipoActualizadoEsperado = { id: 1, nombre: 'Laptop 1', estado: 'Baja' };

    beforeEach(() => {
      // Limpiar mocks antes de cada test en este describe
      vi.clearAllMocks();
    });

    test('debería actualizar el equipo, mostrar éxito y recargar en caso de éxito', async () => {
      mockEquiposService.update.mockResolvedValue(undefined);

      await cambiarEstadoEquipoFn(
        id,
        nuevoEstado,
        equipos,
        mockEquiposService,
        mockMostrarExito,
        mockCargarEquipos,
        mockMostrarError
      );

      expect(mockEquiposService.update).toHaveBeenCalledWith(id, equipoActualizadoEsperado);
      // Ajusta el mensaje si es diferente en tu código real
      expect(mockMostrarExito).toHaveBeenCalledWith('Equipo dado de baja correctamente');
      expect(mockCargarEquipos).toHaveBeenCalledTimes(1);
      expect(mockMostrarError).not.toHaveBeenCalled();
    });

    test('debería mostrar error si la actualización falla', async () => {
      const errorMessage = 'Error de servidor';
      mockEquiposService.update.mockRejectedValue(new Error(errorMessage));

      await cambiarEstadoEquipoFn(
        id,
        nuevoEstado,
        equipos,
        mockEquiposService,
        mockMostrarExito,
        mockCargarEquipos,
        mockMostrarError
      );

      expect(mockEquiposService.update).toHaveBeenCalledWith(id, equipoActualizadoEsperado);
      expect(mockMostrarExito).not.toHaveBeenCalled();
      expect(mockCargarEquipos).not.toHaveBeenCalled();
      expect(mockMostrarError).toHaveBeenCalledWith(`Error al cambiar estado: ${errorMessage}`);
    });

    // --- PRUEBA CORREGIDA ---
    test('debería llamar a mostrarError y no a update si el equipo no se encuentra', async () => {
       const idNoExistente = 999;

       await cambiarEstadoEquipoFn(
        idNoExistente,
        nuevoEstado,
        equipos, // El array donde no está el id 999
        mockEquiposService,
        mockMostrarExito,
        mockCargarEquipos,
        mockMostrarError // La función de error que esperamos se llame
      );

       // Verificar que update NO fue llamado
       expect(mockEquiposService.update).not.toHaveBeenCalled();
       // Verificar que mostrarError SÍ fue llamado con el mensaje adecuado
       expect(mockMostrarError).toHaveBeenCalledWith(`Error: Equipo con ID ${idNoExistente} no encontrado.`);
       // Verificar que otras funciones de éxito no fueron llamadas
       expect(mockMostrarExito).not.toHaveBeenCalled();
       expect(mockCargarEquipos).not.toHaveBeenCalled();
    });
    // --- FIN PRUEBA CORREGIDA ---
  });

  // --- Pruebas para cargarEquiposFn ---
  describe('cargarEquiposFn', () => {
    const mockAsignarCarga = vi.fn();
    const mockSetEquipos = vi.fn();
    const mockSetEquiposFiltrados = vi.fn();
    const mockMostrarError = vi.fn();
    const mockEquiposService = { getAll: vi.fn() };
    const mockData = [{ id: 1, tipo: 'Laptop' }, { id: 2, tipo: 'Monitor' }];

    beforeEach(() => {
      vi.clearAllMocks();
    });

    test('debería cargar equipos y actualizar estados en caso de éxito', async () => {
      mockEquiposService.getAll.mockResolvedValue(mockData);

      await cargarEquiposFn(
        mockAsignarCarga,
        mockEquiposService,
        mockSetEquipos,
        mockSetEquiposFiltrados,
        mockMostrarError
      );

      expect(mockAsignarCarga).toHaveBeenCalledWith(true);
      expect(mockEquiposService.getAll).toHaveBeenCalledTimes(1);
      expect(mockSetEquipos).toHaveBeenCalledWith(mockData);
      expect(mockSetEquiposFiltrados).toHaveBeenCalledWith(mockData);
      expect(mockMostrarError).not.toHaveBeenCalled();
      expect(mockAsignarCarga).toHaveBeenCalledWith(false);
      expect(mockAsignarCarga.mock.calls[0][0]).toBe(true);
      expect(mockAsignarCarga.mock.calls[1][0]).toBe(false);
    });

     test('debería llamar a mostrarError y no actualizar equipos en caso de error', async () => {
      const errorMessage = 'Error de conexión';
      mockEquiposService.getAll.mockRejectedValue(new Error(errorMessage));

      await cargarEquiposFn(
        mockAsignarCarga,
        mockEquiposService,
        mockSetEquipos,
        mockSetEquiposFiltrados,
        mockMostrarError
      );

      expect(mockAsignarCarga).toHaveBeenCalledWith(true);
      expect(mockEquiposService.getAll).toHaveBeenCalledTimes(1);
      expect(mockSetEquipos).not.toHaveBeenCalled();
      expect(mockSetEquiposFiltrados).not.toHaveBeenCalled();
      // Ajusta el mensaje si es diferente en tu código real
      expect(mockMostrarError).toHaveBeenCalledWith(`Error cargando equipos: ${errorMessage}`);
      expect(mockAsignarCarga).toHaveBeenCalledWith(false);
      expect(mockAsignarCarga.mock.calls[0][0]).toBe(true);
      expect(mockAsignarCarga.mock.calls[1][0]).toBe(false);
    });
  });

  // --- Pruebas para manejoEliminarFn ---
  describe('manejoEliminarFn', () => {
    const mockMostrarExito = vi.fn();
    const mockCargarEquipos = vi.fn();
    const mockMostrarError = vi.fn();
    const mockEquiposService = { delete: vi.fn() };
    const id = 456;

    beforeEach(() => {
      vi.clearAllMocks();
    });

    test('debería llamar a delete, mostrarExito y cargarEquipos en caso de éxito', async () => {
      mockEquiposService.delete.mockResolvedValue(undefined);

      await manejoEliminarFn(
        id,
        mockEquiposService,
        mockMostrarExito,
        mockCargarEquipos,
        mockMostrarError
      );

      expect(mockEquiposService.delete).toHaveBeenCalledWith(id);
      expect(mockMostrarExito).toHaveBeenCalledWith('Equipo eliminado correctamente');
      expect(mockCargarEquipos).toHaveBeenCalledTimes(1);
      expect(mockMostrarError).not.toHaveBeenCalled();
    });

    test('debería llamar a delete y mostrarError en caso de error', async () => {
      const errorMessage = 'Equipo no encontrado';
      mockEquiposService.delete.mockRejectedValue(new Error(errorMessage));

      await manejoEliminarFn(
        id,
        mockEquiposService,
        mockMostrarExito,
        mockCargarEquipos,
        mockMostrarError
      );

      expect(mockEquiposService.delete).toHaveBeenCalledWith(id);
      expect(mockMostrarExito).not.toHaveBeenCalled();
      expect(mockCargarEquipos).not.toHaveBeenCalled();
      // El código original pasa error.message directamente
      expect(mockMostrarError).toHaveBeenCalledWith(errorMessage);
    });
  });

  // --- Pruebas para setMantenimientos (función pura) ---
  describe('setMantenimientos', () => {
    test('debería actualizar el mantenimiento correcto en el array', () => {
      const prev = [
        { id: 1, tarea: 'Limpieza', estado: 'Pendiente', fechaRealizacion: null },
        { id: 2, tarea: 'Revisión', estado: 'Pendiente', fechaRealizacion: null },
        { id: 3, tarea: 'Actualizar', estado: 'Pendiente', fechaRealizacion: null },
      ];
      const idToUpdate = 2;
      const fechaRealizacion = '2024-01-01T10:00:00.000Z';

      // Asumiendo que setMantenimientos se exporta y se puede llamar directamente
      const result = setMantenimientos(prev, fechaRealizacion, idToUpdate);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(prev[0]);
      expect(result[1]).toEqual({
        id: 2,
        tarea: 'Revisión',
        estado: 'Completado',
        fechaRealizacion: fechaRealizacion,
      });
      expect(result[2]).toEqual(prev[2]);
    });

     test('no debería modificar el array si el id no coincide', () => {
      const prev = [
        { id: 1, tarea: 'Limpieza', estado: 'Pendiente', fechaRealizacion: null },
      ];
      const idToUpdate = 99;
      const fechaRealizacion = '2024-01-01T10:00:00.000Z';

      const result = setMantenimientos(prev, fechaRealizacion, idToUpdate);

      expect(result).toEqual(prev);
    });
  });

  // --- Pruebas para registrarRealizacion ---
  describe('registrarRealizacion', () => {
    const mockMostrarExito = vi.fn();
    const mockMostrarError = vi.fn();
    const mockMantenimientosService = { update: vi.fn() };
    // Mock para la función setMantenimientos que AHORA se pasa como argumento
    const mockSetMantenimientos = vi.fn();
    const id = 1;
    const fechaEsperada = '2024-05-21T12:00:00.000Z'; // Fecha fija para la prueba

    // Mockear Date
    beforeEach(() => {
      vi.clearAllMocks();
      vi.useFakeTimers();
      vi.setSystemTime(new Date(fechaEsperada));
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    test('debería llamar a update, setMantenimientos y mostrarExito en caso de éxito', async () => {
      mockMantenimientosService.update.mockResolvedValue(undefined);

      // Llamar a la función refactorizada pasando el mock
      await registrarRealizacion(
        id,
        mockMantenimientosService,
        mockMostrarExito,
        mockMostrarError,
        mockSetMantenimientos // Pasando el mock
      );

      expect(mockMantenimientosService.update).toHaveBeenCalledWith(id, {
        fechaRealizacion: fechaEsperada,
        estado: 'Completado',
      });
      // Verificar que el mock de setMantenimientos fue llamado
      expect(mockSetMantenimientos).toHaveBeenCalledTimes(1);
      // Verificar que se llamó con una función (el actualizador de estado)
      expect(mockSetMantenimientos).toHaveBeenCalledWith(expect.any(Function));
      expect(mockMostrarExito).toHaveBeenCalledWith('Mantenimiento registrado correctamente');
      expect(mockMostrarError).not.toHaveBeenCalled();
    });

    test('debería llamar a update y mostrarError en caso de fallo', async () => {
      const errorMessage = 'Error al actualizar';
      mockMantenimientosService.update.mockRejectedValue(new Error(errorMessage));

      await registrarRealizacion(
        id,
        mockMantenimientosService,
        mockMostrarExito,
        mockMostrarError,
        mockSetMantenimientos // Pasando el mock
      );

      expect(mockMantenimientosService.update).toHaveBeenCalledWith(id, {
        fechaRealizacion: fechaEsperada,
        estado: 'Completado',
      });
      // No se debe llamar al actualizador de estado si la API falla
      expect(mockSetMantenimientos).not.toHaveBeenCalled();
      expect(mockMostrarExito).not.toHaveBeenCalled();
      expect(mockMostrarError).toHaveBeenCalledWith(`Error al registrar: ${errorMessage}`);
    });
  });

  // --- Pruebas para editarMantenimiento ---
  describe('editarMantenimiento', () => {
    test('debería llamar a setMantenimientoEditando y setMostrarModal', () => {
      const mockSetMantenimientoEditando = vi.fn();
      const mockSetMostrarModal = vi.fn();
      const mantenimiento = { id: 1, tarea: 'Test' };

      editarMantenimiento(
        mantenimiento,
        mockSetMantenimientoEditando,
        mockSetMostrarModal
      );

      expect(mockSetMantenimientoEditando).toHaveBeenCalledWith(mantenimiento);
      expect(mockSetMostrarModal).toHaveBeenCalledWith(true);
    });
  });

  // --- Pruebas para guardarMantenimiento ---
  describe('guardarMantenimiento', () => {
    const mockMostrarExito = vi.fn();
    const mockSetMostrarModal = vi.fn();
    const mockSetMantenimientoEditando = vi.fn();
    const mockMostrarError = vi.fn();
    const mockMantenimientosService = { update: vi.fn(), create: vi.fn() };
    // Mock para la función setMantenimientos que AHORA se pasa como argumento
    const mockSetMantenimientos = vi.fn();
    const formData = { tarea: 'Nueva Tarea', equipoId: 1 };
    const mantenimientoEditandoExistente = { id: 5, tarea: 'Tarea Vieja', equipoId: 1 };
    const nuevoMantenimientoCreado = { ...formData, id: 10 }; // Simula respuesta de create

    beforeEach(() => {
      vi.clearAllMocks();
    });

    // Caso: Actualizar Éxito
    test('debería llamar a update, setMantenimientos y mostrar éxito al actualizar', async () => {
      mockMantenimientosService.update.mockResolvedValue(undefined);

      // Llamar a la función refactorizada pasando el mock
      await guardarMantenimiento(
        formData,
        mantenimientoEditandoExistente,
        mockMantenimientosService,
        mockMostrarExito,
        mockSetMostrarModal,
        mockSetMantenimientoEditando,
        mockMostrarError,
        mockSetMantenimientos // Pasando mock
      );

      expect(mockMantenimientosService.update).toHaveBeenCalledWith(mantenimientoEditandoExistente.id, formData);
      expect(mockMantenimientosService.create).not.toHaveBeenCalled();
      // Verificar que el mock de setMantenimientos fue llamado
      expect(mockSetMantenimientos).toHaveBeenCalledTimes(1);
      expect(mockSetMantenimientos).toHaveBeenCalledWith(expect.any(Function));
      expect(mockMostrarExito).toHaveBeenCalledWith('Mantenimiento actualizado');
      expect(mockSetMostrarModal).toHaveBeenCalledWith(false);
      expect(mockSetMantenimientoEditando).toHaveBeenCalledWith(null);
      expect(mockMostrarError).not.toHaveBeenCalled();
    });

    // Caso: Crear Éxito
    test('debería llamar a create, setMantenimientos y mostrar éxito al crear', async () => {
      mockMantenimientosService.create.mockResolvedValue(nuevoMantenimientoCreado);

      // Llamar a la función refactorizada pasando el mock
      await guardarMantenimiento(
        formData,
        null, // Sin mantenimientoEditando (indica crear)
        mockMantenimientosService,
        mockMostrarExito,
        mockSetMostrarModal,
        mockSetMantenimientoEditando,
        mockMostrarError,
        mockSetMantenimientos // Pasando mock
      );

      expect(mockMantenimientosService.create).toHaveBeenCalledWith(formData);
      expect(mockMantenimientosService.update).not.toHaveBeenCalled();
      // Verificar que el mock de setMantenimientos fue llamado
      expect(mockSetMantenimientos).toHaveBeenCalledTimes(1);
      expect(mockSetMantenimientos).toHaveBeenCalledWith(expect.any(Function));
      expect(mockMostrarExito).toHaveBeenCalledWith('Mantenimiento creado');
      expect(mockSetMostrarModal).toHaveBeenCalledWith(false);
      expect(mockSetMantenimientoEditando).toHaveBeenCalledWith(null);
      expect(mockMostrarError).not.toHaveBeenCalled();
    });

    // Caso: Actualizar Error
    test('debería llamar a update y mostrar error si la actualización falla', async () => {
      const errorMessage = 'Error al actualizar';
      mockMantenimientosService.update.mockRejectedValue(new Error(errorMessage));

      await guardarMantenimiento(
        formData,
        mantenimientoEditandoExistente,
        mockMantenimientosService,
        mockMostrarExito,
        mockSetMostrarModal,
        mockSetMantenimientoEditando,
        mockMostrarError,
        mockSetMantenimientos // Pasando mock
      );

      expect(mockMantenimientosService.update).toHaveBeenCalledWith(mantenimientoEditandoExistente.id, formData);
      // No se debe llamar al actualizador de estado si la API falla
      expect(mockSetMantenimientos).not.toHaveBeenCalled();
      expect(mockMostrarExito).not.toHaveBeenCalled();
      expect(mockSetMostrarModal).not.toHaveBeenCalled();
      expect(mockSetMantenimientoEditando).not.toHaveBeenCalled();
      expect(mockMostrarError).toHaveBeenCalledWith(`Error al guardar: ${errorMessage}`);
    });

     // Caso: Crear Error
    test('debería llamar a create y mostrar error si la creación falla', async () => {
      const errorMessage = 'Error al crear';
      mockMantenimientosService.create.mockRejectedValue(new Error(errorMessage));

      await guardarMantenimiento(
        formData,
        null,
        mockMantenimientosService,
        mockMostrarExito,
        mockSetMostrarModal,
        mockSetMantenimientoEditando,
        mockMostrarError,
        mockSetMantenimientos // Pasando mock
      );

      expect(mockMantenimientosService.create).toHaveBeenCalledWith(formData);
      // No se debe llamar al actualizador de estado si la API falla
      expect(mockSetMantenimientos).not.toHaveBeenCalled();
      expect(mockMostrarExito).not.toHaveBeenCalled();
      expect(mockSetMostrarModal).not.toHaveBeenCalled();
      expect(mockSetMantenimientoEditando).not.toHaveBeenCalled();
      expect(mockMostrarError).toHaveBeenCalledWith(`Error al guardar: ${errorMessage}`);
    });
  });

  // --- Pruebas para mostrarExitoFn y mostrarErrorFn (Si aún están duplicadas) ---
  // Si ya eliminaste la duplicación en el archivo .js, puedes borrar estas pruebas de aquí.
  // Si no, mantenlas para probar la copia local.
  describe('mostrarExitoFn (duplicada)', () => {
    test('debería llamar a toastRef.current.show con configuración de éxito', () => {
      const mockShow = vi.fn();
      const mockToastRef = { current: { show: mockShow } };
      mostrarExitoFn('Éxito duplicado', mockToastRef);
      expect(mockShow).toHaveBeenCalledWith({
        severity: 'success', summary: 'Éxito', detail: 'Éxito duplicado', life: 3000,
      });
    });
  });
  describe('mostrarErrorFn (duplicada)', () => {
     test('debería llamar a toastRef.current.show con configuración de error', () => {
      const mockShow = vi.fn();
      const mockToastRef = { current: { show: mockShow } };
      mostrarErrorFn('Error duplicado', mockToastRef);
      expect(mockShow).toHaveBeenCalledWith({
        severity: 'error', summary: 'Error', detail: 'Error duplicado', life: 5000,
      });
    });
  });

});
