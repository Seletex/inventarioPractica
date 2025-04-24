import { useState } from "react";
import PropTypes from "prop-types";
import { crearEquipo } from "../servicios/api";
import { formularioInicial } from "./Datos/Formularioinicial";


function FormularioEquipos ({onSuccess}) {
    const [formularioDatos, setFormularioDatos] = useState(formularioInicial);

    const manejarCambioDeEntrada = (event) => {
        const { nombre, valor, tipo, checked } = event.target;
        setFormularioDatos(prevState => ({
          ...prevState,
          [nombre]: tipo === 'checkbox' ? checked : valor,

        }));
      };
      const manejarCambioSeleccionados = (event) => {
        const { name, value } = event.target;
        setFormularioDatos(prevState => ({
          ...prevState,
          [name]: value,
        }));
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
            <h1>Formulario de Equipos</h1>
            {crearEquipo.map((campo) => (
                 <div key={campo.id || campo.name}>
                     {campo.label && <label htmlFor={campo.id || campo.name}>{campo.label}</label>}
                     {campo.type === "select" ? (
                        <select
                            id={campo.id} name={campo.name} value={formularioDatos[campo.name]} onChange={manejarCambioSeleccionados}
                            required={campo.required}> {campo.options && campo.options.map((option) => (
                            <option key={option.value} value={option.value}> {option.label}</option>))}
                        </select>  ) : (
                            <input type={campo.type} id={campo.id} name={campo.name} value={formularioDatos[campo.name]}
                                onChange={manejarCambioDeEntrada} required={campo.required} placeholder={campo.placeholder}
                            />)
                     }</div>))}           
            <button type="submit">Guardar Equipo</button>
        </form>
    );

  }
  export default FormularioEquipos;

FormularioEquipos.propTypes = {
    onSuccess: PropTypes.func.isRequired,
};