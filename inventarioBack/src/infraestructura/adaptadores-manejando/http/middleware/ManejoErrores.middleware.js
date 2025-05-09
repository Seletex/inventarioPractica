export function manejadorGlobalDeErrores(err, req, res, next) {
  console.error("ERROR DETECTADO:", err.stack || err);

  const statusCode = err.statusCode || 500;
  const mensaje = err.message || "Ocurrió un error interno en el servidor.";

  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    mensaje = "Ocurrió un error inesperado.";
  }

  res.status(statusCode).json({
    estado: "error",
    mensaje: mensaje,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }), // Opcional: stack en desarrollo
  });
}
