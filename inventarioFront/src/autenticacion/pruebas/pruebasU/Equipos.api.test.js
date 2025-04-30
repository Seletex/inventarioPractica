// src/autenticacion/pruebas/pruebasU/Equipos.api.test.js
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

// Mockear los módulos (CORREGIDO para apiSwitch)
vi.mock('../../../servicios/apiSwitch', () => {
  const originalApiMode = { MOCK: 'MOCK', REAL: 'REAL' };
  return {
    API_MODE: originalApiMode,
    // Retornar la variable 'currentMode' directamente (con el valor inicial deseado para el mock)
    currentMode: originalApiMode.MOCK,
    // La función mock para poder cambiarla en las pruebas
    getCurrentMode: vi.fn(() => originalApiMode.MOCK)
  };
});
vi.mock('../../../servicios/mockEquipos.api', () => ({
  mockEquiposService: { type: 'mock', getAll: vi.fn() }
}));
vi.mock('../../../servicios/realEquipos.api', () => ({
  realEquiposService: { type: 'real', getAll: vi.fn() }
}));

// Importar DESPUÉS de los mocks
import { equiposService } from '../../../servicios/equipos.api';


describe('equipos.api.js (Service Switch)', () => {

  beforeEach(() => {
     vi.clearAllMocks();
     // Resetear el mock de getCurrentMode si es necesario
     // getCurrentMode.mockReturnValue(API_MODE.MOCK); // O manejarlo en el mock principal
  });

  afterEach(() => {
      vi.restoreAllMocks();
  });

  test('debería exportar mockEquiposService cuando currentMode es MOCK', () => {
    // Verificar el estado inicial del mock (que debe ser MOCK)
    // Nota: 'currentModeFromMock' importado directamente puede no reflejar cambios dinámicos
    // Es más fiable verificar el resultado 'equiposService' que depende de él
    expect(equiposService.type).toBe('mock');
  });

  test('debería exportar realEquiposService cuando currentMode es REAL', async () => {
    // --- CAMBIO IMPORTANTE: ---
    // No podemos cambiar directamente la variable 'currentMode' exportada.
    // El switch en equipos.api.js debe basarse en una función o estado que podamos controlar.
    // Si equipos.api.js usa 'currentMode' directamente, la única forma de probar el cambio
    // es recargando el módulo después de cambiar el mock *antes* de la carga inicial,
    // lo cual es complejo.

    // --- Alternativa 1: Si pudieras refactorizar equipos.api.js ---
    // Si equipos.api.js usara getCurrentMode() en lugar de currentMode:
    // getCurrentMode.mockReturnValue(API_MODE.REAL);
    // const { equiposService: equiposServiceReal } = await import('../../../servicios/equipos.api?t=' + Date.now());
    // expect(equiposServiceReal.type).toBe('real');

    // --- Alternativa 2: Probar el mock (menos ideal pero funciona) ---
    // Dado que no podemos cambiar fácilmente 'currentMode' después de la carga inicial,
    // esta prueba se vuelve menos útil para verificar el *cambio* dinámico.
    // Podemos verificar que si el mock *hubiera* retornado REAL, el resultado sería el esperado.
    // Esto requiere una estructura de mock diferente o aceptar la limitación.

    // --- Prueba Simplificada (verifica la lógica del mock, no el cambio dinámico) ---
     vi.resetModules(); // Limpia el caché de módulos
     vi.doMock('../../../servicios/apiSwitch', () => ({ // Mock específico para este test
        API_MODE: { MOCK: 'MOCK', REAL: 'REAL' },
        currentMode: 'REAL', // Forzar REAL para esta carga
        getCurrentMode: vi.fn(() => 'REAL')
     }));
     // Importar dinámicamente DESPUÉS de configurar el mock específico
     const { equiposService: equiposServiceReal } = await import('../../../servicios/equipos.api?t=' + Date.now());
     expect(equiposServiceReal.type).toBe('real');
     vi.doUnmock('../../../servicios/apiSwitch'); // Limpiar el mock específico

  });

});
