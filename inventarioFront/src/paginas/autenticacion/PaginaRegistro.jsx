import { useState } from "react";
import { registrarUsuario } from "../../servicios/Autenticacion.service";
import Entrada from "../../componentes/InterfazUsuario/Entrada";

const PaginaRegistro =  () => {
    const [formulario, asignarFormulario] = useState(
        { nombre: '', correo: '', contraseña: '', confirmarContraseña: '', rol: 'consultor',});

    const manejoEnvio = async (evento) => {
        evento.preventDefault();
        try {
           await registrarUsuario(formulario);
           alert('Usuario registrado con éxito');
           //window.location.href = '/login'; // Redirigir a la página de inicio de sesión
            //console.log(respuesta); // Maneja la respuesta como desees
        } catch (error) {
            console.error('Error al registrar usuario: '+ error);
        }
    };
    return (
        <form onSubmit={manejoEnvio}>
      <Input label="Nombre" value={formulario.name} onChange={(e) => 
        asignarFormulario({ ...formulario, name: e.target.value })} required />
      <Input label="Email" type="email" value={formulario.email} onChange={(e) =>
         asignarFormulario({ ...formulario, email: e.target.value })} required />
      <Input
        label="Contraseña"
        type="password"
        value={formulario.password}
        onChange={(e) => asignarFormulario({ ...formulario, password: e.target.value })}
        pattern="^(?=.*[A-Z])(?=.*\d).{6,}$" // 1 mayúscula, 1 número
        required
      />
      <label htmlFor="rol">Rol:</label>
        <select id="rol" value={formulario.rol}
        onChange={(e) => asignarFormulario({ ...formulario, rol: e.target.value })}
        required >
        <option value="">Seleccionar un rol</option> {/* Opción por defecto */}
        <option value="administrador">Administrador</option>
        <option value="usuario">Usuario Administrador</option>
        <option value="consultor">Consultor</option>
        </select>
      <Button type="submit">Registrarse</Button>
    </form>
  );
};
export default  PaginaRegistro;