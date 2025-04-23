import { rest } from 'msw';

export const manipuladoras = [
  rest.get('/api/equipos', (req, res, ctx) => {
    return res(
      ctx.delay(150),
      ctx.json([
        {
          id: 1,
          placa: '122',
          marca: 'Lenovo',
          // ... resto de campos
        }
      ])
    );
  })
];