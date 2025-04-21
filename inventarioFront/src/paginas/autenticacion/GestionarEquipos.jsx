import { useState, useEffect, useRef } from "react";
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";
import { TablaEquipos } from "../../autenticacion/contexto/TablaDatos.jsx";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import {
  confirmarCambioEstadoFn,
  cambiarEstadoEquipoFn,
  cargarEquiposFn,
  manejoEliminarFn,
  mostrarExitoFn,
  mostrarErrorFn,
} from "../../autenticacion/anzuelos/usoGestionFuncionesEquipo.js";

export default function GestionarEquipos() {
  const [equipos, setEquipos] = useState([]);
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [carga, asignarCarga] = useState(true);
  const [mostrarModelo, asignarMostrarModelo] = useState(false);
  const [setEquipoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const toast = useRef(null);

  // Definir función cargarEquipos antes de usarla en useEffect
  const cargarEquipos = async () => {
    await cargarEquiposFn(
      asignarCarga,
      equiposService,
      setEquipos,
      setEquiposFiltrados,
      mostrarError
    );
  };

  // Columnas para la tabla
  const columnas = [
    { Header: "Placa", accessor: "placa" },
    { Header: "Marca", accessor: "marca" },
    { Header: "Modelo", accessor: "modelo" },
    { Header: "Ubicación", accessor: "ubicacion" },
    {
      Header: "Estado",
      accessor: "estado",
      Cell: ({ value }) => (
        <span
          className={`estado-badge ${value === "Baja" ? "Inactivo" : "Activo"}`}
        >
          {value}
        </span>
      ),
    },
    {
      Header: "Acciones",
      accessor: "acciones",
      Cell: ({ row }) => (
        <div
          className="flex flex-row gap-1"
          style={{ display: "flex", flexWrap: "nowrap" }}
        >
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-sm p-button-text p-button-primary"
            tooltip="Editar"
            tooltipOptions={{ position: "top" }}
            onClick={() => {
              setEquipoEditando(row.original);
              asignarMostrarModelo(true);
            }}
          />
          <Button
            icon="pi pi-power-off"
            className="p-button-rounded p-button-sm p-button-text p-button-warning"
            tooltip="Dar de baja"
            tooltipOptions={{ position: "top" }}
            onClick={() =>
              confirmarCambioEstadoFn(
                row.original.id,
                "Baja",
                cambiarEstadoEquipo
              )
            }
            disabled={row.original.estado === "Baja"}
          />
        </div>
      ),
      disableSortBy: true,
      style: { whiteSpace: "nowrap" },
      width: 150,
    },
  ];

  // Cargar equipos al iniciar
  useEffect(() => {
    cargarEquipos(
      asignarCarga,
      equiposService,
      setEquipos,
      setEquiposFiltrados,
      mostrarError
    );
  }, []);

  // Filtrar equipos cuando cambia la búsqueda
  useEffect(() => {
    if (busqueda) {
      const filtrados = equipos.filter((equipo) =>
        Object.values(equipo).some((val) =>
          val.toString().toLowerCase().includes(busqueda.toLowerCase())
        )
      );
      setEquiposFiltrados(filtrados);
    } else {
      setEquiposFiltrados(equipos);
    }
  }, [busqueda, equipos]);

  // Función para cambiar estado de equipo
  const cambiarEstadoEquipo = async (id, nuevoEstado) => {
    await cambiarEstadoEquipoFn(
      id,
      nuevoEstado,
      equipos,
      equiposService,
      mostrarExito,
      cargarEquipos,
      mostrarError
    );
  };

  // Función para eliminar equipo
  const manejoEliminar = async (id) => {
    await manejoEliminarFn(
      id,
      equiposService,
      mostrarExito,
      cargarEquipos,
      mostrarError
    );
  };

  // Funciones para mensajes
  const mostrarExito = (mensaje) => {
    mostrarExitoFn(mensaje, toast);
  };

  const mostrarError = (mensaje) => {
    mostrarErrorFn(mensaje, toast);
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
              className="w-full"
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
      <div className="tabla-con-bordes">
        <TablaEquipos
          columns={columnas}
          data={equiposFiltrados}
          loading={carga}
          onDelete={manejoEliminar}
        />
      </div>

      {/* Aquí falta el componente para mostrar/editar un equipo */}
      {mostrarModelo && (
        <div>{/* Aquí iría tu componente de modal/formulario */}</div>
      )}
    </div>
  );
}
