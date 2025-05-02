// En tu archivo principal (app.js)
const requiredEnvVars = ["JWT_SECRET", "SALT_ROUNDS"];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Falta la variable de entorno requerida: ${varName}`);
  }
});