import React, { useState, useRef, useMemo, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { toast as toastify } from "react-toastify";

// Lazy loading para componentes de PrimeReact
const Card = lazy(() =>
  import("primereact/card").then((module) => ({ default: module.Card }))
);
const Button = lazy(() =>
  import("primereact/button").then((module) => ({ default: module.Button }))
);
const SelectButton = lazy(() =>
  import("primereact/selectbutton").then((module) => ({
    default: module.SelectButton,
  }))
);
const Dropdown = lazy(() =>
  import("primereact/dropdown").then((module) => ({ default: module.Dropdown }))
);
const FileUpload = lazy(() =>
  import("primereact/fileupload").then((module) => ({
    default: module.FileUpload,
  }))
);
const Calendar = lazy(() =>
  import("primereact/calendar").then((module) => ({ default: module.Calendar }))
);
const Checkbox = lazy(() =>
  import("primereact/checkbox").then((module) => ({ default: module.Checkbox }))
);
const Toast = lazy(() =>
  import("primereact/toast").then((module) => ({ default: module.Toast }))
);

import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";
import { mockMantenimientoService as mantenimientosService } from "../../servicios/mockMantenimientos.api.js";

import DatosUbicacion from "../../componentes/Datos/DatosUbicaciones.jsx";
import DatosTipoEquipo from "../../componentes/Datos/DatosTipoEquipo.jsx";
import DatosTipoMantenimiento from "../../componentes/Datos/DatosTipoMantenimiento.jsx";

const opcionesAccion = [
  { label: "Importar Datos", value: "importar" },
  { label: "Exportar Datos", value: "exportar" },
];

const entidadesDisponibles = [
  { label: "Equipos", value: "equipos" },
  { label: "Mantenimientos", value: "mantenimientos" },
];

const formatosExportacion = [
  { label: "CSV", value: "csv" },
  { label: "Excel (XLSX)", value: "xlsx" },
];

const opcionesEstadoExportacion = [
  { value: "Activo", label: "Activos" },
  { value: "En mantenimiento", label: "En mantenimiento" },
  { value: "De baja", label: "De baja" },
];

const normalizeDateToISOString = (date) => {
  if (!date) return null;
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return null;
    return dateObj.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error al normalizar la fecha:", date, error);
    return null;
  }
};

