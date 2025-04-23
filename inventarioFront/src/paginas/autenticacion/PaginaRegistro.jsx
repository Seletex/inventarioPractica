import { useState, useMemo } from "react"; // Importa useMemo
import { Link } from "react-router-dom";
import Entrada from "../../componentes/InterfazUsuario/Entrada";
import Boton from "../../componentes/InterfazUsuario/Boton";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
// Importa tanto ROLES como rolUsuarioArray
import { ROLES, rolUsuarioArray } from "../../componentes/Datos/RolUsuario";
// Si usas un componente Select estilizado, impórtalo aquí

export default function PaginaRegistro() {
  // Usar useMemo para filtrar los roles una vez.
  // Filtramos para incluir solo los roles que quieres que sean seleccionables en el registro.
  // Excluir la opción por defecto (value: "") y roles como ADMIN.
  const rolesSeleccionablesParaRegistro = useMemo(() => {
    return rolUsuarioArray.filter(rol =>
      // Excluir la opción por defecto
      rol.value !== "" &&
      // Excluir roles que no deberían ser registrados por un usuario normal
      // Por ejemplo, excluir ADMIN y ADMINISTRATIVO
      rol.value !== ROLES.ADMIN // && rol.value !== ROLES.ADMINISTRATIVO // Descomenta si Usuario Administrativo tampoco debe registrarse
    );
  }, [rolUsuarioArray, ROLES]); // Dependencias: si los datos de roles o ROLES cambian

  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    confirmarContraseña: "",
    // CAMBIO: Inicializar el rol a vacío para que la opción "Seleccione rol" esté seleccionada por defecto
    rol: ""
  });
  const [error] = useState(""); // Considera usar setError y actualizarlo en la lógica de validación/envío

   // Función para manejar el envío del formulario (debes agregarla)
   const manejarEnvio = (e) => {
       e.preventDefault();
       // Aquí agregarías la lógica de validación y envío de datos
       console.log("Formulario enviado:", formulario);
       // Validaciones adicionales:
       if (formulario.contraseña !== formulario.confirmarContraseña) {
           // setError("Las contraseñas no coinciden."); // Necesitas un setError
           console.error("Las contraseñas no coinciden.");
           return;
       }
       if (!formulario.rol) {
            // setError("Debes seleccionar un rol."); // Necesitas un setError
            console.error("Debes seleccionar un rol.");
            return;
       }
       // Si todo es válido, procede con el envío a tu API
       // console.log("Datos listos para enviar:", formulario);
       // try {
       //     await tuServicioDeRegistro.registrarUsuario(formulario);
       //     // Mostrar mensaje de éxito y redirigir
       //     console.log("Registro exitoso!");
       // } catch (err) {
       //     // setError("Error en el registro: " + err.message); // Necesitas un setError
       //     console.error("Error en el registro:", err);
       // }
   };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Crear cuenta</h2>

          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Asignar la función manejarEnvio al onSubmit del formulario */}
          <form className="space-y-6" onSubmit={manejarEnvio}>
            <Entrada
              placeHolder="Nombre completo"
              tipo="text"
              nombre="nombre"
              valor={formulario.nombre}
              required={true}
              manejarCambio={(e) => setFormulario({...formulario, nombre: e.target.value})}
              icono={<FiUser className="text-gray-400" />}
            />

            <Entrada
              placeHolder="Correo electrónico"
              tipo="email"
              nombre="correo"
              valor={formulario.correo}
              required={true}
              manejarCambio={(e) => setFormulario({...formulario, correo: e.target.value})}
              icono={<FiMail className="text-gray-400" />}
            />

            <Entrada
              placeHolder="Contraseña"
              tipo="password"
              nombre="contraseña"
              valor={formulario.contraseña}
              required={true}
              minLength="6"
              manejarCambio={(e) => setFormulario({...formulario, contraseña: e.target.value})}
              icono={<FiLock className="text-gray-400" />}
            />
           {/* Agregar confirmación de contraseña */}
            <Entrada
               placeHolder="Confirmar Contraseña"
               tipo="password"
               nombre="confirmarContraseña"
               valor={formulario.confirmarContraseña}
               required={true}
               minLength="6"
               manejarCambio={(e) => setFormulario({...formulario, confirmarContraseña: e.target.value})}
               icono={<FiLock className="text-gray-400" />}
             />

            <div className="campo">
               {/* Añadir label para accesibilidad */}
              <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">Rol:</label>
              <select
                id="rol"
                name="rol"
                value={formulario.rol}
                onChange={(e) => setFormulario({...formulario, rol: e.target.value})}
                required={true} // Asegurarse de que sea requerido
                // Añadir estilos de Tailwind u otros si es necesario
                 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                 {/* Opción por defecto (la primera del array) */}
                 {/* Asegúrate de que esta opción tenga value="" */}
                <option value="" disabled>Seleccione rol de usuario</option>

                {/* Iterar sobre los roles *filtrados* para registro */}
                {rolesSeleccionablesParaRegistro.map((rol) => (
                  // Usar rol.value para el valor y rol.label para el texto visible
                  <option key={rol.value} value={rol.value}>
                    {rol.label}
                  </option>
                ))}
              </select>
            </div>

            <Boton tipo="submit">
              Registrarse
            </Boton>

            {/*<div className="text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Inicia sesión
              </Link>
            </div>*/}
          </form>
        </div>
      </div>
    </div>
  );
} 