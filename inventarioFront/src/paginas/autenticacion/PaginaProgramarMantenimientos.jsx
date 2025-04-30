// Archivo: src/paginas/autenticacion/PaginaProgramarMantenimientos.jsx

import React, { useState, useCallback, useMemo } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"; // <-- 1. Importar ConfirmDialog

// Importar componentes de tabla y servicios
import { TablaEquipos } from "../../autenticacion/contexto/TablaDatos.jsx";
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";
import { mockMantenimientoService as mantenimientosService } from "../../servicios/mockMantenimientos.api.js";

// Importar datos para Dropdowns
import { DatosUbicacion } from "../../componentes/Datos/DatosUbicaciones.jsx";
import { DatosTipoEquipo } from "../../componentes/Datos/DatosTipoEquipo.jsx";
import { DatosTipoMantenimiento } from "../../componentes/Datos/DatosTipoMantenimiento.jsx";

// --- Helpers ---
const normalizeDateToISOString = (date) => {
  // ... (sin cambios)
  if (!date) return null;
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return null;
    return dateObj.toISOString().split("T")[0];
  } catch {
    return null;
  }
};

const SelectRowCheckbox = ({ row, onRowSelect, isSelected }) => {
  // ... (sin cambios)
  const id = row.original?.placa || `checkbox-${row.id}`;
  return (
    <Checkbox
      inputId={id}
      name="selectRow"
      checked={isSelected}
      onChange={() => onRowSelect(row.original?.placa)}
      disabled={!row.original?.placa}
    />
  );
};
SelectRowCheckbox.propTypes = {
  row: PropTypes.object.isRequired,
  onRowSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};
// --- Fin Helpers ---

