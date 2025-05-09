const siNoBaseOpciones=[
    {value:"true", label:"Sí"},
    {value:"false", label:"No"},
]

export const crearSiNoOptionsConPlaceholder = (placeholderLabel) => {
    return [
        {value: "", label: placeholderLabel }, 
        ...siNoBaseOpciones,
    ];
};

export const siNoOpcionesGarantia = crearSiNoOptionsConPlaceholder("¿Tiene Garantía?");
export const siNoOpcionesTeclado = crearSiNoOptionsConPlaceholder("¿Tiene Teclado?");
export const siNoOpcionesMouse = crearSiNoOptionsConPlaceholder("¿Tiene Mouse?");
export const siNoOpcionesEntrega = crearSiNoOptionsConPlaceholder("¿Ha sido Entregado?");