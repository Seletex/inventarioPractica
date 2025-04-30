// Archivo: src/autenticacion/pruebas/pruebasU/useUsuarioLogueado.test.jsx
//           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ¡Extensión cambiada!

import React from 'react';
// Asegúrate de importar desde 'vitest' si usas globals: true, o importa explícitamente
import { describe, test, expect, vi } from 'vitest'; // Usar vi en lugar de jest para mocks en Vitest
import { renderHook } from '@testing-library/react';
// Rutas corregidas asumiendo la ubicación del test
import { ContextoAutenticacion } from '../../contexto/ContextoAutenticacion';
import { useUsuarioLogueado } from '../../contexto/UsuarioLogueado'; // Asegúrate que este archivo y ruta existen

// --- Pruebas para useUsuarioLogueado ---

describe('Hook: useUsuarioLogueado', () => {
  // Test 1: Verifica que lanza un error si se usa fuera del proveedor
  test('debería lanzar un error si se usa fuera de un ProveedorAutenticacion', () => {
   
    const originalError = console.error;
    console.error = vi.fn(); // Usar vi.fn() con Vitest

    // renderHook sin un wrapper (sin proveedor)
    expect(() => renderHook(() => useUsuarioLogueado())).toThrow(
      'useUsuarioLogueado debe usarse dentro de un ProveedorAutenticacion.'
    );

    // Restauramos console.error
    console.error = originalError;
  });
 
  // Test 2: Verifica que devuelve el usuario correcto cuando está dentro del proveedor
  test('debería devolver el objeto usuario del contexto cuando se usa dentro de un ProveedorAutenticacion', () => {
    // 1. Preparamos un valor de contexto simulado
    const mockUsuario = { id: '123', nombre: 'Usuario de Prueba', rol: 'admin' };
    const mockContextValue = {
      usuario: mockUsuario,
      // login: vi.fn(), // Si necesitaras mockear otras funciones del contexto
      // logout: vi.fn(),
    };

    // 2. Creamos un componente "Wrapper" que provee el contexto simulado
    const wrapper = ({ children }) => (
      // ¡Esto es JSX! Por eso la extensión .jsx es preferible
      <ContextoAutenticacion.Provider value={mockContextValue}>
        {children}
      </ContextoAutenticacion.Provider>
    );

    // 3. Renderizamos el hook usando el wrapper
    const { result } = renderHook(() => useUsuarioLogueado(), { wrapper });

    // 4. Verificamos que el valor devuelto por el hook sea el objeto usuario esperado
    expect(result.current).toEqual(mockUsuario);
  });

   // Test 3: Verifica qué pasa si el contexto existe pero no tiene la propiedad 'usuario' (caso borde)
   test('debería devolver undefined si el valor del contexto no tiene la propiedad "usuario"', () => {
    // 1. Contexto simulado SIN la propiedad 'usuario'
    const mockContextValueSinUsuario = {
      algunOtroDato: 'valor',
    };

    // 2. Wrapper con el contexto incompleto
    const wrapper = ({ children }) => (
      <ContextoAutenticacion.Provider value={mockContextValueSinUsuario}>
        {children}
      </ContextoAutenticacion.Provider>
    );

    // 3. Renderizamos el hook
    const { result } = renderHook(() => useUsuarioLogueado(), { wrapper });

    // 4. Verificamos que devuelve undefined
    expect(result.current).toBeUndefined();
  });

});
