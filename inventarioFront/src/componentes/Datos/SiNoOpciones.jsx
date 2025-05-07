const siNoBaseOpciones=[
    {value:"true", label:"Sí"},
    {value:"false", label:"No"},
]

export const crearSiNoOptionsConPlaceholder = (placeholderLabel) => {
    return [
        {value: "", label: placeholderLabel }, // La opción por defecto con el label recibido
        ...siNoBaseOpciones, // Incluye todas las opciones base (Sí y No)
    ];
};

// --- Ahora defines las opciones específicas llamando a la función ---
// Usamos la función para generar cada lista, pasando el texto deseado para el placeholder
export const siNoOpcionesGarantia = crearSiNoOptionsConPlaceholder("¿Tiene Garantía?");
export const siNoOpcionesTeclado = crearSiNoOptionsConPlaceholder("¿Tiene Teclado?");
export const siNoOpcionesMouse = crearSiNoOptionsConPlaceholder("¿Tiene Mouse?");
export const siNoOpcionesEntrega = crearSiNoOptionsConPlaceholder("¿Ha sido Entregado?");