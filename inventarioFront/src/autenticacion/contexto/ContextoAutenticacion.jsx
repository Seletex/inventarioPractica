import { createContext,useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//import {loginUsuario,registrarUsuario} from "../servicios/ServicioAutenticacion";

const ContextoAutenticacion = createContext();

export const ProveedorAutenticacion = ({ children }) => {
    const [usuario, asignarUsuario] = useState(null);
    const navigate = useNavigate();


    /*useEffect(() => {
        const token = localStorage.getItem("token");
        if(token) {
            asignarUsuario(token);
        }
        
    }, []);*/
    const login = async (credenciales) => {
        try {
            const respuesta = await axios.post('/auth/login',credenciales)
            localStorage.setItem('token', respuesta.data.token);
            asignarUsuario(respuesta.data.usuario);
            
        } catch (error) {
            throw new Error(error.respuesta?.data?.mensaje || "Error al iniciar sesión:" + error.message);
        }
    }
    const logout = () => {
        localStorage.removeItem("token");
        asignarUsuario(null);
        navigate("/login");
    }
    return(
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
};


    
