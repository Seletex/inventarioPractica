import React, { useState, useCallback } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";
import { mockMantenimientoService as mantenimientosService } from "../../servicios/mockMantenimientos.api.js";

// Importar arrays de datos para filtros
import { DatosUbicacion } from "../../componentes/Datos/DatosUbicaciones.jsx";

// --- Definir las opciones de tipos de reporte ---
const tiposReporte = [
  {
    value: "inventarioCompleto",
    label: "Inventario Completo",
    description: "Todos los equipos registrados",
  },
  {
    value: "mantenimientos",
    label: "Mantenimientos",
    description: "Historial de intervenciones",
  },
  {
    value: "programaciones",
    label: "Programaciones",
    description: "Calendario de mantenimientos",
  },
];

// --- Definir las opciones de estado para el filtro ---
const opcionesEstado = [
  { value: "Activo", label: "Activos" },
  { value: "En mantenimiento", label: "En mantenimiento" },
  { value: "De baja", label: "De baja" },
];

export default function PaginaGeneradorReportes() {
  // --- Estado para los filtros y el tipo de reporte seleccionado ---
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [fechaDesde, setFechaDesde] = useState(null);
  const [fechaHasta, setFechaHasta] = useState(null);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null); // Almacena el objeto {value, label} o null
  const [estadosSeleccionados, setEstadosSeleccionados] = useState([]);

  // Estado para el resultado del reporte
  const [datosReporte, setDatosReporte] = useState(null); // Inicia como null para diferenciar de un array vacío []
  const [cargandoReporte, setCargandoReporte] = useState(false);
  const [errorReporte, setErrorReporte] = useState("");

  // --- Helper para normalizar fechas a YYYY-MM-DD ---
  const normalizeDateToISOString = (date) => {
    if (!date) return null;
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return null;
      return dateObj.toISOString().split("T")[0];
    } catch (e) {
      console.error("Error normalizing date:", date, e);
      return null;
    }
  };
  

  // --- Función para manejar la generación del reporte ---
  const handleGenerarReporte = useCallback(async () => {
    if (!reporteSeleccionado) {
      toast.warn("Por favor, seleccione un tipo de reporte.");
      return;
    }

    setCargandoReporte(true);
    setErrorReporte("");
    setDatosReporte(null); // Limpiar resultados anteriores

    const filtros = {
      fechaDesde: normalizeDateToISOString(fechaDesde),
      fechaHasta: normalizeDateToISOString(fechaHasta),
      ubicacion: ubicacionSeleccionada?.value, // Extrae el 'value' de la ubicación seleccionada
      estados: estadosSeleccionados,
    };

    console.log(
      "Generando reporte:",
      reporteSeleccionado.value,
      "con filtros:",
      filtros
    );

    try {
      let resultados = [];
      switch (reporteSeleccionado.value) {
        case "inventarioCompleto":
          resultados = await equiposService.getEquiposByFilters(filtros);
          break;
        case "mantenimientos":
        case "programaciones":
          // Asegúrate que getMantenimientosByFilters exista y funcione en tu servicio
          resultados =
            await mantenimientosService.getMantenimientosByFilters(filtros);
          break;
        default:
          throw new Error("Tipo de reporte no válido."); // Lanza error para el catch
      }
      setDatosReporte(resultados); // Guardar los resultados (puede ser un array vacío)
    } catch (err) {
      const errorMessage =
        err.message || "Error desconocido al generar reporte.";
      setErrorReporte(`Error al generar reporte: ${errorMessage}`);
      console.error("Error generando reporte:", err);
      toast.error(`Error al generar reporte: ${errorMessage}`);
      setDatosReporte(null); // Asegurarse que no haya datos si hubo error
    } finally {
      setCargandoReporte(false);
    }
  }, [
    reporteSeleccionado,
    fechaDesde,
    fechaHasta,
    ubicacionSeleccionada,
    estadosSeleccionados,
  ]);

  // --- Manejar el cambio en los checkboxes de estado ---
  const handleEstadoChange = (estadoValue) => {
    setEstadosSeleccionados((prevEstados) => {
      if (prevEstados.includes(estadoValue)) {
        return prevEstados.filter((estado) => estado !== estadoValue);
      } else {
        return [...prevEstados, estadoValue];
      }
    });
  };

  // --- Opciones para el Dropdown de Ubicación (incluyendo "Todas") ---
  const opcionesUbicacionDropdown = [
    { value: null, label: "Todas las ubicaciones" }, // Opción para no filtrar por ubicación
    ...DatosUbicacion, // Asume que DatosUbicacion es un array de { value: string, label: string }
  ];

  return (
    <div className="p-4 flex justify-center">
      {" "}
      {/* Centrar el Card */}
      <Card
        title="Generador de Reportes"
        className="w-full max-w-3xl" // Ancho máximo más grande para acomodar filtros y tabla
        style={{ fontSize: "16px" }}
      >
        {/* --- Sección de Tipos de Reporte --- */}
        <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">
          1. Seleccione el Tipo de Reporte
        </h3>
        {/* Usamos GRID de nuevo para una alineación más predecible */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"> {/* 1 columna en móvil, 3 en pantallas sm y mayores */}
          {tiposReporte.map((tipo) => (
            <Button
              key={tipo.value}
              label={tipo.label}
              // Mantenemos las clases de tamaño y estilo condicional
              className={`p-button-lg w-full ${ // w-full para que ocupen el ancho de la celda del grid
                reporteSeleccionado?.value === tipo.value
                  ? 'p-button-primary'
                  : 'p-button-secondary p-button-outlined'
              }`}
              // Quitamos el minWidth y flex-1/flex-none, el grid se encarga del ancho
              onClick={() => {
                setReporteSeleccionado(tipo);
                setDatosReporte(null);
                setErrorReporte("");
              }}
              tooltip={tipo.description}
              tooltipOptions={{ position: 'bottom' }}
            />
          ))}
        </div>
      </div>

        {/* --- Sección de Filtros (Condicional) --- */}
        {reporteSeleccionado && (
          <div className="mb-6 p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">
              2. Aplique Filtros (Opcional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {" "}
              {/* Layout para filtros */}
              {/* Filtro de Rango Temporal (Solo para mantenimientos/programaciones) */}
              {(reporteSeleccionado.value === "mantenimientos" ||
                reporteSeleccionado.value === "programaciones") && (
                <div className="mb-4 md:col-span-2">
                  {" "}
                  {/* Ocupa todo el ancho en móvil, mitad en desktop */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rango Temporal:
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <Calendar
                      id="fechaDesde"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.value)}
                      dateFormat="dd/mm/yy"
                      placeholder="Desde (dd/mm/yyyy)"
                      showIcon
                      className="p-inputtext-sm w-full sm:w-auto"
                      maxDate={fechaHasta || new Date()} // No permitir fecha desde mayor que fecha hasta
                    />
                    <span className="hidden sm:inline">-</span>
                    <Calendar
                      id="fechaHasta"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.value)}
                      dateFormat="dd/mm/yy"
                      placeholder="Hasta (dd/mm/yyyy)"
                      showIcon
                      className="p-inputtext-sm w-full sm:w-auto"
                      minDate={fechaDesde} // No permitir fecha hasta menor que fecha desde
                      maxDate={new Date()} // No permitir fechas futuras (opcional)
                    />
                  </div>
                </div>
              )}
              {/* Filtro de Ubicación (Para todos los tipos de reporte) */}
              <div className="mb-4">
                <label
                  htmlFor="ubicacion"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ubicación:
                </label>
                <Dropdown
                  id="ubicacion"
                  value={ubicacionSeleccionada} // El estado almacena el objeto completo o null
                  onChange={(e) => setUbicacionSeleccionada(e.value)} // e.value es el objeto {value, label} o null
                  options={opcionesUbicacionDropdown}
                  optionLabel="label" // Muestra la propiedad 'label'
                  placeholder="Todas las ubicaciones"
                  className="p-inputtext-sm w-full"
                  showClear={ubicacionSeleccionada !== null} // Mostrar 'x' para limpiar si hay algo seleccionado
                />
              </div>
              {/* Filtro de Estado (Solo para inventario) */}
              {reporteSeleccionado.value === "inventarioCompleto" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado del Equipo:
                  </label>
                  <div className="flex gap-x-4 gap-y-2 flex-wrap">
                    {opcionesEstado.map((estado) => (
                      <div key={estado.value} className="flex items-center">
                        <Checkbox
                          style={{ marginTop: "0.5rem" }} // Ajustar el margen superior del checkbox
                          inputId={`estado-${estado.value}`}
                          name="estados"
                          value={estado.value}
                          onChange={() => handleEstadoChange(estado.value)}
                          checked={estadosSeleccionados.includes(estado.value)}
                          className="mr-2" // Margen derecho
                        />
                        <label
                          htmlFor={`estado-${estado.value}`}
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {estado.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botón Generar Reporte */}
            <div className="mt-4 text-center">
              <Button
                label={cargandoReporte ? "Generando..." : "Generar Reporte"}
                icon="pi pi-file-export" // Icono más adecuado
                onClick={handleGenerarReporte}
                disabled={cargandoReporte || !reporteSeleccionado}
                className="p-button-primary px-6" // Estilo y padding
              />
            </div>
          </div>
        )}

        {/* --- Sección de Resultados (Loading/Error/Table) --- */}
        <div className="mt-6">
          {/* Indicador de Carga */}
          {cargandoReporte && (
            <div className="text-center my-6">
              <i
                className="pi pi-spin pi-spinner text-blue-500"
                style={{ fontSize: "2.5em" }}
              ></i>
              <p className="mt-2 text-gray-600">Generando reporte...</p>
            </div>
          )}

          {/* Mensaje de Error */}
          {!cargandoReporte && errorReporte && (
            <div className="my-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm">
              <p className="font-semibold">Error:</p>
              <p>{errorReporte}</p>
            </div>
          )}

          {/* Tabla de Resultados (Solo si no carga, no hay error y datosReporte NO es null) */}
          {!cargandoReporte && !errorReporte && datosReporte !== null && (
            <div>
              <h3 className="text-xl font-semibold mb-3">
                Resultados ({datosReporte.length})
              </h3>
              {datosReporte.length > 0 ? (
                <DataTable
                  value={datosReporte}
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  className="p-datatable-sm p-datatable-striped p-datatable-gridlines" // Clases adicionales para estilo
                  emptyMessage="No se encontraron resultados con los filtros aplicados."
                  responsiveLayout="scroll"
                  sortMode="multiple" // Permitir ordenar por múltiples columnas
                  removableSort // Permitir quitar el ordenamiento
                  filterDisplay="row" // Mostrar filtros por fila (opcional)
                >
                  {/* Columnas Condicionales */}
                  {reporteSeleccionado.value === "inventarioCompleto" && (
                    <>
                      <Column
                        field="placa"
                        header="Placa"
                        sortable
                        filter
                        filterPlaceholder="Buscar..."
                        style={{ minWidth: "100px" }}
                      ></Column>
                      <Column
                        field="tipoEquipo"
                        header="Tipo Equipo"
                        sortable
                        filter
                        filterPlaceholder="Buscar..."
                        style={{ minWidth: "150px" }}
                      ></Column>
                      <Column
                        field="marca"
                        header="Marca"
                        sortable
                        style={{ minWidth: "120px" }}
                      ></Column>
                      <Column
                        field="ubicacion"
                        header="Ubicación"
                        sortable
                        filter
                        filterPlaceholder="Buscar..."
                        style={{ minWidth: "150px" }}
                      ></Column>
                      <Column
                        field="responsable"
                        header="Responsable"
                        sortable
                        style={{ minWidth: "150px" }}
                      ></Column>
                      <Column
                        field="estado"
                        header="Estado"
                        sortable
                        filter
                        filterPlaceholder="Buscar..."
                        style={{ minWidth: "120px" }}
                      ></Column>
                      {/* Añade más columnas relevantes del inventario */}
                    </>
                  )}

                  {(reporteSeleccionado.value === "mantenimientos" ||
                    reporteSeleccionado.value === "programaciones") && (
                    <>
                      <Column
                        field="equipoPlaca"
                        header="Placa Equipo"
                        sortable
                        filter
                        filterPlaceholder="Buscar..."
                        style={{ minWidth: "120px" }}
                      ></Column>
                      <Column
                        field="tipo"
                        header="Tipo Mant."
                        sortable
                        filter
                        filterPlaceholder="Buscar..."
                        style={{ minWidth: "150px" }}
                      ></Column>
                      <Column
                        field="fechaProgramada"
                        header="Fecha Prog."
                        body={(rowData) =>
                          normalizeDateToISOString(rowData.fechaProgramada) ||
                          "-"
                        }
                        sortable
                        style={{ minWidth: "120px" }}
                      ></Column>
                      <Column
                        field="fechaRealizacion"
                        header="Fecha Realiz."
                        body={(rowData) =>
                          normalizeDateToISOString(rowData.fechaRealizacion) ||
                          "-"
                        }
                        sortable
                        style={{ minWidth: "120px" }}
                      ></Column>
                      <Column
                        field="tecnico"
                        header="Técnico"
                        sortable
                        filter
                        filterPlaceholder="Buscar..."
                        style={{ minWidth: "150px" }}
                      ></Column>
                      <Column
                        field="estado"
                        header="Estado Mant."
                        sortable
                        filter
                        filterPlaceholder="Buscar..."
                        style={{ minWidth: "120px" }}
                      ></Column>
                      <Column
                        field="ubicacion"
                        header="Ubicación Eq."
                        body={(rowData) => rowData.ubicacion || "-"}
                        sortable
                        style={{ minWidth: "150px" }}
                      ></Column>{" "}
                      {/* Asume que el mant. puede tener ubicación */}
                      {/* Añade más columnas relevantes del mantenimiento */}
                    </>
                  )}
                </DataTable>
              ) : (
                // Mensaje si no hay resultados pero la generación fue exitosa
                <p className="text-gray-600 italic my-4">
                  No se encontraron registros que coincidan con los filtros
                  seleccionados.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Enlace para volver */}
        <div className="text-center mt-8 border-t pt-4">
          <Link to="/menu" className="text-blue-600 hover:underline text-sm">
            Volver al Menú Principal
          </Link>
        </div>
      </Card>
    </div>
  );
}
