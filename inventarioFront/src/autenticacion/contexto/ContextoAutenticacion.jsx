import { createContext,useState,useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import axios from "axios";

//import {loginUsuario,registrarUsuario} from "../servicios/ServicioAutenticacion";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token) {
            setUser(token);
        }
        
    }, []);
    const login = async (credenciales) => {
        try {
            const response = await axios.post('/auth/login',credenciales)
            
            
            //const {data} = await loginUsuario(credenciales);
            
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
            
           
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    }
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        //navegate("/login");
    }
    return(
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}


export default AuthContext;


    
