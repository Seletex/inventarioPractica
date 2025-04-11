import { useState, useEffect, useRef } from "react";
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";
import { TablaEquipos } from "../../autenticacion/contexto/TablaDatos.jsx";
import { Button } from "primereact/button";

import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";

export default function GestionarEquipos() {
  const [equipos, setEquipos] = useState([]);
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [carga, asignarCarga] = useState(true);
  const [ asignarMostrarModelo] = useState(false);
  const [ setEquipoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const toast = useRef(null);

  // Columnas simplificadas
  const columnas = [
    { Header: "Placa", accessor: "placa" },
    { Header: "Marca", accessor: "marca" },
    { Header: "Modelo", accessor: "modelo" },
    { Header: "Ubicación", accessor: "ubicacion" },
    {  Header: "Estado",
      accessor: "estado",
      Cell: ({ value }) => (
        <span className={`estado-badge ${value === 'Baja' ? 'Inactivo' : 'Activo'}`}>
          {value}
        </span>
      )},
    {
      Header: "Acciones",
      accessor: "acciones",
      Cell: ({ row }) => (
        <div className="flex flex-row gap-1">  {/* Cambiado a flex-row y reducido gap */}
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-sm p-button-text p-button-primary"
            tooltip="Editar"
            onClick={() => {
              setEquipoEditando(row.original);
              asignarMostrarModelo(true);
            }}
          />
          <Button
            icon="pi pi-power-off"
            className="p-button-rounded p-button-sm p-button-text p-button-warning"
            tooltip="Dar de baja"
            onClick={() => confirmarCambioEstado(row.original.id, 'Baja')}
            disabled={row.original.estado === 'Baja'}
          />
          
        </div>
      ),
      disableSortBy: true,
      width: 150 // Ancho fijo para la columna de acciones
    }
  ];
 /* <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-sm p-button-text p-button-danger"
            tooltip="Eliminar permanentemente"
            onClick={() => confirmarEliminacion(row.original.id)}
          />*/

  // Carga inicial
  useEffect(() => {
    cargarEquipos();
  }, []);

  // Filtrado por búsqueda
  useEffect(() => {
    if (busqueda) {
      const filtrados = equipos.filter(equipo => 
        Object.values(equipo).some(
          val => val.toString().toLowerCase().includes(busqueda.toLowerCase())
        ));
      setEquiposFiltrados(filtrados);
    } else {
      setEquiposFiltrados(equipos);
    }
  }, [busqueda, equipos]);
  const confirmarCambioEstado = (id, nuevoEstado) => {
    if (confirm(`¿Estás seguro de dar de baja este equipo?`)) {
      cambiarEstadoEquipo(id, nuevoEstado);
    }
  };
  
  const cambiarEstadoEquipo = async (id, nuevoEstado) => {
    try {
      const equipoActualizado = { ...equipos.find(e => e.id === id), estado: nuevoEstado };
      await equiposService.update(id, equipoActualizado);
      mostrarExito(`Equipo dado de baja correctamente`);
      cargarEquipos();
    } catch (error) {
      mostrarError(`Error al cambiar estado: ${error.message}`);
    }
  };
  
  /*const confirmarEliminacion = (id) => {
    if (confirm(`¿Eliminar permanentemente este equipo? Esta acción no se puede deshacer.`)) {
      manejoEliminar(id);
    }
  };*/
  const cargarEquipos = async () => {
    asignarCarga(true);
    try {
      const data = await equiposService.getAll();
      setEquipos(data);
      setEquiposFiltrados(data);
    } catch (error) {
      mostrarError("Error cargando equipos: " + error.message);
    } finally {
      asignarCarga(false);
    }
  };

  // Funciones de CRUD...
  /*const manejoGuardar = async (equipo) => {
    try {
      if (equipo.id) {
        await equiposService.update(equipo.id, equipo);
        mostrarExito("Equipo actualizado correctamente");
      } else {
        await equiposService.create(equipo);
        mostrarExito("Equipo creado correctamente");
      }
      asignarMostrarModelo(false);
      cargarEquipos();
    } catch (error) {
      mostrarError(error.message);
    }
  };*/

  const manejoEliminar = async (id) => {
    try {
      await equiposService.delete(id);
      mostrarExito("Equipo eliminado correctamente");
      cargarEquipos();
    } catch (error) {
      mostrarError(error.message);
    }
  };
  const mostrarExito = (mensaje) => {
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: mensaje,
      life: 3000,
    });
  };

  // Corregido: Función cerrada correctamente
  const mostrarError = (mensaje) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: mensaje,
      life: 5000,
    });
  }; 

  return (
    <div className="p-4">
      <Toast ref={toast} />
      
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Equipos</h1>
        
        <div className="flex gap-2">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar equipos..."
            />
          </span>
          
          <Button 
            label="Nuevo Equipo" 
            icon="pi pi-plus" 
            onClick={() => {
              setEquipoEditando(null);
              asignarMostrarModelo(true);
            }}
          />
        </div>
      </div>

      <TablaEquipos
        columns={columnas}
        data={equiposFiltrados}
        loading={carga}
        onEdit={(equipo) => {
          asignarMostrarModelo(equipo);
          asignarMostrarModelo(true);
        }}
        onDelete={manejoEliminar}
      />

      {/* Modal de edición... */}
    </div>
  );
}