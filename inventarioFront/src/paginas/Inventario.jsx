import { useEffect,useState } from "react";
import {TablaDatos} from "../../componentes/TablaDatos";
import { obtenerEquipos } from "../servicios/api";


const Inventario = () => {
    const [equipos, setEquipos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargandoDatos = async () => {
            try {
                const response = await obtenerEquipos();
                setEquipos(response.data);
            } catch (error) {
                setError(error.message);
            } 
        };
        cargandoDatos();
    }, []);

    const columnas=[
        { nombre: "Placa", campo: "placa" },
        { nombre: "Nombre", campo: "nombre" },
        { nombre: "Marca", campo: "marca" },
        { nombre: "Modelo", campo: "modelo" },
        { nombre: "Ubicación", campo: "ubicacion" },
        { nombre: "Descripción", campo: "descripcion" },
        { nombre: "Fecha de Adquisición", campo: "fecha_adquisicion" },
        
        { nombre: "Tipo de Almacenamiento", campo: "tipo_almacenamiento" },
        { nombre: "Capacidad de RAM", campo: "capacidad_ram" },
        {nombre:"Capacidad de almacenamiento", campo:"almacenamiento"},
        { nombre: "Sistema Operativo", campo: "sistema_operativo" },
        { nombre: "Office", campo: "office" },
        {nombre:"Tiene garantía", campo:"garantia"},
        
        { nombre: "Tiempo restante de garantía", campo: "tiempo_garantia" }, 
        { nombre: "Número de Serie", campo: "numero_serie" },
        
        { nombre: "Estado", campo: "estado" },
    ];
    
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="page-container">
            <h1>Inventario de Equipos</h1>
            <TablaDatos columnas={columnas} datos={equipos} />
        </div>
    );
}
export default Inventario;