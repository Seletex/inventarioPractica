import { useState } from "react";

const FormularioAutenticacion = ({onSubmit, isLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return(
        <form onSubmit={handleSubmit} className="formulario-autenticacion">
            <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Correo Electronico"/>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Contraseña"/>
            <button type="submit">
                {isLogin ? "Iniciar sesión" : "Registrarse"}
            </button>
        </form>
           
    )
}
export default FormularioAutenticacion;