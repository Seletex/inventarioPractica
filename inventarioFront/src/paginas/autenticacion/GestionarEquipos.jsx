import { useState, useEffect } from 'react';
import { TablaEquipos } from './TablaDatos'; // Asumiendo que guardaste el componente anterior como TablaDatos.js
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
export const GestionarEquipos = () => {
    const [equipos, setEquipos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [equipoEditando, setEquipoEditando] = useState(null);
  
    // Simulación de carga de datos (reemplaza con tu API real)
    useEffect(() => {
      const cargarEquipos = async () => {
        // Ejemplo de datos estáticos (deberías hacer una llamada API aquí)
        const datosEjemplo = [
          {
            id: 1,
            placa: '122',
            marca: 'Lenovo',
            modelo: 'V.14',
            ubicacion: 'Alcaldía',
            responsable: 'Alejandro',
            fecha: '12/12/2025',
            estado: 'Pendiente'
          },
          // ... más registros
        ];
        setEquipos(datosEjemplo);
      };
      cargarEquipos();
    }, []);
  
    const columnas = [
      // ... (las mismas columnas que definimos antes)
    ];
  
    const handleEditar = (equipo) => {
      setEquipoEditando(equipo);
      setMostrarModal(true);
    };
  
    const handleEliminar = (id) => {
      // Lógica para eliminar
      setEquipos(equipos.filter(equipo => equipo.id !== id));
    };
  
    return (
      <div className="p-4">
        <div className="flex justify-content-between align-items-center mb-4">
          <h1 className="text-2xl font-bold">Gestión de Equipos</h1>
          <Button 
            label="Nuevo Equipo" 
            icon="pi pi-plus" 
            onClick={() => {
              setEquipoEditando(null);
              setMostrarModal(true);
            }}
          />
        </div>
  
        <TablaEquipos 
          columns={columnas} 
          data={equipos} 
          onEdit={handleEditar}
          onDelete={handleEliminar}
        />
  
        {/* Modal para edición/creación */}
        <Dialog
          header={equipoEditando ? 'Editar Equipo' : 'Nuevo Equipo'}
          visible={mostrarModal}
          style={{ width: '50vw' }}
          onHide={() => setMostrarModal(false)}
        >
          {/* Formulario de edición aquí */}
          <p>Formulario para editar/crear equipos</p>
        </Dialog>
      </div>
    );
  };