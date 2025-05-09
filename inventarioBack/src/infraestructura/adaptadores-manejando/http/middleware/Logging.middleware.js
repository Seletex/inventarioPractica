export function loggerDePeticiones(req, res, next) {
  const inicio = Date.now();
  res.on("finish", () => {
    // Se ejecuta cuando la respuesta se ha enviado
    const duracion = Date.now() - inicio;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duracion}ms`
    );
  });
  next();
}

