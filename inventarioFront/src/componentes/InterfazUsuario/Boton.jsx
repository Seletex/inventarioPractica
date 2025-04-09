const Boton = ({ children, type = 'button', ...props }) => (
    <button type={type} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      {...props}>
      {children}</button>);
export default Boton;