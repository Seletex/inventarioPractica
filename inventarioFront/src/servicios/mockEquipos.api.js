// Mock de datos de ejemplo
const equiposMock = [
    {
      id: 1,
      placa: '122',
      marca: 'Lenovo',
      modelo: 'V.14',
      ubicacion: 'Alcaldía',
      responsable: 'Alejandro',
      fecha_compra: '2025-12-12',
      estado: 'activo'
    },
    {
      id: 2,
      placa: '456',
      marca: 'HP',
      modelo: 'EliteBook',
      ubicacion: 'Secretaría de Salud',
      responsable: 'María',
      fecha_compra: '2025-01-15',
      estado: 'mantenimiento'
    }
  ];
  
  export const mockEquiposService = {
    getAll: () => new Promise((resolve) => {
      setTimeout(() => resolve(equiposMock), 500); // Simula delay de red
    }),
    
    filtrarAvanzado: (filtros) => new Promise((resolve) => {
      const resultados = equiposMock.filter(equipo => {
        return (
          (!filtros.placa || equipo.placa.includes(filtros.placa)) &&
          (!filtros.marca || equipo.marca.toLowerCase().includes(filtros.marca.toLowerCase())) &&
          (!filtros.estado || equipo.estado === filtros.estado)
        );
      });
      setTimeout(() => resolve(resultados), 500);
    }),
    
    getById: (id) => new Promise((resolve) => {
      const equipo = equiposMock.find(e => e.id === id);
      setTimeout(() => resolve(equipo), 500);
    })
  };