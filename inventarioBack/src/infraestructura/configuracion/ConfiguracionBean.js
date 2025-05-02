const UsuarioRepositorio = require("../repositorios/UsuarioRepositorio"); // Ejemplo
const EquipoRepositorio = require("../repositorios/EquipoRepositorio"); // Ejemplo
const UbicacionRepositorio = require("../repositorios/UbicacionRepositorio"); // Ejemplo

const ServicioUsuario = require("../../dominio/servicios/ServicioUsuario"); // Asumiendo que existe
const ServicioTransferenciaEquipo = require("../../dominio/servicios/ServicioTransferenciaEquipo");
const ServicioValidacionInterna = require("../../dominio/servicios/ServicioValidacionInterna");

const ServicioJWT = require("../seguridad/ServicioJWT");
// Importar la función de comparación desde su nueva ubicación
const { compararContraseña } = require("../seguridad/utilidadesContraseña");
// Asumiendo que tienes un ServicioLogin definido en alguna parte
const ServicioLogin = require("../../dominio/servicios/ServicioLogin");
function configurarDependencias() {
  console.log("Configurando dependencias...");
  const usuarioRepositorio = new UsuarioRepositorio(/* config */);
  const equipoRepositorio = new EquipoRepositorio(/* config */);
  const ubicacionRepositorio = new UbicacionRepositorio(/* config */);
  const servicioJWT = new ServicioJWT();
  const servicioValidacionInterna = new ServicioValidacionInterna(
    usuarioRepositorio,
    ubicacionRepositorio,
    equipoRepositorio
  );
  const servicioUsuario = new ServicioUsuario(usuarioRepositorio, servicioJWT);

  const servicioTransferenciaEquipo = new ServicioTransferenciaEquipo(
    usuarioRepositorio,
    equipoRepositorio,
    ubicacionRepositorio, // Necesario para servicioValidacionInterna
    servicioValidacionInterna
  );

  // Asegúrate de que ServicioLogin exista y reciba compararContraseña
  const servicioLogin = new ServicioLogin(
    servicioUsuario,
    servicioJWT,
    compararContraseña
  );

  console.log("Dependencias configuradas.");
  return {
    servicioJWT, // Exportar para usarlo donde se generen tokens
    servicioUsuario,
    servicioTransferenciaEquipo,
    servicioValidacionInterna,
    servicioLogin, // Exportar si se crea
  };
}

module.exports = configurarDependencias();
