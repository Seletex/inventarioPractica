import {useAuth} from "../contexto/AuthContext";
import {FormularioLogin} from "../../componentes/FormularioLogin";

const PaginaLogin = () => {
    const {login} = useAuth();
    /*const handleSubmit = (credenciales) => {
        login(credenciales);
    }*/
    return(
        <div className="container">
            <h1>Iniciar Sesión</h1>
            <FormularioLogin onSubmit={login} isLogin={true}/>
        </div>
    )
};

export default PaginaLogin;