
import { useState } from "react";
import { loginUsuario } from "../../servicios/Autenticacion.service";
import {Entrada} from "../../componentes/InterfazUsuario/Entrada";
import {Boton} from "../../componentes/InterfazUsuario/Boton";
import { Link } from "react-router-dom";
export default function PaginaLogin(){
    const {formulario, asignarFormulario} = useState({correo: "",contraseña: ""});
    const {error, asignarError} = useState("");

    const manejarEnvio = async (evento) => {
        evento.preventDefault();
        try {
            const {token} = await loginUsuario(formulario.correo, formulario.contraseña);
            localStorage.setItem("token", token);
            window.location.href = "/tablero"; // Redirigir a la página principal después de iniciar sesión
        } catch (error) {
            asignarError("Error al iniciar sesión. Por favor, verifica tus credenciales.", error);
            
        }
    };
    return (
        <form onSubmit={manejarEnvio} className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <Entrada placeHolder="Correo electrónico" tipo="email"nombre="correo"valor={formulario.correo}
                    required={true}
                    manejarCambio={(e) => asignarFormulario({...formulario, correo: e.target.value})}/>
                <Entrada placeHolder="Contraseña" tipo="password" nombre="contraseña" valor={formulario.contraseña}
                    required={true} minLength={6}
                    manejarCambio={(e) => asignarFormulario({...formulario, contraseña: e.target.value})}/>
                    {error && <p className="text-red-500">Error al Iniciar Sesión {error}</p>}
                <Boton tipo="submit" claseNombre="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Iniciar sesión
                </Boton>
                <p className="mt-4 text-center">
                    ¿No tienes cuenta? <Link to="/register" className="text-blue-500">Regístrate</Link>
                </p>
            </div>

        </form>
    )
}
