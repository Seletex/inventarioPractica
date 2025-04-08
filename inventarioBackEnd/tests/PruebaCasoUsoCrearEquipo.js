import CrearEquipo from "../aplicacion/casos-uso/CrearEquipo";
import { Equipo } from "../domain/entidades/Equipo";

describe('CrearEquipo', () => {
    it('Debe fallar si el código ya existe', async () => {
      const mockRepo = {
        buscarPorPlaca: jest.fn().mockResolvedValue(new Equipo({ placa: 'EQ-001' })),
        guardar: jest.fn()
      };
  
      const casoUso = new CrearEquipo(mockRepo);
      await expect(casoUso.execute({ placa: 'EQ-001' }))
        .rejects
        .toThrow('El código ya existe');
    });
  });