export default function PaginaProgramarMantenimientos() {
  // --- Estados (sin cambios) ---
  const [filtroFechaCompraDesde, setFiltroFechaCompraDesde] = useState(null);
  const [filtroFechaCompraHasta, setFiltroFechaCompraHasta] = useState(null);
  const [filtroTipoEquipo, setFiltroTipoEquipo] = useState(null);
  const [filtroUbicacion, setFiltroUbicacion] = useState(null);
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [cargandoEquipos, setCargandoEquipos] = useState(false);
  const [errorCargandoEquipos, setErrorCargandoEquipos] = useState("");
  const [equiposSeleccionados, setEquiposSeleccionados] = useState({});
  const [tipoMantenimiento, setTipoMantenimiento] = useState(null);
  const [fechaProgramada, setFechaProgramada] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [cargandoProgramacion, setCargandoProgramacion] = useState(false);
  const [errorProgramacion, setErrorProgramacion] = useState("");

  const navigate = useNavigate();

  // --- Función cargarEquiposFiltrados (sin cambios) ---
  const cargarEquiposFiltrados = useCallback(async () => {
    // ... (sin cambios)
    setCargandoEquipos(true);
    setErrorCargandoEquipos("");
    setEquiposFiltrados([]);
    setEquiposSeleccionados({});

    const filtrosParaServicio = {
      fechaCompraDesde: normalizeDateToISOString(filtroFechaCompraDesde),
      fechaCompraHasta: normalizeDateToISOString(filtroFechaCompraHasta),
      tipoEquipo: filtroTipoEquipo?.value,
      ubicacion: filtroUbicacion?.value,
    };

    console.log("Llamando a servicio con filtros:", filtrosParaServicio);

    try {
      const resultados =
        await equiposService.getEquiposByFilters(filtrosParaServicio);
      const equiposActivos = resultados.filter((eq) => eq.estado !== "Baja");
      setEquiposFiltrados(equiposActivos);
    } catch (err) {
      const errorMessage =
        err.message || "Error desconocido al cargar equipos.";
      setErrorCargandoEquipos(`Error al cargar equipos: ${errorMessage}`);
      console.error("Error cargando equipos para programar:", err);
      toast.error(`Error al cargar equipos: ${errorMessage}`);
    } finally {
      setCargandoEquipos(false);
    }
  }, [
    filtroFechaCompraDesde,
    filtroFechaCompraHasta,
    filtroTipoEquipo,
    filtroUbicacion,
  ]);

  // --- Lógica de Selección (sin cambios) ---
  const handleRowSelect = useCallback((placa) => {
    // ... (sin cambios)
    if (!placa) return;
    setEquiposSeleccionados((prev) => {
      const newState = { ...prev };
      if (newState[placa]) delete newState[placa];
      else newState[placa] = true;
      return newState;
    });
  }, []);

  const handleSelectAll = useCallback(
    (isSelected) => {
      // ... (sin cambios)
      const newSeleccionados = {};
      if (isSelected) {
        equiposFiltrados.forEach((equipo) => {
          if (equipo.placa) newSeleccionados[equipo.placa] = true;
        });
      }
      setEquiposSeleccionados(newSeleccionados);
    },
    [equiposFiltrados]
  );

  const isAllSelected = useMemo(() => {
    // ... (sin cambios)
    const numSelected = Object.keys(equiposSeleccionados).length;
    const numFiltradosConPlaca = equiposFiltrados.filter(
      (eq) => eq.placa
    ).length;
    return numFiltradosConPlaca > 0 && numSelected === numFiltradosConPlaca;
  }, [equiposSeleccionados, equiposFiltrados]);

  // --- Función base para la lógica de programación ---
  const _programarMantenimientos = useCallback(
    async (placasAProgramar) => {
      // Validaciones comunes
      if (!tipoMantenimiento) {
        toast.warn("Seleccione un tipo de mantenimiento.");
        return false;
      }
      if (!fechaProgramada) {
        toast.warn("Seleccione una fecha programada.");
        return false;
      }
      const fechaProgramadaISO = normalizeDateToISOString(fechaProgramada);
      if (!fechaProgramadaISO) {
        toast.error("Fecha programada inválida.");
        return false;
      }
      if (placasAProgramar.length === 0) {
        toast.warn("No hay equipos válidos para programar.");
        return false;
      }

      setCargandoProgramacion(true);
      setErrorProgramacion("");

      try {
        const tecnicoAsignado = "Técnico Por Defecto"; // Placeholder

        const programacionPromises = placasAProgramar.map(async (placa) => {
          const equipo = equiposFiltrados.find((e) => e.placa === placa);
          if (!equipo) {
            console.warn(
              `Equipo ${placa} no encontrado en la lista filtrada actual.`
            );
            return null; // O lanzar un error si se prefiere
          }

          const datosParaMantenimiento = {
            equipoPlaca: placa,
            tipo: tipoMantenimiento.value,
            fechaProgramada: fechaProgramadaISO,
            tecnico: tecnicoAsignado,
            descripcion: descripcion,
            fechaRealizacion: null,
            estado: "Programado",
            ubicacion: equipo.ubicacion,
          };
          return mantenimientosService.create(datosParaMantenimiento);
        });

        const resultados = await Promise.all(programacionPromises);
        const exitosos = resultados.filter((r) => r).length; // Contar solo los exitosos

        if (exitosos > 0) {
          toast.success(`${exitosos} mantenimiento(s) programado(s).`);
          setEquiposSeleccionados({}); // Limpiar selección individual
          navigate("/programados"); // Navegar a la lista de programados
          return true; // Indicar éxito
        } else {
          toast.warn(
            "No se pudo programar ningún mantenimiento (equipos no encontrados o error)."
          );
          return false; // Indicar fallo
        }
      } catch (err) {
        const errorMessage = err.message || "Error desconocido al programar.";
        setErrorProgramacion(`Error: ${errorMessage}`);
        console.error("Error programando:", err);
        toast.error(`Error al programar: ${errorMessage}`);
        return false; // Indicar fallo
      } finally {
        setCargandoProgramacion(false);
      }
    },
    [
      tipoMantenimiento,
      fechaProgramada,
      equiposFiltrados,
      descripcion,
      navigate,
    ]
  );

  // --- Handler para Programar SELECCIONADOS ---
  const handleProgramarSeleccionados = useCallback(async () => {
    const placasSeleccionadas = Object.keys(equiposSeleccionados);
    if (placasSeleccionadas.length === 0) {
      toast.warn("Seleccione al menos un equipo.");
      return;
    }
    await _programarMantenimientos(placasSeleccionadas);
  }, [
    equiposSeleccionados,
    _programarMantenimientos, // Dependencias necesarias para _programarMantenimientos
  ]);

  // --- 4. NUEVO Handler para Programar TODOS LOS FILTRADOS ---
  const handleProgramarTodosFiltrados = useCallback(() => {
    // Validaciones básicas antes de la confirmación
    if (!tipoMantenimiento) {
      toast.warn("Seleccione un tipo de mantenimiento.");
      return;
    }
    if (!fechaProgramada) {
      toast.warn("Seleccione una fecha programada.");
      return;
    }
    if (equiposFiltrados.length === 0) {
      toast.warn("No hay equipos filtrados para programar.");
      return;
    }

    confirmDialog({
      message: `¿Está seguro de programar el mantenimiento definido para los ${equiposFiltrados.length} equipos actualmente filtrados?`,
      header: "Confirmación Masiva",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, programar todos",
      rejectLabel: "No",
      acceptClassName: "p-button-warning", // Estilo para el botón de aceptar
      accept: async () => {
        const placasFiltradas = equiposFiltrados
          .map((eq) => eq.placa)
          .filter(Boolean); // Obtener placas válidas
        await _programarMantenimientos(placasFiltradas);
      },
      reject: () => {
        toast.info("Programación masiva cancelada.");
      },
    });
  }, [
    tipoMantenimiento,
    fechaProgramada,
    equiposFiltrados,
    _programarMantenimientos, // Dependencias necesarias para _programarMantenimientos
  ]);

  // --- Definición de Columnas (sin cambios) ---
  const columnasTablaEquipos = useMemo(
    () => [
      {
        Header: () => (
          <Checkbox
            onChange={(e) => handleSelectAll(e.target.checked)}
            checked={isAllSelected}
          />
        ),
        id: "selection",
        Cell: ({ row }) => (
          <SelectRowCheckbox
            row={row}
            onRowSelect={handleRowSelect}
            isSelected={!!equiposSeleccionados[row.original?.placa]}
          />
        ),
        disableSortBy: true,
        width: 50,
      },
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
    ],
    [isAllSelected, equiposSeleccionados, handleRowSelect, handleSelectAll]
  );

  // --- Renderizado JSX ---
  return (
    <div className="p-4">
      {/* 5. Añadir componente ConfirmDialog */}
      <ConfirmDialog />

      <Card
        title="Programar Mantenimientos"
        className="w-full lg:w-10/12 xl:w-8/12 mx-auto"
      >
        {/* --- Sección de Filtros (sin cambios) --- */}
        <div className="mb-6 p-4 border rounded-md">
          {/* ... (contenido de filtros igual) ... */}
          <h3 className="text-lg font-semibold mb-4">1. Filtrar Equipos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Filtro Fecha Compra */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Compra:
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Calendar
                  inputId="fcd"
                  value={filtroFechaCompraDesde}
                  onChange={(e) => setFiltroFechaCompraDesde(e.value)}
                  dateFormat="dd/mm/yy"
                  placeholder="Desde"
                  showIcon
                  className="p-inputtext-sm w-full"
                  readOnlyInput
                  maxDate={filtroFechaCompraHasta || new Date()}
                />
                <span className="hidden sm:inline">-</span>
                <Calendar
                  inputId="fch"
                  value={filtroFechaCompraHasta}
                  onChange={(e) => setFiltroFechaCompraHasta(e.value)}
                  dateFormat="dd/mm/yy"
                  placeholder="Hasta"
                  showIcon
                  className="p-inputtext-sm w-full"
                  readOnlyInput
                  minDate={filtroFechaCompraDesde}
                  maxDate={new Date()}
                />
              </div>
            </div>
            {/* Filtro Tipo Equipo */}
            <div>
              
              <Dropdown
                style={{ width: "50%", marginTop: "0.5rem" }}
                inputId="fte"
                value={filtroTipoEquipo}
                onChange={(e) => setFiltroTipoEquipo(e.value)}
                options={[{ value: null, label: "Todos" }, ...DatosTipoEquipo]}
                optionLabel="label"
                placeholder="Seleccionar Tipo de Equipo"
                className="p-inputtext-sm w-full"
                showClear
              />
            </div>
            {/* Filtro Ubicación */}
            <div>
              
              <Dropdown
               style={{ width: "50%", marginTop: "0.5rem" }}
                inputId="fu"
                value={filtroUbicacion}
                onChange={(e) => setFiltroUbicacion(e.value)}
                options={[{ value: null, label: "Todas" }, ...DatosUbicacion]}
                optionLabel="label"
                placeholder="Seleccionar Ubicación"
                className="p-inputtext-sm w-full"
                showClear
              />
            </div>
          </div>
          {/* Botón Aplicar Filtros */}
          <div className="text-right mt-2">
            <Button
            style={{ width: "50%" }}
              label="Aplicar Filtros"
              icon="pi pi-filter"
              onClick={cargarEquiposFiltrados}
              disabled={cargandoEquipos}
              className="p-button-sm"
            />
          </div>
        </div>

        {/* --- Sección Lista de Equipos (sin cambios) --- */}
        <div className="mb-6">
          {/* ... (contenido lista equipos igual) ... */}
          <h3 className="text-lg font-semibold mb-2">
            Equipos Encontrados ({equiposFiltrados.length})
          </h3>
          {errorCargandoEquipos && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {errorCargandoEquipos}
            </div>
          )}
          <TablaEquipos
            columns={columnasTablaEquipos}
            data={equiposFiltrados}
            loading={cargandoEquipos}
          />
        </div>

        {/* --- Sección Detalles del Mantenimiento (MODIFICADA) --- */}
        {/* Mostrar sección si hay equipos filtrados (para poder programar todos) */}
        {equiposFiltrados.length > 0 && (
          <div className="mb-6 p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">
              {Object.keys(equiposSeleccionados).length > 0
                ? `2. Programar Mantenimiento para ${Object.keys(equiposSeleccionados).length} equipo(s) seleccionado(s)`
                : `2. Definir Mantenimiento a Programar`}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo Mantenimiento */}
              <div>
                <label
                  htmlFor="tm"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tipo Mantenimiento <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  inputId="tm"
                  value={tipoMantenimiento}
                  onChange={(e) => setTipoMantenimiento(e.value)}
                  options={DatosTipoMantenimiento}
                  optionLabel="label"
                  placeholder="Seleccionar Tipo"
                  className="p-inputtext-sm w-full"
                />
              </div>
              {/* Fecha Programada */}
              <div>
                <label
                  htmlFor="fp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Fecha Programada <span className="text-red-500">*</span>
                </label>
                <Calendar
                  inputId="fp"
                  value={fechaProgramada}
                  onChange={(e) => setFechaProgramada(e.value)}
                  dateFormat="dd/mm/yy"
                  placeholder="dd/mm/yyyy"
                  showIcon
                  className="p-inputtext-sm w-full"
                  readOnlyInput
                  // minDate={new Date()} // <-- 2. ELIMINADO minDate
                />
              </div>
              {/* Descripción */}
              <div className="col-span-full">
                <label
                  htmlFor="desc"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Descripción
                </label>
                <InputTextarea
                  inputId="desc"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                  placeholder="Notas o detalles..."
                  className="p-inputtext-sm w-full"
                />
              </div>
            </div>

            {/* Botones de Programación */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Botón Programar SELECCIONADOS */}
              <button
                label={
                  cargandoProgramacion
                    ? "Programando..."
                    : `Programar Seleccionados (${Object.keys(equiposSeleccionados).length})`
                }
                icon="pi pi-check-square"
                onClick={handleProgramarSeleccionados}
                disabled={
                  cargandoProgramacion ||
                  Object.keys(equiposSeleccionados).length === 0 ||
                  !tipoMantenimiento ||
                  !fechaProgramada
                }
                className="w-full p-button-success"
              />
              {/* 3. NUEVO Botón Programar TODOS LOS FILTRADOS */}
              <button
                label={
                  cargandoProgramacion
                    ? "Programando..."
                    : `Programar Todos los Filtrados (${equiposFiltrados.length})`
                }
                icon="pi pi-calendar-plus"
                onClick={handleProgramarTodosFiltrados}
                disabled={
                  cargandoProgramacion ||
                  equiposFiltrados.length === 0 ||
                  !tipoMantenimiento ||
                  !fechaProgramada
                }
                className="w-full p-button-warning" // Color diferente
                tooltip="Programa el mantenimiento definido para TODOS los equipos listados arriba"
                tooltipOptions={{ position: "bottom" }}
              />
            </div>
            {errorProgramacion && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {errorProgramacion}
              </div>
            )}
          </div>
        )}

        {/* --- Enlace Volver (sin cambios) --- */}
        <div className="text-center mt-6 border-t pt-4">
          {/* ... (enlace igual) ... */}
          <Link
            to="/programados"
            className="text-blue-600 hover:underline text-sm"
          >
            Volver a Mantenimientos Programados
          </Link>
        </div>
      </Card>
    </div>
  );
}
