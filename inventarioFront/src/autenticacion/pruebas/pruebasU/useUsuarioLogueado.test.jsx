import { describe, test, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import { ContextoAutenticacion } from "../../contexto/ContextoAutenticacion";
import { useUsuarioLogueado } from "../../contexto/UsuarioLogueado";

describe("Hook: useUsuarioLogueado", () => {
  test("debería lanzar un error si se usa fuera de un ProveedorAutenticacion", () => {
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => renderHook(() => useUsuarioLogueado())).toThrow(
      "useUsuarioLogueado debe usarse dentro de un ProveedorAutenticacion."
    );

    console.error = originalError;
  });

  test("debería devolver el objeto usuario del contexto cuando se usa dentro de un ProveedorAutenticacion", () => {
    const mockUsuario = {
      id: "123",
      nombre: "Usuario de Prueba",
      rol: "admin",
    };
    const mockContextValue = {
      usuario: mockUsuario,
    };

    const wrapper = ({ children }) => (
      <ContextoAutenticacion.Provider value={mockContextValue}>
        {children}
      </ContextoAutenticacion.Provider>
    );

    const { result } = renderHook(() => useUsuarioLogueado(), { wrapper });

    expect(result.current).toEqual(mockUsuario);
  });

  test('debería devolver undefined si el valor del contexto no tiene la propiedad "usuario"', () => {
    const mockContextValueSinUsuario = {
      algunOtroDato: "valor",
    };

    const wrapper = ({ children }) => (
      <ContextoAutenticacion.Provider value={mockContextValueSinUsuario}>
        {children}
      </ContextoAutenticacion.Provider>
    );

    const { result } = renderHook(() => useUsuarioLogueado(), { wrapper });

    expect(result.current).toBeUndefined();
  });
});
