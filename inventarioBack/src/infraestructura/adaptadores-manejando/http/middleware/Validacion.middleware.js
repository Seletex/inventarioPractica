import { z } from "zod"; // Ejemplo con Zod

const crearAsignacionSchema = z
  .object({
    equipoId: z.string().uuid(),
    usuarioId: z.string().uuid().optional(),
    ubicacionId: z.string().uuid().optional(),
    notas: z.string().optional(),
  })
  .refine((data) => data.usuarioId || data.ubicacionId, {
    message: "Se requiere usuarioId o ubicacionId",
    path: ["usuarioId", "ubicacionId"], // Opcional, para indicar campos relacionados
  });

export function validarCrearAsignacion(req, res, next) {
  try {
    crearAsignacionSchema.parse(req.body);
    next();
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Datos de entrada inválidos", errores: error.errors });
  }
}
