export const ROLES = {
    ADMIN: 'ADMIN', 
    ADMINISTRATIVO: 'ADMINISTRATIVO', 
    CONSULTOR: 'CONSULTOR'
};

export const rolUsuarioArray = [
    {value: "", label: "Seleccione rol de usuario"},
    {value: ROLES.ADMIN, label: "Administrador"},
    {value: ROLES.ADMINISTRATIVO, label: "Usuario Administrativo"},
    {value: ROLES.CONSULTOR, label: "Consultor"},
];