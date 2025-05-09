// src/autenticacion/pruebas/pruebasU/Equipos.api.test.js
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../../../servicios/apiSwitch", () => {
  const originalApiMode = { MOCK: "MOCK", REAL: "REAL" };
  return {
    API_MODE: originalApiMode,

    currentMode: originalApiMode.MOCK,

    getCurrentMode: vi.fn(() => originalApiMode.MOCK),
  };
});
vi.mock("../../../servicios/mockEquipos.api", () => ({
  mockEquiposService: { type: "mock", getAll: vi.fn() },
}));
vi.mock("../../../servicios/realEquipos.api", () => ({
  realEquiposService: { type: "real", getAll: vi.fn() },
}));

import { equiposService } from "../../../servicios/equipos.api";

describe("equipos.api.js (Service Switch)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // getCurrentMode.mockReturnValue(API_MODE.MOCK); // O manejarlo en el mock principal
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("debería exportar mockEquiposService cuando currentMode es MOCK", () => {
    expect(equiposService.type).toBe("mock");
  });

  test("debería exportar realEquiposService cuando currentMode es REAL", async () => {
    vi.resetModules();
    vi.doMock("../../../servicios/apiSwitch", () => ({
      API_MODE: { MOCK: "MOCK", REAL: "REAL" },
      currentMode: "REAL",
      getCurrentMode: vi.fn(() => "REAL"),
    }));

    const { equiposService: equiposServiceReal } = await import(
      "../../../servicios/equipos.api?t=" + Date.now()
    );
    expect(equiposServiceReal.type).toBe("real");
    vi.doUnmock("../../../servicios/apiSwitch");
  });
});
