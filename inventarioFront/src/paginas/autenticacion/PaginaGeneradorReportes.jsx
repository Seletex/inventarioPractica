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

import { DatosUbicacion } from "../../componentes/Datos/DatosUbicaciones.jsx";

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

const opcionesEstado = [
  { value: "Activo", label: "Activos" },
  { value: "En mantenimiento", label: "En mantenimiento" },
  { value: "De baja", label: "De baja" },
];

export default function PaginaGeneradorReportes() {
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [fechaDesde, setFechaDesde] = useState(null);
  const [fechaHasta, setFechaHasta] = useState(null);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null);
  const [estadosSeleccionados, setEstadosSeleccionados] = useState([]);

  const [datosReporte, setDatosReporte] = useState(null);
  const [cargandoReporte, setCargandoReporte] = useState(false);
  const [errorReporte, setErrorReporte] = useState("");

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

  const handleGenerarReporte = useCallback(async () => {
    if (!reporteSeleccionado) {
      toast.warn("Por favor, seleccione un tipo de reporte.");
      return;
    }

    setCargandoReporte(true);
    setErrorReporte("");
    setDatosReporte(null);
    const filtros = {
      fechaDesde: normalizeDateToISOString(fechaDesde),
      fechaHasta: normalizeDateToISOString(fechaHasta),
      ubicacion: ubicacionSeleccionada?.value,
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
          resultados = await mantenimientosService.getMantenimientosByFilters(
            filtros
          );
          break;
        default:
          throw new Error("Tipo de reporte no válido.");
      }
      setDatosReporte(resultados);
    } catch (err) {
      const errorMessage =
        err.message || "Error desconocido al generar reporte.";
      setErrorReporte(`Error al generar reporte: ${errorMessage}`);
      console.error("Error generando reporte:", err);
      toast.error(`Error al generar reporte: ${errorMessage}`);
      setDatosReporte(null);
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

  const handleEstadoChange = (estadoValue) => {
    setEstadosSeleccionados((prevEstados) => {
      if (prevEstados.includes(estadoValue)) {
        return prevEstados.filter((estado) => estado !== estadoValue);
      } else {
        return [...prevEstados, estadoValue];
      }
    });
  };

  const opcionesUbicacionDropdown = [
    { value: null, label: "Todas las ubicaciones" },
    ...DatosUbicacion,
  ];

  return (
    <div className="p-4 flex justify-center">
      {" "}
      <Card
        title="Generador de Reportes"
        className="w-full max-w-3xl"
        style={{ fontSize: "16px" }}
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">
            1. Seleccione el Tipo de Reporte
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tiposReporte.map((tipo) => (
              <Button
                key={tipo.value}
                label={tipo.label}
                className={`p-button-lg w-full ${
                  reporteSeleccionado?.value === tipo.value
                    ? "p-button-primary"
                    : "p-button-secondary p-button-outlined"
                }`}
                onClick={() => {
                  setReporteSeleccionado(tipo);
                  setDatosReporte(null);
                  setErrorReporte("");
                }}
                tooltip={tipo.description}
                tooltipOptions={{ position: "bottom" }}
              />
            ))}
          </div>
        </div>

        {reporteSeleccionado && (
          <div className="mb-6 p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">
              2. Aplique Filtros (Opcional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {" "}
              {(reporteSeleccionado.value === "mantenimientos" ||
                reporteSeleccionado.value === "programaciones") && (
                <div className="mb-4 md:col-span-2">
                  {" "}
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
                      maxDate={fechaHasta || new Date()}
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
                      minDate={fechaDesde}
                      maxDate={new Date()}
                    />
                  </div>
                </div>
              )}
              <div className="mb-4">
                <label
                  htmlFor="ubicacion"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ubicación:
                </label>
                <Dropdown
                  id="ubicacion"
                  value={ubicacionSeleccionada}
                  onChange={(e) => setUbicacionSeleccionada(e.value)}
                  options={opcionesUbicacionDropdown}
                  optionLabel="label"
                  placeholder="Todas las ubicaciones"
                  className="p-inputtext-sm w-full"
                  showClear={ubicacionSeleccionada !== null}
                />
              </div>
              {reporteSeleccionado.value === "inventarioCompleto" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado del Equipo:
                  </label>
                  <div className="flex gap-x-4 gap-y-2 flex-wrap">
                    {opcionesEstado.map((estado) => (
                      <div key={estado.value} className="flex items-center">
                        <Checkbox
                          style={{ marginTop: "0.5rem" }}
                          inputId={`estado-${estado.value}`}
                          name="estados"
                          value={estado.value}
                          onChange={() => handleEstadoChange(estado.value)}
                          checked={estadosSeleccionados.includes(estado.value)}
                          className="mr-2"
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
                icon="pi pi-file-export"
                onClick={handleGenerarReporte}
                disabled={cargandoReporte || !reporteSeleccionado}
                className="p-button-primary px-6"
              />
            </div>
          </div>
        )}

        <div className="mt-6">
          {cargandoReporte && (
            <div className="text-center my-6">
              <i
                className="pi pi-spin pi-spinner text-blue-500"
                style={{ fontSize: "2.5em" }}
              ></i>
              <p className="mt-2 text-gray-600">Generando reporte...</p>
            </div>
          )}

          {!cargandoReporte && errorReporte && (
            <div className="my-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm">
              <p className="font-semibold">Error:</p>
              <p>{errorReporte}</p>
            </div>
          )}

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
                  className="p-datatable-sm p-datatable-striped p-datatable-gridlines"
                  emptyMessage="No se encontraron resultados con los filtros aplicados."
                  responsiveLayout="scroll"
                  sortMode="multiple"
                  removableSort
                  filterDisplay="row"
                >
                  {reporteSeleccionado.value === "inventarioCompleto" && (
                    <>
                      <Column
                        field="serial"
                        header="Serial"
                        sortable
                        filter
                        filterPlaceholder="Buscar..."
                        style={{ minWidth: "150px" }}
                      ></Column>
                      <Column
                        field="placa"
                        header="Placa"
                        sortable
                        filter
                        filterPlaceholder="Buscar..."
                        body={(rowData) => rowData.placa || "-"}
                        style={{ minWidth: "120px" }}
                      ></Column>
                      <Column
                        field="nombreDelEquipo"
                        header="Nombre Equipo"
                        sortable
                        filter
                        filterPlaceholder="Buscar..."
                        style={{ minWidth: "200px" }}
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
                      <Column
                        field="ip"
                        header="IP"
                        sortable
                        body={(rowData) => rowData.ip || "-"}
                        style={{ minWidth: "130px" }}
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
                    </>
                  )}
                </DataTable>
              ) : (
                <p className="text-gray-600 italic my-4">
                  No se encontraron registros que coincidan con los filtros
                  seleccionados.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-8 border-t pt-4">
          <Link to="/menu" className="text-blue-600 hover:underline text-sm">
            Volver al Menú Principal
          </Link>
        </div>
      </Card>
    </div>
  );
}
