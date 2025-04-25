import { useState, useEffect, useRef,useCallback } from "react";
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";
import { TablaEquipos } from "../../autenticacion/contexto/TablaDatos.jsx";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag"; // Añadida importación del componente Tag

import {
  cargarEquiposFn,
  manejoEliminarFn,
  mostrarExitoFn,
  mostrarErrorFn,
} from "../../autenticacion/anzuelos/usoGestionFuncionesEquipo.js";

export default function MantenimientosProgramados() {
  const [equipos, setEquipos] = useState([]);
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [carga, asignarCarga] = useState(true);
  const [mostrarModelo, asignarMostrarModelo] = useState(false);
  const [setEquipoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const toast = useRef(null);

  // Columnas para la tabla
  const columnas = [
    { Header: "Placa", accessor: "placa" },
    {
      Header: 'Equipo Completo',
      Cell: ({ row }) => {
        const equipoItem = row.original;
        
        if (equipoItem && typeof equipoItem.equipo === 'function') {
          // Si existe el objeto y 'equipo' es una función, llámala
          return equipoItem.equipo();
        } else {
          // Si no, muestra un mensaje de error o un valor por defecto
          console.warn("El objeto de datos no tiene la función 'equipo':", equipoItem);
          return 'N/A o Error de datos'; // O algún otro valor por defecto
        }}},
    {
      Header: "Tipo",
      accessor: "tipo",
      Cell: ({ value }) => (
        <Tag
          value={value}
          severity={value === "Preventivo" ? "info" : "danger"}
        />
      ),
    },
    { Header: "Ubicación", accessor: "ubicacion" },
    {
      Header: "Fecha Programada",
      accessor: "fechaProgramada",
      Cell: ({ value }) => (
        <Tag
          value={new Date(value).toLocaleDateString()}
          severity={new Date(value) < new Date() ? "danger" : "info"}
        />
      ),
    },
    {
      Header: "Fecha Realización",
      accessor: "fechaRealizacion",
      Cell: ({ value }) =>
        value ? (
          <Tag
            value={new Date(value).toLocaleDateString()}
            severity="success"
          />
        ) : (
          <Tag value="Pendiente" severity="warning" />
        ),
    },
    {
      Header: "Técnico",
      accessor: "tecnico",
    },
    {
      Header: "Acciones",
      accessor: "acciones",
      Cell: ({ row }) => (
        <div className="flex gap-1">
          {!row.original.fechaRealizacion && (
            <Button
              icon="pi pi-check"
              className="p-button-rounded p-button-sm p-button-success"
              tooltip="Registrar realización"
              onClick={() => handleRegistrarRealizacion(row.original.id)}
            />
          )}
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-sm p-button-primary"
            tooltip="Editar"
            onClick={() => handleEditarMantenimiento(row.original)}
          />
        </div>
      ),
      disableSortBy: true,
      style: { whiteSpace: "nowrap" },
      width: 150,
    },
  ];

  // Función para mostrar mensajes de éxito
  const mostrarExito = (mensaje) => {
    mostrarExitoFn(mensaje, toast);
  };

  // Función para mostrar mensajes de error
  const mostrarError = useCallback((mensaje) => {
    mostrarErrorFn(mensaje, toast);
  }, [toast]);

  // Cargar equipos al iniciar el componente
  const cargarEquipos = useCallback(async () => {
    await cargarEquiposFn(
      asignarCarga,
      equiposService,
      setEquipos,
      setEquiposFiltrados,
      mostrarError
    );
  }, [asignarCarga, setEquipos, setEquiposFiltrados, mostrarError]);

  // Manejar eliminar un equipo
  const manejoEliminar = async (id) => {
    await manejoEliminarFn(
      id,
      equiposService,
      mostrarExito,
      cargarEquipos,
      mostrarError
    );
  };

  // Manejar registro de realización de mantenimiento
  const handleRegistrarRealizacion = async (id) => {
    try {
      // Implementar lógica para registrar realización
      await equiposService.registrarRealizacion(id, new Date());
      mostrarExito("Mantenimiento registrado con éxito");
      await cargarEquipos();
    } catch (error) {
      mostrarError("Error al registrar realización de mantenimiento",error);
    }
  };

  // Manejar edición de mantenimiento
  const handleEditarMantenimiento = (equipo) => {
    setEquipoEditando(equipo);
    asignarMostrarModelo(true);
  };

  // Cargar equipos al iniciar el componente
  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]);

  // Filtrar equipos cuando cambia la búsqueda
  useEffect(() => {
    if (busqueda) {
      const filtrados = equipos.filter((equipo) =>
        Object.values(equipo).some((val) =>
          val && typeof val === 'object' 
            ? JSON.stringify(val).toLowerCase().includes(busqueda.toLowerCase())
            : String(val).toLowerCase().includes(busqueda.toLowerCase())
        )
      );
      setEquiposFiltrados(filtrados);
    } else {
      setEquiposFiltrados(equipos);
    }
  }, [busqueda, equipos]);

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-2xl font-bold">Mantenimientos Programados</h1>
        <div className="flex gap-2">
          <span className="p-input-icon-left">
            <i className="pi pi-search w-full" />
            <InputText
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Busqueda de ..."
            />
          </span>
          <Button
            label="Nuevo Mantenimiento"
            className="p-button-success"
            icon="pi pi-plus"
            onClick={() => {
              setEquipoEditando(null);
              asignarMostrarModelo(true);
            }}
          />
        </div>
      </div>
      <div className="tabla-con-bordes">
        <TablaEquipos
          columns={columnas}
          data={equiposFiltrados}
          loading={carga}
          onEdit={handleEditarMantenimiento}
          onDelete={manejoEliminar}
        />
      </div>
      
      {/* Aquí deberías añadir el componente modal para editar/crear mantenimientos */}
      {mostrarModelo && (
        <div>
          {/* Componente Modal que falta en el código original */}
        </div>
      )}
    </div>
  );
}