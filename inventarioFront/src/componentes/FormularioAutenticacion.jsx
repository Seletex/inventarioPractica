
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../autenticacion/contexto/ContextoAutenticacion";
import './FormularioAutenticacion.css';

//base de datos ficticia
/*const datosFicticios = [
    {id:1, email:'administrador@getDefaultNormalizer.com', contraseña:'123456'},

];

function Login() {
    const [correo, asignarCorreo] = useState("");
    const [contraseña, asignarContraseña] = useState("");
    const [error,asignarError] = useState(false);
    const [mensaje,asignarMensaje] = useState("");

    const validandoDatos = (e) => {
        e.preventDefault();
       // const usuario = datosFicticios.find((usuario) => usuario.email === email && usuario.password === contraseña);
       if(correo==="" || contraseña===""){
            asignarError(true);
            asignarMensaje("Por favor, llene todos los campos");
            return;
        } 
        const usuario = datosFicticios.find((em) => em.email === correo && em.contraseña === contraseña);
       if(usuario){
           
            asignarError(false);
            asignarCorreo(correo);
            asignarContraseña(contraseña);
            asignarMensaje("Inicio de sesión exitoso");
        }else{
            asignarError(true);
            asignarMensaje("Credenciales incorrectas");
        }
        //limpia los campos
        asignarCorreo("");
        asignarContraseña("");
    };
    return(
        <>
        <h1>Formulario de Login</h1>
        <form action="" onSubmit={validandoDatos} className="formulario-login">
            <input type="text" 
            placeholder="Correo Electronico"
            value={correo}
            onChange={(e) => asignarCorreo(e.target.value)}
            name="correo"
            />
            <input type="password"
            placeholder="Contraseña"
            value={contraseña}
            onChange={(e) => asignarContraseña(e.target.value)}
            name="contraseña"
            />

        </form>
        {error && <p>{mensaje}</p>}
        </>
    )
}*/
const FormularioAutenticacion = () => {
    const [credenciales, asignarCredenciales] = useState({
      email: '',
      password: ''
    });
    const [error, asignarError] = useState('');
    const [cargando, asignarCargando] = useState(false);
    const { autenticacion } = useAuth();
    const navigate = useNavigate();
  
    const manejarEnvio = async (e) => {
      e.preventDefault();
      asignarError('');
      asignarCargando(true);
  
      try {
        await autenticacion(credenciales);
        navigate('/inventario');
      } catch (err) {
        asignarError('Correo electronico o contraseña incorrectos');
        console.error('Login error:', err);
      } finally {
        asignarCargando(false);
      }
    };
  
    return (
      <div className="login-container">
        <form onSubmit={manejarEnvio} className="login-form">
          <h2>Iniciar Sesión</h2>
          
          {error && <div className="alert error">{error}</div>}
  
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={credenciales.email}
              onChange={(e) => asignarCredenciales({...credenciales, email: e.target.value})}
              required
            />
          </div>
  
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={credenciales.password}
              onChange={(e) => asignarCredenciales({...credenciales, password: e.target.value})}
              required
              minLength="6"
            />
          </div>
  
          <button type="submit" disabled={cargando} className="btn btn-primary">
            {cargando ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    );
  };
  
  export default FormularioAutenticacion;