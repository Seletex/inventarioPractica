// Archivo: src/paginas/autenticacion/PaginaConsultas.jsx

import React, { useState, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton"; // Para elegir Equipo/Mantenimiento
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag"; // Para mostrar estado/tipo en tabla

// Importar Tabla y Servicios
import { TablaEquipos } from "../../autenticacion/contexto/TablaDatos.jsx";
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";
import { mockMantenimientoService as mantenimientosService } from "../../servicios/mockMantenimientos.api.js";

// Importar Datos para Dropdowns
import { DatosUbicacion } from "../../componentes/Datos/DatosUbicaciones.jsx";
import { DatosTipoEquipo } from "../../componentes/Datos/DatosTipoEquipo.jsx";
import { DatosTipoMantenimiento } from "../../componentes/Datos/DatosTipoMantenimiento.jsx"; // Necesario para filtro tipo mant.

// Helper para fechas
const normalizeDateToISOString = (date) => {
  if (!date || !(date instanceof Date || typeof date === "string")) return null;
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      console.warn("Invalid date provided:", date);
      return null;
    }
    return dateObj.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error normalizing date:", error);
    return null;
  }
};

export default function PaginaConsultas() {
  // --- Estado para Selección de Entidad ---
  const [entidadSeleccionada, setEntidadSeleccionada] = useState("equipo"); // 'equipo' o 'mantenimiento'
  const opcionesEntidad = [
    { label: "Consultar Equipos", value: "equipo" },
    { label: "Consultar Mantenimientos", value: "mantenimiento" },
  ];

  // --- Estado para Filtros ---
  const [filtroPlaca, setFiltroPlaca] = useState("");
  const [filtroUbicacion, setFiltroUbicacion] = useState(null); // { value, label }
  const [filtroFechaDesde, setFiltroFechaDesde] = useState(null);
  const [filtroFechaHasta, setFiltroFechaHasta] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState(null); // { value, label } - Cambia según entidad

  // --- Estado para Resultados ---
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const toast = useRef(null);

  // --- Opciones dinámicas para Dropdowns ---
  const opcionesUbicacionDropdown = useMemo(
    () => [{ value: null, label: "Todas las Ubicaciones" }, ...DatosUbicacion],
    []
  );

  const opcionesTipoDropdown = useMemo(() => {
    const opcionesBase = [{ value: null, label: "Todos los Tipos" }];
    if (entidadSeleccionada === "equipo") {
      return [...opcionesBase, ...DatosTipoEquipo];
    } else if (entidadSeleccionada === "mantenimiento") {
      return [...opcionesBase, ...DatosTipoMantenimiento];
    }
    return opcionesBase; // Por defecto o si no hay entidad
  }, [entidadSeleccionada]);

  // --- Lógica de Consulta ---
  const handleConsultar = useCallback(async () => {
    setCargando(true);
    setError("");
    setResultados([]);

    const filtros = {
      placa: filtroPlaca.trim() !== "" ? filtroPlaca.trim() : null, // Convert empty string to null
      ubicacion:
        filtroUbicacion && filtroUbicacion.value ? filtroUbicacion.value : null, // Safely access value
      fechaDesde: filtroFechaDesde
        ? normalizeDateToISOString(filtroFechaDesde)
        : null, // Normalize date or set null
      fechaHasta: filtroFechaHasta
        ? normalizeDateToISOString(filtroFechaHasta)
        : null,
      tipo: filtroTipo?.value,
      // Podrías añadir más filtros específicos si los servicios los soportan
    };

    console.log(`Consultando ${entidadSeleccionada} con filtros:`, filtros);

    try {
      let data = [];
      if (entidadSeleccionada === "equipo") {
        // Asumimos que getEquiposByFilters puede filtrar por placa, ubicacion, fechaCompra, tipoEquipo
        data = await equiposService.getEquiposByFilters({
          ...filtros,
          fechaCompraDesde: filtros.fechaDesde, // Renombrar para el servicio de equipos
          fechaCompraHasta: filtros.fechaHasta,
          tipoEquipo: filtros.tipo,
        });
      } else if (entidadSeleccionada === "mantenimiento") {
        // Asumimos que getMantenimientosByFilters puede filtrar por equipoPlaca, ubicacion, fechaProgramada/Realizacion, tipo
        data = await mantenimientosService.getMantenimientosByFilters({
          ...filtros,
          equipoPlaca: filtros.placa, // Renombrar si el servicio espera equipoPlaca
          // El servicio debería manejar cómo filtrar por fecha (programada, realización o ambas)
        });
      }
      setResultados(data || []);
      if (data.length === 0) {
        toast.current?.show({
          severity: "info",
          summary: "Información",
          detail: "No se encontraron resultados con los filtros aplicados.",
          life: 3000,
        });
      }
    } catch (err) {
      const errorMessage =
        err.message || `Error desconocido al consultar ${entidadSeleccionada}.`;
      setError(`Error: ${errorMessage}`);
      console.error(`Error consultando ${entidadSeleccionada}:`, err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 5000,
      });
    } finally {
      setCargando(false);
    }
  }, [
    entidadSeleccionada,
    filtroPlaca,
    filtroUbicacion,
    filtroFechaDesde,
    filtroFechaHasta,
    filtroTipo,
  ]);

  // --- Definición de Columnas (Dinámicas) ---
  const columnasEquipos = useMemo(
    () => [
      { Header: "Placa", accessor: "placa" },
      { Header: "Tipo Equipo", accessor: "tipoEquipo" },
      { Header: "Marca", accessor: "marca" },
      { Header: "Modelo", accessor: "modelo" },
      { Header: "Ubicación", accessor: "ubicacion" },
      {
        Header: "Fecha Compra",
        accessor: "fechaCompra",
        Cell: ({ value }) => normalizeDateToISOString(value) || "-",
      },
      {
        Header: "Estado",
        accessor: "estado",
        Cell: ({ value }) => (
          <Tag
            severity={value === "Baja" ? "danger" : "success"}
            value={value}
          />
        ),
      },
    ],
    []
  );

  const columnasMantenimientos = useMemo(
    () => [
      { Header: "Placa Equipo", accessor: "equipoPlaca" }, // Asumiendo que el servicio devuelve equipoPlaca
      {
        Header: "Tipo Mant.",
        accessor: "tipo",
        Cell: ({ value }) => (
          <Tag
            severity={value === "Preventivo" ? "info" : "warning"}
            value={value}
          />
        ),
      },
      {
        Header: "Fecha Prog.",
        accessor: "fechaProgramada",
        Cell: ({ value }) => normalizeDateToISOString(value) || "-",
      },
      {
        Header: "Fecha Realiz.",
        accessor: "fechaRealizacion",
        Cell: ({ value }) =>
          normalizeDateToISOString(value) || (
            <Tag severity="warning" value="Pendiente" />
          ),
      },
      { Header: "Técnico", accessor: "tecnico" },
      {
        Header: "Estado Mant.",
        accessor: "estado",
        Cell: ({ value }) => (
          <Tag
            severity={
              value === "Programado"
                ? "info"
                : value === "Realizado"
                  ? "success"
                  : "secondary"
            }
            value={value}
          />
        ),
      },
      { Header: "Ubicación Eq.", accessor: "ubicacion" }, // Ubicación del equipo en el momento del mantenimiento
    ],
    []
  );

  const columnasActuales = useMemo(() => {
    return entidadSeleccionada === "equipo"
      ? columnasEquipos
      : columnasMantenimientos;
  }, [entidadSeleccionada, columnasEquipos, columnasMantenimientos]);

  // --- Resetear filtros al cambiar de entidad ---
  const handleEntidadChange = (e) => {
    setEntidadSeleccionada(e.value);
    // Resetear filtros que dependen de la entidad o todos
    setFiltroPlaca("");
    setFiltroUbicacion(null);
    setFiltroFechaDesde(null);
    setFiltroFechaHasta(null);
    setFiltroTipo(null);
    setResultados([]); // Limpiar resultados anteriores
    setError("");
  };

  // --- Título del Card con botón para volver al menú principal ---
  const cardTitle = (
    <div className="flex items-center justify-between">
      <span>Consultas Generales</span>
      <Link to="/menu">
        <Button
          icon="pi pi-arrow-left"
          className="p-button-text p-button-sm"
          tooltip="Volver al Menú Principal"
          tooltipOptions={{ position: "bottom" }}
        />
      </Link>
    </div>
  );

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <Card title={cardTitle} className="w-full">
        {/* 1. Selección de Entidad */}
        <div className="mb-6 text-center">
          <SelectButton
            style={{ width: "100%", textAlign: "center" }}
            // Add a custom class for styling
            className="entity-selector center"
            value={entidadSeleccionada}
            options={opcionesEntidad}
            onChange={handleEntidadChange}
            optionLabel="label"
            itemTemplate={(option) => (
              <span className="px-2">{option.label}</span>
            )} // Añadir padding
          />
        </div>

        {/* 2. Filtros */}
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Aplicar Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro Placa */}
            <div>
              
              <InputText
                id="filtroPlaca"
                value={filtroPlaca}
                onChange={(e) => setFiltroPlaca(e.target.value)}
                placeholder="Placa del Equipo 12234"
                className="p-inputtext-sm w-full"
                style={{ fontSize: "18px", minWidth: "300px", maxWidth: "400px" }} // Cambiar tamaño de fuente
              />
            </div>

            {/* Filtro Ubicación */}
            <div style={{fontSize: "21px", marginTop: "10px"}}>
              <label
              style={{fontSize: "21px"}}
                htmlFor="filtroUbicacion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ubicación:
              </label>
              <Dropdown
                inputId="filtroUbicacion"
                value={filtroUbicacion}
                onChange={(e) => setFiltroUbicacion(e.value)}
                options={opcionesUbicacionDropdown}
                optionLabel="label"
                placeholder="Todas"
                className="p-inputtext-sm w-full"
                showClear
              />
            </div>

            {/* Filtro Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {entidadSeleccionada === "equipo"
                  ? "Fecha Compra:"
                  : "Fecha Mantenimiento:"}
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Calendar
                  inputId="filtroFechaDesde"
                  value={filtroFechaDesde}
                  onChange={(e) => setFiltroFechaDesde(e.value)}
                  dateFormat="dd/mm/yy"
                  placeholder="Desde"
                  showIcon
                  className="p-inputtext-sm w-full"
                  readOnlyInput
                  maxDate={filtroFechaHasta || new Date()}
                />
                <span className="hidden sm:inline">-</span>
                <Calendar
                  inputId="filtroFechaHasta"
                  value={filtroFechaHasta}
                  onChange={(e) => setFiltroFechaHasta(e.value)}
                  dateFormat="dd/mm/yy"
                  placeholder="Hasta"
                  showIcon
                  className="p-inputtext-sm w-full"
                  readOnlyInput
                  minDate={filtroFechaDesde}
                  maxDate={new Date()}
                />
              </div>
            </div>

            {/* Filtro Tipo (Equipo o Mantenimiento) */}
            <div>
              <label
              style={{fontSize: "21px"}}  
                htmlFor="filtroTipo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {entidadSeleccionada === "equipo"
                  ? "Tipo Equipo:"
                  : "Tipo Mantenimiento:"}
              </label>
              <Dropdown
                style={{fontSize: "21px"}}
                inputId="filtroTipo"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.value)}
                options={opcionesTipoDropdown}
                optionLabel="label"
                placeholder="Todos"
                className="p-inputtext-sm w-full"
                showClear
              />
            </div>
          </div>
          {/* Botón Consultar */}
          <div className="text-center mt-6">
            <Button
            style={{fontSize: "21px"}}
              label="Consultar"
              icon="pi pi-search"
              onClick={handleConsultar}
              disabled={cargando}
              className="p-button-primary px-6"
            />
          </div>
        </div>

        {/* 3. Resultados */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">
            Resultados de la Consulta ({resultados.length})
          </h3>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <TablaEquipos // Reutilizamos TablaDatos
            columns={columnasActuales}
            data={resultados}
            loading={cargando}
          />
        </div>
      </Card>
    </div>
  );
}
