import { useState } from "react";
import { crearEquipo } from "../servicios/api";
import { formularioInicial } from "./Datos/Formularioinicial";
import { ubicaciones } from "../componentes/DatosUbicacion";

function FormularioEquipos ({onSuccess}) {
    const [formularioDatos, asignarFormularioDatos] = useState(formularioInicial);

    const manejarCambioDeEntrada = (event) => {
        const { nombre, valor, tipo, checked } = event.target;
        setFormularioDatos(prevState => ({
          ...prevState,
          [nombre]: tipo === 'checkbox' ? checked : valor,

        }));
      };    
    const setFormularioDatos = (nuevosDatos) => {
        asignarFormularioDatos(nuevosDatos);
      };    
    const enviarActo = async (e) => {
        e.prevenirPredeterminado();
        try {
            await crearEquipo(formularioDatos);
            onSuccess();
        } catch (error) {
            console.error("Error al crear el equipo:", error);
        }
    };
    return(
        <form onSubmit={enviarActo} className="formulario-equipos">
            <div>
            <label htmlFor="placa">Placa:</label>
            <input 
                type="number" 
                id="placa"
                name="placa"
                value={formularioDatos.placa}
                onChange={manejarCambioDeEntrada}
                required
                placeholder="Placa 11111"
                
            />
            </div>
            <input 
                type="text" 
                value={formularioDatos.nombre}
                onChange={(e) => asignarFormularioDatos({ ...formularioDatos, nombre: e.target.value })}
                placeholder="Nombre"
            />
           <div>
        <label htmlFor="ubicacion">Ubicación:</label>
            <select
            id="ubicacion"
            name="ubicacion"
            value={formularioDatos.ubicacion}
            onChange={(e) => asignarFormularioDatos({...formularioDatos, ubicacion: e.target.value})}
            required
        >
            <option value="">Seleccione ubicación</option>
            {ubicaciones.map((ubicacion) => (
                <option key={ubicacion.value} value={ubicacion.value}>
                {ubicacion.label}
                </option>
            ))}
            </select>
        </div>
            {/* Agregar más campos según sea necesario */}
            <button type="submit">Guardar Equipo</button>
        </form>
    )
}
export default FormularioEquipos;