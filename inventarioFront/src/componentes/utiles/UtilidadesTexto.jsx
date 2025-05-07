export const normalizarString = (str) => {
    if (typeof str !== 'string') return '';
    return str
      .normalize("NFD") // Descomponer caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Eliminar diacríticos
      .toLowerCase();
  };