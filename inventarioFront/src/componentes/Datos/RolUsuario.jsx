// Valores internos (usados en backend, JWT, etc.)
export const ROLES = {
    ADMIN: 'ADMIN', // Valor interno consistente
    ADMINISTRATIVO: 'ADMINISTRATIVO', // Valor interno consistente
    CONSULTOR: 'CONSULTOR' // Valor interno consistente
};
// Array para mostrar en selects del frontend
export const rolUsuarioArray = [
    {value: "", label: "Seleccione rol de usuario"},
    {value: ROLES.ADMIN, label: "Administrador"},
    {value: ROLES.ADMINISTRATIVO, label: "Usuario Administrativo"},
    {value: ROLES.CONSULTOR, label: "Consultor"},
];