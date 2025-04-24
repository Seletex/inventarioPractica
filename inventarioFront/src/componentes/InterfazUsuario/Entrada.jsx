import 'primeicons/primeicons.css';
import { InputText } from 'primereact/inputtext';
import PropTypes from 'prop-types';

export default function Entrada({
  placeHolder,
  tipo = "text",
  nombre,
  valor,
  required = false,
  manejarCambio,
  icono, // Ej: "pi-user"
  className = ""
}) {
  return (
    <div className={`relative ${className}`}>
      {icono && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i className={`pi ${icono} text-gray-500`}></i>
        </div>
      )}
      <InputText
      style={{width: "100%", textAlign: "center", fontSize: "1.2rem",
        padding: "5px", borderRadius: "5px",textColor: "rgb(0, 0, 0)",
        border: "1px solid rgb(0, 0, 0)",
        box: "0 4px 8px rgb(0, 0, 0)"}}
        placeholder={placeHolder}
        type={tipo}
        name={nombre}
        value={valor}
        required={required}
        onChange={manejarCambio}
        className={`
          w-full rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition
          ${icono ? 'pl-10' : 'pl-4'}
        `}
      />
    </div>
)}

Entrada.propTypes = {
  placeHolder: PropTypes.string,
  tipo: PropTypes.string,
  nombre: PropTypes.string.isRequired,
  valor: PropTypes.string.isRequired,
  required: PropTypes.bool,
  manejarCambio: PropTypes.func.isRequired,
  icono: PropTypes.string,
  className: PropTypes.string,
};