export default function PaginaImportarExportar() {
  const [accionSeleccionada, setAccionSeleccionada] = useState("importar");
  const toast = useRef(null);

  const [entidadImportar, setEntidadImportar] = useState(null);
  const [archivoParaImportar, setArchivoParaImportar] = useState(null);
  const [cargandoImportacion, setCargandoImportacion] = useState(false);
  const fileUploadRef = useRef(null);

  const [entidadExportar, setEntidadExportar] = useState(null);
  const [formatoExportar, setFormatoExportar] = useState(
    formatosExportacion[0]
  );
  const [fechaDesdeExportar, setFechaDesdeExportar] = useState(null);
  const [fechaHastaExportar, setFechaHastaExportar] = useState(null);
  const [ubicacionExportar, setUbicacionExportar] = useState(null);
  const [estadosExportar, setEstadosExportar] = useState([]);
  const [tipoExportar, setTipoExportar] = useState(null);
  const [cargandoExportacion, setCargandoExportacion] = useState(false);

  const opcionesUbicacionDropdown = useMemo(
    () => [{ value: null, label: "Todas las Ubicaciones" }, ...DatosUbicacion],
    []
  );
  const opcionesTipoDropdownExportar = useMemo(() => {
    const opcionesBase = [{ value: null, label: "Todos los Tipos" }];
    if (entidadExportar?.value === "equipos") {
      return [...opcionesBase, ...DatosTipoEquipo];
    } else if (entidadExportar?.value === "mantenimientos") {
      return [...opcionesBase, ...DatosTipoMantenimiento];
    }
    return opcionesBase;
  }, [entidadExportar]);

  const handleSeleccionarArchivo = (event) => {
    if (event.files && event.files.length > 0) {
      setArchivoParaImportar(event.files[0]);
      toast.current.show({
        severity: "info",
        summary: "Archivo Seleccionado",
        detail: event.files[0].name,
        life: 3000,
      });
    }
  };

  const handleImportarDatos = async () => {
    if (!entidadImportar) {
      toast.current.show({
        severity: "warn",
        summary: "Validación",
        detail: "Seleccione el tipo de datos a importar.",
        life: 3000,
      });
      return;
    }
    if (!archivoParaImportar) {
      toast.current.show({
        severity: "warn",
        summary: "Validación",
        detail: "Seleccione un archivo para importar.",
        life: 3000,
      });
      return;
    }

    setCargandoImportacion(true);
    toast.current.show({
      severity: "info",
      summary: "Procesando",
      detail: `Importando ${entidadImportar.label} desde ${archivoParaImportar.name}...`,
      sticky: true,
    });

    console.log(
      "Simulando importación de:",
      entidadImportar.value,
      "desde archivo:",
      archivoParaImportar.name
    );
    // Ejemplo: const formData = new FormData(); formData.append('file', archivoParaImportar); formData.append('entidad', entidadImportar.value);
    // await api.post('/importar', formData);

    setTimeout(() => {
      setCargandoImportacion(false);
      toast.current.clear();
      const exito = Math.random() > 0.3;
      if (exito) {
        toast.current.show({
          severity: "success",
          summary: "Importación Exitosa",
          detail: `${entidadImportar.label} importados correctamente.`,
          life: 5000,
        });
        setArchivoParaImportar(null);
        if (fileUploadRef.current) {
          fileUploadRef.current.clear();
        }
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error de Importación",
          detail: `No se pudieron importar los ${entidadImportar.label}. Revise el formato del archivo o los logs.`,
          life: 5000,
        });
      }
    }, 2500);
  };

  const handleEstadoChangeExportar = (estadoValue) => {
    setEstadosExportar((prevEstados) =>
      prevEstados.includes(estadoValue)
        ? prevEstados.filter((e) => e !== estadoValue)
        : [...prevEstados, estadoValue]
    );
  };

  const generarContenidoCSV = (datos, entidad) => {
    if (!datos || datos.length === 0) return "";

    let cabeceras = [];
    if (entidad === "equipos") {
      cabeceras = [
        "serial", // Identificador principal
        "placa", // Sigue siendo un campo importante
        "nombreDelEquipo", // Nuevo campo
        "tipoEquipo",
        "marca",
        "modelo",
        "ubicacion",
        "responsable",
        "estado",
        "fechaCompra",
        "ip", // Nuevo campo
        "observaciones",
      ];
    } else if (entidad === "mantenimientos") {
      cabeceras = [
        "id",
        "equipoPlaca",
        "tipo",
        "descripcion",
        "fechaProgramada",
        "fechaRealizacion",
        "tecnico",
        "costo",
        "estado",
        "observaciones",
        "ubicacion",
      ];
    } else {
      cabeceras = Object.keys(datos[0]);
    }

    const filas = datos.map((fila) =>
      cabeceras
        .map((header) => {
          let valor = fila[header];
          if (valor === null || valor === undefined) valor = "";
          if (
            typeof valor === "string" &&
            (valor.includes(",") || valor.includes("\n") || valor.includes('"'))
          ) {
            valor = `"${valor.replace(/"/g, '""')}"`;
          }
          return valor;
        })
        .join(",")
    );
    return [cabeceras.join(","), ...filas].join("\n");
  };

  const descargarArchivo = (contenido, nombreArchivo, tipoMIME) => {
    const blob = new Blob([contenido], { type: tipoMIME });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportarDatos = async () => {
    if (!entidadExportar) {
      toastify.warn("Seleccione el tipo de datos a exportar.");
      return;
    }
    if (!formatoExportar) {
      toastify.warn("Seleccione el formato de exportación.");
      return;
    }

    setCargandoExportacion(true);
    toastify.info(
      `Preparando exportación de ${
        entidadExportar.label
      } en formato ${formatoExportar.label.toUpperCase()}...`,
      { autoClose: false, toastId: "export-process" }
    );

    const filtros = {
      fechaDesde: normalizeDateToISOString(fechaDesdeExportar),
      fechaHasta: normalizeDateToISOString(fechaHastaExportar),
      ubicacion: ubicacionExportar?.value,
      estados:
        entidadExportar.value === "equipos" ? estadosExportar : undefined,
      tipo: tipoExportar?.value,
    };

    if (entidadExportar.value === "equipos") {
      filtros.tipoEquipo = filtros.tipo;
      filtros.fechaCompraDesde = filtros.fechaDesde;
      filtros.fechaCompraHasta = filtros.fechaHasta;
    } /*else if (entidadExportar.value === "mantenimientos") {
    }*/

    console.log(
      "Exportando:",
      entidadExportar.value,
      "Formato:",
      formatoExportar.value,
      "Filtros:",
      filtros
    );

    try {
      let datosParaExportar = [];
      if (entidadExportar.value === "equipos") {
        datosParaExportar = await equiposService.getEquiposByFilters(filtros);
      } else if (entidadExportar.value === "mantenimientos") {
        datosParaExportar =
          await mantenimientosService.getMantenimientosByFilters(filtros);
      }

      if (datosParaExportar.length === 0) {
        toastify.dismiss("export-process");
        toastify.info(
          "No se encontraron datos para exportar con los filtros aplicados."
        );
        setCargandoExportacion(false);
        return;
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const nombreArchivoBase = `${entidadExportar.value}_export_${timestamp}`;

      if (formatoExportar.value === "csv") {
        const contenidoCSV = generarContenidoCSV(
          datosParaExportar,
          entidadExportar.value
        );
        descargarArchivo(
          contenidoCSV,
          `${nombreArchivoBase}.csv`,
          "text/csv;charset=utf-8;"
        );
        toastify.success("Datos exportados a CSV con éxito.");
      } else if (formatoExportar.value === "xlsx") {
        console.log("Simulando exportación a XLSX con SheetJS...");
        // Ejemplo con SheetJS:
        // const ws = XLSX.utils.json_to_sheet(datosParaExportar);
        // const wb = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(wb, ws, entidadExportar.label);
        // XLSX.writeFile(wb, `${nombreArchivoBase}.xlsx`);
        toastify.info(
          "La exportación a Excel (XLSX) es una función avanzada. Simulación completada."
        );
      }
      toastify.dismiss("export-process");
    } catch (error) {
      console.error("Error al exportar datos:", error);
      toastify.dismiss("export-process");
      toastify.error(
        `Error al exportar datos: ${error.message || "Error desconocido"}`
      );
    } finally {
      setCargandoExportacion(false);
    }
  };

  const cardTitle = (
    <div className="flex items-center justify-between">
      <span>Importar / Exportar Datos</span>
      <Link to="/menu">
        <Button
          icon="pi pi-arrow-left"
          className="p-button-text p-button-sm"
          tooltip="Volver al Menú"
          tooltipOptions={{ position: "bottom" }}
        />
      </Link>
    </div>
  );

  return (
    <div className="p-4">
      <Suspense
        fallback={<div className="p-4 text-center">Cargando interfaz...</div>}
      >
        <Toast ref={toast} />
        <Card title={cardTitle} className="w-full">
          {/* 1. Selección de Acción */}
          <div className="mb-6 text-center">
            <SelectButton
              value={accionSeleccionada}
              options={opcionesAccion}
              onChange={(e) => setAccionSeleccionada(e.value)}
              optionLabel="label"
              itemTemplate={(option) => (
                <span className="px-2 py-1">{option.label}</span>
              )}
              className="entity-selector"
            />
          </div>

          {/* --- SECCIÓN DE IMPORTACIÓN --- */}
          {accionSeleccionada === "importar" && (
            <div className="p-4 border rounded-md bg-gray-50">
              <h3 className="text-xl font-semibold mb-4">Importar Datos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label
                    htmlFor="entidadImportar"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tipo de Datos a Importar:
                  </label>
                  <Dropdown
                    inputId="entidadImportar"
                    name="entidadImportar"
                    value={entidadImportar}
                    options={entidadesDisponibles}
                    onChange={(e) => setEntidadImportar(e.value)}
                    optionLabel="label"
                    placeholder="Seleccione tipo de datos"
                    className="w-full p-inputtext-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="archivoImportar"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Archivo (CSV, XLSX):
                  </label>
                  <FileUpload
                    ref={fileUploadRef}
                    id="archivoImportar" // Changed from id to inputId for better label association
                    name="archivoImportar"
                    onSelect={handleSeleccionarArchivo}
                    onClear={() => setArchivoParaImportar(null)}
                    onRemove={() => setArchivoParaImportar(null)}
                    multiple={false}
                    accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                    maxFileSize={10000000}
                    chooseLabel="Seleccionar Archivo"
                    uploadLabel="Importar"
                    cancelLabel="Cancelar"
                    customUpload
                    uploadHandler={handleImportarDatos}
                    emptyTemplate={
                      <p className="m-0 p-4 text-center text-gray-500">
                        Arrastre y suelte el archivo aquí, o haga clic en
                        "Seleccionar Archivo".
                      </p>
                    }
                    className="p-fileupload-sm"
                  />
                  {archivoParaImportar && (
                    <p className="text-xs text-gray-600 mt-1">
                      Archivo seleccionado: {archivoParaImportar.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-center mt-6">
                <Button
                  label={
                    cargandoImportacion
                      ? "Importando..."
                      : "Iniciar Importación"
                  }
                  icon="pi pi-upload"
                  onClick={handleImportarDatos}
                  disabled={
                    cargandoImportacion ||
                    !archivoParaImportar ||
                    !entidadImportar
                  }
                  className="p-button-primary px-6"
                />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  <strong>Instrucciones:</strong>
                </p>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    Asegúrese de que el archivo tenga las columnas correctas
                    para el tipo de dato seleccionado.
                  </li>
                  <li>
                    Formatos soportados: CSV (delimitado por comas, UTF-8),
                    XLSX.
                  </li>
                  <li>
                    Consulte la documentación para las plantillas de ejemplo.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {accionSeleccionada === "exportar" && (
            <div className="p-4 border rounded-md bg-gray-50">
              <h3 className="text-xl font-semibold mb-4">Exportar Datos</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label
                    htmlFor="entidadExportar"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tipo de Datos a Exportar:
                  </label>
                  <Dropdown
                    id="entidadExportar"
                    name="entidadExportar"
                    value={entidadExportar}
                    options={entidadesDisponibles}
                    onChange={(e) => {
                      setEntidadExportar(e.value);
                      setEstadosExportar([]);
                      setTipoExportar(null);
                    }}
                    optionLabel="label"
                    placeholder="Seleccione tipo de datos"
                    className="w-full p-inputtext-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="formatoExportar"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Formato de Exportación:
                  </label>
                  <Dropdown
                    id="formatoExportar"
                    name="formatoExportar"
                    value={formatoExportar}
                    options={formatosExportacion}
                    onChange={(e) => setFormatoExportar(e.value)}
                    optionLabel="label"
                    className="w-full p-inputtext-sm"
                  />
                </div>
              </div>

              {entidadExportar && (
                <>
                  <h4 className="text-lg font-semibold mb-3 mt-6">
                    Aplicar Filtros (Opcional)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                    <div>
                      <label
                        htmlFor="fechaDesdeExportarInput" // Points to the first calendar
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {entidadExportar.value === "equipos"
                          ? "Fecha de Compra:"
                          : "Fecha (Programada/Realización):"}
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <Calendar
                          inputId="fechaDesdeExportarInput"
                          name="fechaDesdeExportar"
                          value={fechaDesdeExportar}
                          onChange={(e) => setFechaDesdeExportar(e.value)}
                          dateFormat="dd/mm/yy"
                          placeholder="Desde"
                          showIcon
                          className="p-inputtext-sm w-full"
                          maxDate={fechaHastaExportar || new Date()}
                        />
                        <span className="hidden sm:inline">-</span>
                        {/* Add a visually hidden label for the "Hasta" date for accessibility */}
                        <label
                          htmlFor="fechaHastaExportarInput"
                          className="sr-only"
                        >
                          Fecha hasta
                        </label>
                        <Calendar
                          inputId="fechaHastaExportarInput"
                          name="fechaHastaExportar"
                          value={fechaHastaExportar}
                          onChange={(e) => setFechaHastaExportar(e.value)}
                          dateFormat="dd/mm/yy"
                          placeholder="Hasta"
                          showIcon
                          className="p-inputtext-sm w-full"
                          minDate={fechaDesdeExportar}
                          maxDate={new Date()}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="ubicacionExportar"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Ubicación:
                      </label>
                      <Dropdown
                        id="ubicacionExportar"
                        name="ubicacionExportar"
                        value={ubicacionExportar}
                        options={opcionesUbicacionDropdown}
                        onChange={(e) => setUbicacionExportar(e.value)}
                        optionLabel="label"
                        placeholder="Todas"
                        showClear
                        className="w-full p-inputtext-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="tipoExportar"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {entidadExportar.value === "equipos"
                          ? "Tipo de Equipo:"
                          : "Tipo de Mantenimiento:"}
                      </label>
                      <Dropdown
                        id="tipoExportar"
                        name="tipoExportar"
                        value={tipoExportar}
                        options={opcionesTipoDropdownExportar}
                        onChange={(e) => setTipoExportar(e.value)}
                        optionLabel="label"
                        placeholder="Todos"
                        showClear
                        className="w-full p-inputtext-sm"
                      />
                    </div>

                    {entidadExportar.value === "equipos" && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estado del Equipo:
                        </label>
                        <div className="flex gap-x-4 gap-y-2 flex-wrap">
                          {opcionesEstadoExportacion.map((estado) => (
                            <div
                              key={estado.value}
                              className="flex items-center"
                            >
                              <Checkbox
                                inputId={`estado-export-${estado.value}`}
                                value={estado.value}
                                onChange={() =>
                                  handleEstadoChangeExportar(estado.value)
                                }
                                checked={estadosExportar.includes(estado.value)}
                                className="mr-2"
                              />
                              <label
                                htmlFor={`estado-export-${estado.value}`}
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
                </>
              )}

              <div className="text-center mt-6">
                <Button
                  label={
                    cargandoExportacion
                      ? "Exportando..."
                      : "Iniciar Exportación"
                  }
                  icon="pi pi-download"
                  onClick={handleExportarDatos}
                  disabled={
                    cargandoExportacion || !entidadExportar || !formatoExportar
                  }
                  className="p-button-success px-6"
                />
              </div>
            </div>
          )}
        </Card>
      </Suspense>
    </div>
  );
}
