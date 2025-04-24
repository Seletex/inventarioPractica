import "primeicons/primeicons.css";
import PropTypes from "prop-types";

export default function Boton({
  tipo = "button",
  children,
  className = "",
  loading = false,
  ...props
}) {
  return (
    <button
      style={{ width: "100%", textAlign: "center", fontSize: "1.2rem" }}
      type={tipo}
      disabled={loading}
      className={`
        w-full bg-blue-600 hover:bg-blue-700 text-white
        font-medium rounded-lg transition duration-200
        shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500
        focus:ring-offset-2
        ${loading ? "opacity-70 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <i className="pi pi-spinner pi-spin" /><gap-2>
          Procesando...
          </gap-2>
        </span>
      ) : (
        children
      )}
    </button>
)};

Boton.propTypes = {
  tipo: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

