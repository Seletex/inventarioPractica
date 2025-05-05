import bcrypt from 'bcrypt';

const encriptarClave = async (clave) => {
const salt = await bcrypt.gen(12);
const claveEncriptada =await bcrypt.hash(clave, salt);
return claveEncriptada;
};
export default encriptarClave;


