import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  confirmarCambioEstadoFn,
  cambiarEstadoEquipoFn,
  cargarEquiposFn,
  manejoEliminarFn,
  setMantenimientos,
  registrarRealizacion,
  editarMantenimiento,
  guardarMantenimiento,
  mostrarExitoFn,
  mostrarErrorFn,
} from "../../anzuelos/usoGestionFuncionesEquipo";

describe("usoGestionFuncionesEquipo", () => {
  describe("confirmarCambioEstadoFn", () => {
    const mockCambiarEstadoEquipo = vi.fn();
    const id = 1;
    const nuevoEstado = "Baja";

    let confirmSpy;
    beforeEach(() => {
      vi.clearAllMocks();

      confirmSpy = vi.spyOn(window, "confirm");
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });

    test("debería llamar a cambiarEstadoEquipo si el usuario confirma", () => {
      confirmSpy.mockReturnValue(true);

      confirmarCambioEstadoFn(id, nuevoEstado, mockCambiarEstadoEquipo);

      expect(confirmSpy).toHaveBeenCalledTimes(1);

      expect(confirmSpy).toHaveBeenCalledWith(
        "¿Estás seguro de dar de baja este equipo?"
      );
      expect(mockCambiarEstadoEquipo).toHaveBeenCalledTimes(1);
      expect(mockCambiarEstadoEquipo).toHaveBeenCalledWith(id, nuevoEstado);
    });

    test("no debería llamar a cambiarEstadoEquipo si el usuario cancela", () => {
      confirmSpy.mockReturnValue(false);

      confirmarCambioEstadoFn(id, nuevoEstado, mockCambiarEstadoEquipo);

      expect(confirmSpy).toHaveBeenCalledTimes(1);
      expect(confirmSpy).toHaveBeenCalledWith(
        "¿Estás seguro de dar de baja este equipo?"
      );
      expect(mockCambiarEstadoEquipo).not.toHaveBeenCalled();
    });
  });

  describe("cambiarEstadoEquipoFn", () => {
    const mockMostrarExito = vi.fn();
    const mockCargarEquipos = vi.fn();
    const mockMostrarError = vi.fn();
    const mockEquiposService = { update: vi.fn() };
    const id = 1;
    const nuevoEstado = "Baja";

    const equipos = [
      { id: 1, nombre: "Laptop 1", estado: "Activo" },
      { id: 2, nombre: "Monitor 2", estado: "Activo" },
    ];
    const equipoActualizadoEsperado = {
      id: 1,
      nombre: "Laptop 1",
      estado: "Baja",
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    test("debería actualizar el equipo, mostrar éxito y recargar en caso de éxito", async () => {
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

      expect(mockEquiposService.update).toHaveBeenCalledWith(
        id,
        equipoActualizadoEsperado
      );
      expect(mockMostrarExito).toHaveBeenCalledWith(
        "Equipo dado de baja correctamente"
      );
      expect(mockCargarEquipos).toHaveBeenCalledTimes(1);
      expect(mockMostrarError).not.toHaveBeenCalled();
    });

    test("debería mostrar error si la actualización falla", async () => {
      const errorMessage = "Error de servidor";
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

      expect(mockEquiposService.update).toHaveBeenCalledWith(
        id,
        equipoActualizadoEsperado
      );
      expect(mockMostrarExito).not.toHaveBeenCalled();
      expect(mockCargarEquipos).not.toHaveBeenCalled();
      expect(mockMostrarError).toHaveBeenCalledWith(
        `Error al cambiar estado: ${errorMessage}`
      );
    });

    test("debería llamar a mostrarError y no a update si el equipo no se encuentra", async () => {
      const idNoExistente = 999;

      await cambiarEstadoEquipoFn(
        idNoExistente,
        nuevoEstado,
        equipos,
        mockEquiposService,
        mockMostrarExito,
        mockCargarEquipos,
        mockMostrarError
      );

      expect(mockEquiposService.update).not.toHaveBeenCalled();

      expect(mockMostrarError).toHaveBeenCalledWith(
        `Error: Equipo con ID ${idNoExistente} no encontrado.`
      );

      expect(mockMostrarExito).not.toHaveBeenCalled();
      expect(mockCargarEquipos).not.toHaveBeenCalled();
    });
  });

  describe("cargarEquiposFn", () => {
    const mockAsignarCarga = vi.fn();
    const mockSetEquipos = vi.fn();
    const mockSetEquiposFiltrados = vi.fn();
    const mockMostrarError = vi.fn();
    const mockEquiposService = { getAll: vi.fn() };
    const mockData = [
      { id: 1, tipo: "Laptop" },
      { id: 2, tipo: "Monitor" },
    ];

    beforeEach(() => {
      vi.clearAllMocks();
    });

    test("debería cargar equipos y actualizar estados en caso de éxito", async () => {
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

    test("debería llamar a mostrarError y no actualizar equipos en caso de error", async () => {
      const errorMessage = "Error de conexión";
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

      expect(mockMostrarError).toHaveBeenCalledWith(
        `Error cargando equipos: ${errorMessage}`
      );
      expect(mockAsignarCarga).toHaveBeenCalledWith(false);
      expect(mockAsignarCarga.mock.calls[0][0]).toBe(true);
      expect(mockAsignarCarga.mock.calls[1][0]).toBe(false);
    });
  });

  describe("manejoEliminarFn", () => {
    const mockMostrarExito = vi.fn();
    const mockCargarEquipos = vi.fn();
    const mockMostrarError = vi.fn();
    const mockEquiposService = { delete: vi.fn() };
    const id = 456;

    beforeEach(() => {
      vi.clearAllMocks();
    });

    test("debería llamar a delete, mostrarExito y cargarEquipos en caso de éxito", async () => {
      mockEquiposService.delete.mockResolvedValue(undefined);

      await manejoEliminarFn(
        id,
        mockEquiposService,
        mockMostrarExito,
        mockCargarEquipos,
        mockMostrarError
      );

      expect(mockEquiposService.delete).toHaveBeenCalledWith(id);
      expect(mockMostrarExito).toHaveBeenCalledWith(
        "Equipo eliminado correctamente"
      );
      expect(mockCargarEquipos).toHaveBeenCalledTimes(1);
      expect(mockMostrarError).not.toHaveBeenCalled();
    });

    test("debería llamar a delete y mostrarError en caso de error", async () => {
      const errorMessage = "Equipo no encontrado";
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

      expect(mockMostrarError).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe("setMantenimientos", () => {
    test("debería actualizar el mantenimiento correcto en el array", () => {
      const prev = [
        {
          id: 1,
          tarea: "Limpieza",
          estado: "Pendiente",
          fechaRealizacion: null,
        },
        {
          id: 2,
          tarea: "Revisión",
          estado: "Pendiente",
          fechaRealizacion: null,
        },
        {
          id: 3,
          tarea: "Actualizar",
          estado: "Pendiente",
          fechaRealizacion: null,
        },
      ];
      const idToUpdate = 2;
      const fechaRealizacion = "2024-01-01T10:00:00.000Z";

      const result = setMantenimientos(prev, fechaRealizacion, idToUpdate);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(prev[0]);
      expect(result[1]).toEqual({
        id: 2,
        tarea: "Revisión",
        estado: "Completado",
        fechaRealizacion: fechaRealizacion,
      });
      expect(result[2]).toEqual(prev[2]);
    });

    test("no debería modificar el array si el id no coincide", () => {
      const prev = [
        {
          id: 1,
          tarea: "Limpieza",
          estado: "Pendiente",
          fechaRealizacion: null,
        },
      ];
      const idToUpdate = 99;
      const fechaRealizacion = "2024-01-01T10:00:00.000Z";

      const result = setMantenimientos(prev, fechaRealizacion, idToUpdate);

      expect(result).toEqual(prev);
    });
  });

  describe("registrarRealizacion", () => {
    const mockMostrarExito = vi.fn();
    const mockMostrarError = vi.fn();
    const mockMantenimientosService = { update: vi.fn() };

    const mockSetMantenimientos = vi.fn();
    const id = 1;
    const fechaEsperada = "2024-05-21T12:00:00.000Z";

    beforeEach(() => {
      vi.clearAllMocks();
      vi.useFakeTimers();
      vi.setSystemTime(new Date(fechaEsperada));
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    test("debería llamar a update, setMantenimientos y mostrarExito en caso de éxito", async () => {
      mockMantenimientosService.update.mockResolvedValue(undefined);

      await registrarRealizacion(
        id,
        mockMantenimientosService,
        mockMostrarExito,
        mockMostrarError,
        mockSetMantenimientos
      );

      expect(mockMantenimientosService.update).toHaveBeenCalledWith(id, {
        fechaRealizacion: fechaEsperada,
        estado: "Completado",
      });

      expect(mockSetMantenimientos).toHaveBeenCalledTimes(1);

      expect(mockSetMantenimientos).toHaveBeenCalledWith(expect.any(Function));
      expect(mockMostrarExito).toHaveBeenCalledWith(
        "Mantenimiento registrado correctamente"
      );
      expect(mockMostrarError).not.toHaveBeenCalled();
    });

    test("debería llamar a update y mostrarError en caso de fallo", async () => {
      const errorMessage = "Error al actualizar";
      mockMantenimientosService.update.mockRejectedValue(
        new Error(errorMessage)
      );

      await registrarRealizacion(
        id,
        mockMantenimientosService,
        mockMostrarExito,
        mockMostrarError,
        mockSetMantenimientos
      );

      expect(mockMantenimientosService.update).toHaveBeenCalledWith(id, {
        fechaRealizacion: fechaEsperada,
        estado: "Completado",
      });

      expect(mockSetMantenimientos).not.toHaveBeenCalled();
      expect(mockMostrarExito).not.toHaveBeenCalled();
      expect(mockMostrarError).toHaveBeenCalledWith(
        `Error al registrar: ${errorMessage}`
      );
    });
  });

  describe("editarMantenimiento", () => {
    test("debería llamar a setMantenimientoEditando y setMostrarModal", () => {
      const mockSetMantenimientoEditando = vi.fn();
      const mockSetMostrarModal = vi.fn();
      const mantenimiento = { id: 1, tarea: "Test" };

      editarMantenimiento(
        mantenimiento,
        mockSetMantenimientoEditando,
        mockSetMostrarModal
      );

      expect(mockSetMantenimientoEditando).toHaveBeenCalledWith(mantenimiento);
      expect(mockSetMostrarModal).toHaveBeenCalledWith(true);
    });
  });

  describe("guardarMantenimiento", () => {
    const mockMostrarExito = vi.fn();
    const mockSetMostrarModal = vi.fn();
    const mockSetMantenimientoEditando = vi.fn();
    const mockMostrarError = vi.fn();
    const mockMantenimientosService = { update: vi.fn(), create: vi.fn() };

    const mockSetMantenimientos = vi.fn();
    const formData = { tarea: "Nueva Tarea", equipoId: 1 };
    const mantenimientoEditandoExistente = {
      id: 5,
      tarea: "Tarea Vieja",
      equipoId: 1,
    };
    const nuevoMantenimientoCreado = { ...formData, id: 10 };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    test("debería llamar a update, setMantenimientos y mostrar éxito al actualizar", async () => {
      mockMantenimientosService.update.mockResolvedValue(undefined);

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

      expect(mockMantenimientosService.update).toHaveBeenCalledWith(
        mantenimientoEditandoExistente.id,
        formData
      );
      expect(mockMantenimientosService.create).not.toHaveBeenCalled();

      expect(mockSetMantenimientos).toHaveBeenCalledTimes(1);
      expect(mockSetMantenimientos).toHaveBeenCalledWith(expect.any(Function));
      expect(mockMostrarExito).toHaveBeenCalledWith(
        "Mantenimiento actualizado"
      );
      expect(mockSetMostrarModal).toHaveBeenCalledWith(false);
      expect(mockSetMantenimientoEditando).toHaveBeenCalledWith(null);
      expect(mockMostrarError).not.toHaveBeenCalled();
    });

    test("debería llamar a create, setMantenimientos y mostrar éxito al crear", async () => {
      mockMantenimientosService.create.mockResolvedValue(
        nuevoMantenimientoCreado
      );

      await guardarMantenimiento(
        formData,
        null,
        mockMantenimientosService,
        mockMostrarExito,
        mockSetMostrarModal,
        mockSetMantenimientoEditando,
        mockMostrarError,
        mockSetMantenimientos
      );

      expect(mockMantenimientosService.create).toHaveBeenCalledWith(formData);
      expect(mockMantenimientosService.update).not.toHaveBeenCalled();

      expect(mockSetMantenimientos).toHaveBeenCalledTimes(1);
      expect(mockSetMantenimientos).toHaveBeenCalledWith(expect.any(Function));
      expect(mockMostrarExito).toHaveBeenCalledWith("Mantenimiento creado");
      expect(mockSetMostrarModal).toHaveBeenCalledWith(false);
      expect(mockSetMantenimientoEditando).toHaveBeenCalledWith(null);
      expect(mockMostrarError).not.toHaveBeenCalled();
    });

    test("debería llamar a update y mostrar error si la actualización falla", async () => {
      const errorMessage = "Error al actualizar";
      mockMantenimientosService.update.mockRejectedValue(
        new Error(errorMessage)
      );

      await guardarMantenimiento(
        formData,
        mantenimientoEditandoExistente,
        mockMantenimientosService,
        mockMostrarExito,
        mockSetMostrarModal,
        mockSetMantenimientoEditando,
        mockMostrarError,
        mockSetMantenimientos
      );

      expect(mockMantenimientosService.update).toHaveBeenCalledWith(
        mantenimientoEditandoExistente.id,
        formData
      );

      expect(mockSetMantenimientos).not.toHaveBeenCalled();
      expect(mockMostrarExito).not.toHaveBeenCalled();
      expect(mockSetMostrarModal).not.toHaveBeenCalled();
      expect(mockSetMantenimientoEditando).not.toHaveBeenCalled();
      expect(mockMostrarError).toHaveBeenCalledWith(
        `Error al guardar: ${errorMessage}`
      );
    });

    test("debería llamar a create y mostrar error si la creación falla", async () => {
      const errorMessage = "Error al crear";
      mockMantenimientosService.create.mockRejectedValue(
        new Error(errorMessage)
      );

      await guardarMantenimiento(
        formData,
        null,
        mockMantenimientosService,
        mockMostrarExito,
        mockSetMostrarModal,
        mockSetMantenimientoEditando,
        mockMostrarError,
        mockSetMantenimientos
      );

      expect(mockMantenimientosService.create).toHaveBeenCalledWith(formData);

      expect(mockSetMantenimientos).not.toHaveBeenCalled();
      expect(mockMostrarExito).not.toHaveBeenCalled();
      expect(mockSetMostrarModal).not.toHaveBeenCalled();
      expect(mockSetMantenimientoEditando).not.toHaveBeenCalled();
      expect(mockMostrarError).toHaveBeenCalledWith(
        `Error al guardar: ${errorMessage}`
      );
    });
  });

  describe("mostrarExitoFn (duplicada)", () => {
    test("debería llamar a toastRef.current.show con configuración de éxito", () => {
      const mockShow = vi.fn();
      const mockToastRef = { current: { show: mockShow } };
      mostrarExitoFn("Éxito duplicado", mockToastRef);
      expect(mockShow).toHaveBeenCalledWith({
        severity: "success",
        summary: "Éxito",
        detail: "Éxito duplicado",
        life: 3000,
      });
    });
  });
  describe("mostrarErrorFn (duplicada)", () => {
    test("debería llamar a toastRef.current.show con configuración de error", () => {
      const mockShow = vi.fn();
      const mockToastRef = { current: { show: mockShow } };
      mostrarErrorFn("Error duplicado", mockToastRef);
      expect(mockShow).toHaveBeenCalledWith({
        severity: "error",
        summary: "Error",
        detail: "Error duplicado",
        life: 5000,
      });
    });
  });
});
