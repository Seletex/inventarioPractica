export default function Boton({ tipo, claseNombre, children }) {  // "Boton" con mayúscula
    return (
      <button type={tipo} className={claseNombre}>
        {children}
      </button>
    );
  }