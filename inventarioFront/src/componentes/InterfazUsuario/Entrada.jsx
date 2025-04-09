import 'primeicons/primeicons.css';

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
      <input
        placeholder={placeHolder}
        type={tipo}
        name={nombre}
        value={valor}
        required={required}
        onChange={manejarCambio}
        className={`
          w-full px-4 py-3 rounded-lg border border-gray-300
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition
          ${icono ? 'pl-10' : 'pl-4'}
        `}
      />
    </div>
  );
}
