import { useAuth } from "../autenticacion/contexto/ContextoAutenticacion";
import { Navigate,Outlet } from "react-router-dom";

const RutaPrivada = () => {
    const {user} = useAuth();
    return user ? <Outlet/> : <Navigate to="/login"  replace/>;
}
export default RutaPrivada;