import 'primeicons/primeicons.css';

export default function Boton({
  tipo = "button",
  children,
  className = "",
  loading = false,
  ...props
}) {
  return (
    <button
      type={tipo}
      disabled={loading}
      className={`
        w-full bg-blue-600 hover:bg-blue-700 text-white
        font-medium py-3 px-4 rounded-lg transition duration-200
        shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500
        focus:ring-offset-2
        ${loading ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <i className="pi pi-spinner pi-spin"></i>
          Procesando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
