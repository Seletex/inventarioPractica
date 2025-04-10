import { useState } from "react";
import { Link } from "react-router-dom";
import Entrada from "../../componentes/InterfazUsuario/Entrada";
import Boton from "../../componentes/InterfazUsuario/Boton";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { rolUsuarioArray } from "../../componentes/Datos/RolUsuario";

export default function PaginaRegistro() {
  const roles = [rolUsuarioArray[1].label, rolUsuarioArray[2].label, rolUsuarioArray[3].label];
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    confirmarContraseña: "",
    rol: "Usuario"
  });
  const [error] = useState("");

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

          <form className="space-y-6">
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
           
            <div className="campo">
              
              <select
                id="rol"
                name="rol"
                value={formulario.rol}
                onChange={(e) => setFormulario({...formulario, rol: e.target.value})}
                required={true}
              >
                <option value="">Seleccionar un rol</option>
                {roles.map((rol) => (
                  <option key={rol} value={rol.toLowerCase()}>
                    {rol}
                  </option>
                ))}
              </select>
            </div>

            <Boton tipo="submit">
              Registrarse
            </Boton>

            <div className="text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}