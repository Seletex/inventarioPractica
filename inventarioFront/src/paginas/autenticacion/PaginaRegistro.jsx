import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Entrada from "../../componentes/InterfazUsuario/Entrada";
import Boton from "../../componentes/InterfazUsuario/Boton";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { Navigate } from "react-router-dom";
import { ROLES, rolUsuarioArray } from "../../componentes/Datos/RolUsuario.jsx"; // Asegúrate que la extensión sea correcta si es necesario

import { mockUsuariosService as usuariosService } from "../../servicios/mockUsuarios.api.js"; // Ajusta la ruta y el nombre del servicio
import {UsuarioDTO} from "../../../../inventarioBack/src/infraestructura/dto/UsuarioDTO.js"; // Ajusta la ruta al DTO en tu backend

export default function PaginaRegistro() {
  const rolesSeleccionablesParaRegistro = useMemo(() => {
    return rolUsuarioArray.filter(
      (rol) => rol.value !== "" && rol.value !== ROLES.ADMIN
    );
  }, []); // Dependencias eliminadas ya que no son necesarias

  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    confirmarContraseña: "",
  });
  const [error, setError] = useState(""); // Habilitar setError
  const [cargando, setCargando] = useState(false); // Estado para deshabilitar botón

  const manejarEnvio = async (e) => {
    // Convertir a async
    e.preventDefault();
    setError(""); // Limpiar errores previos
    setCargando(true); // Iniciar carga

    console.log("Formulario enviado:", formulario);

    if (formulario.contraseña !== formulario.confirmarContraseña) {
      setError("Las contraseñas no coinciden."); // Usar setError
      console.error("Las contraseñas no coinciden.");
      setCargando(false); // Detener carga
      return;
    }
    if (!formulario.rol) {
      setError("Debes seleccionar un rol."); // Usar setError
      console.error("Debes seleccionar un rol.");
      setCargando(false); // Detener carga
      return;
    }

    try {
      const usuarioDto = new UsuarioDTO(
        null,
        formulario.nombre,
        formulario.correo,
        formulario.contraseña,
        formulario.rol
      );

      await usuariosService.create(usuarioDto); // Llamar al servicio con el DTO
      alert("¡Registro exitoso!"); // Considera usar un Toast/Notification
      // Podrías redirigir al login o a otra página aquí
      Navigate("/gestion-usuarios");
    } catch (err) {
      setError("Error en el registro: " + err.message); // Mostrar error
      console.error("Error en el registro:", err);
    } finally {
      setCargando(false); // Detener carga
    }
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

          <form className="space-y-6" onSubmit={manejarEnvio}>
            <Entrada
              placeHolder="Nombre completo"
              tipo="text"
              nombre="nombre"
              valor={formulario.nombre}
              required={true}
              manejarCambio={(e) =>
                setFormulario({ ...formulario, nombre: e.target.value })
              }
              icono={<FiUser className="text-gray-400" />}
            />

            <Entrada
              placeHolder="Correo electrónico"
              tipo="email"
              nombre="correo"
              valor={formulario.correo}
              required={true}
              manejarCambio={(e) =>
                setFormulario({ ...formulario, correo: e.target.value })
              }
              icono={<FiMail className="text-gray-400" />}
            />

            <Entrada
              placeHolder="Contraseña"
              tipo="password"
              nombre="contraseña"
              valor={formulario.contraseña}
              required={true}
              minLength="6"
              manejarCambio={(e) =>
                setFormulario({ ...formulario, contraseña: e.target.value })
              }
              icono={<FiLock className="text-gray-400" />}
            />

            <Entrada
              placeHolder="Confirmar Contraseña"
              tipo="password"
              nombre="confirmarContraseña"
              valor={formulario.confirmarContraseña}
              required={true}
              minLength="6"
              manejarCambio={(e) =>
                setFormulario({
                  ...formulario,
                  confirmarContraseña: e.target.value,
                })
              }
              icono={<FiLock className="text-gray-400" />}
            />

            <div className="campo">
              <select
                id="rol"
                name="rol"
                value={formulario.rol}
                onChange={(e) =>
                  setFormulario({ ...formulario, rol: e.target.value })
                }
                required={true} // Asegurarse de que sea requerido
                // Añadir estilos de Tailwind u otros si es necesario
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="" disabled>
                  Seleccione rol de usuario
                </option>

                {rolesSeleccionablesParaRegistro.map((rol) => (
                  <option key={rol.value} value={rol.value}>
                    {rol.label}
                  </option>
                ))}
              </select>
            </div>

            <Boton tipo="submit" disabled={cargando}>
              Registrarse
            </Boton>

            <div className="text-center text-sm text-gray-600">
              ¿No deseas crear una cuenta?{" "}
              <Link
                to="/gestion-usuarios"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Volver
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
