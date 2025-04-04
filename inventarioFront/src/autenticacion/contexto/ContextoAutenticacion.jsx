import { createContext,useContext,useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {loginUsuario,registrarUsuario} from "../servicios/ServicioAutenticacion";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navegate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token) {
            setUser(token);
        }
        
    }, []);
    const login = async (credenciales) => {
        try {
            const {data} = await loginUsuario(credenciales);
            localStorage.setItem("token", data.token);
            setUser(data.user);
            
            navegate("/tablero");
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    }
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navegate("/login");
    }
    return(
        <AuthContext.Provider value={{ user, login, logout,registrarUsuario }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () =>     useContext(AuthContext);
    
