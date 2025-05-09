import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";
import { TablaEquipos } from "../../autenticacion/contexto/TablaDatos.jsx";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { useNavigate } from "react-router-dom";

import {
  confirmarCambioEstadoFn,
  cambiarEstadoEquipoFn,
  cargarEquiposFn,
  mostrarExitoFn,
  mostrarErrorFn,
} from "../../autenticacion/anzuelos/usoGestionFuncionesEquipo.js";
import { normalizarString } from "../../componentes/utiles/UtilidadesTexto.jsx";
import {
  utilizarConsultaMedios,
  utilizarRebote,
} from "../../componentes/utiles/GanchosAMedida.jsx";

export default function GestionarEquipos() {
  const [equipos, setEquipos] = useState([]);
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [carga, asignarCarga] = useState(true);
  const [mostrarModelo, asignarMostrarModelo] = useState(false);
  const [equipoEditando, setEquipoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();

  const getEstadoSeverity = (estado) => {
    const lowerEstado = estado?.toLowerCase();
    if (lowerEstado === "activo") return "success";
    if (lowerEstado === "inactivo") return "warning";
    if (lowerEstado === "baja") return "danger";
    if (lowerEstado === "mantenimiento") return "info";
    return "info";
  };
  const mostrarMensajeExito = useCallback((mensaje) => {
    mostrarExitoFn(mensaje, toast);
  }, []);

  const mostrarMensajeError = useCallback((mensaje) => {
    mostrarErrorFn(mensaje, toast);
  }, []);

  const busquedaDebounced = utilizarRebote(busqueda, 300);
  const esMovilPequeno = utilizarConsultaMedios("(max-width: 575px)");

  const cargarEquipos = useCallback(async () => {
    await cargarEquiposFn(
      asignarCarga,
      equiposService,
      setEquipos,
      setEquiposFiltrados,
      mostrarMensajeError
    );
    // Alternativa: Lógica directa
    // asignarCarga(true);
    // try {
    //   const data = await equiposService.getAll();
    //   setEquipos(data || []);
    //   setEquiposFiltrados(data || []);
    // } catch (error) {
    //   mostrarError(error.message || "Error al cargar equipos");
    //   setEquipos([]);
    //   setEquiposFiltrados([]);
    // } finally {
    //   asignarCarga(false);
    // }
  }, [mostrarMensajeError]);

  const cambiarEstadoEquipo = useCallback(
    async (id, nuevoEstado) => {
      await cambiarEstadoEquipoFn(
        id,
        nuevoEstado,
        equipos,
        equiposService,
        mostrarMensajeExito,
        cargarEquipos,
        mostrarMensajeError
      );
    },
    [equipos, mostrarMensajeExito, cargarEquipos, mostrarMensajeError]
  );

  const manejarNuevoMantenimiento = useCallback(
    (placa) => {
      navigate(`/nuevo-mantenimiento/${placa}`);
    },
    [navigate]
  );

  const columnas = useMemo(
    () => [
      { Header: "Serial", accessor: "serial" },
      { Header: "Placa", accessor: "placa", Cell: ({ value }) => value || "-" },
      { Header: "Nombre Equipo", accessor: "nombreDelEquipo" },
      { Header: "Marca", accessor: "marca" },
      { Header: "Modelo", accessor: "modelo" },
      { Header: "IP", accessor: "ip", Cell: ({ value }) => value || "-" },
      { Header: "Ubicación", accessor: "ubicacion" },
      {
        Header: "Estado",
        accessor: "estado",

        Cell: ({ value }) => {
          const severity = getEstadoSeverity(value);

          return <Tag severity={severity} value={value || "N/A"} />;
        },
      },
      {
        Header: "Acciones",
        accessor: "acciones",
        Cell: ({ row }) => (
          <div className="flex flex-row gap-1" style={{ display: "flex" }}>
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-sm p-button-text p-button-primary"
              tooltip="Editar"
              tooltipOptions={{ position: "top" }}
              onClick={() => {
                setEquipoEditando(row.original);
                asignarMostrarModelo(true);
                navigate(`/actualizar-equipo/${row.original.serial}`); // Navegar por serial si es el ID principal
              }}
            />
            <Button
              icon={
                row.original.estado === "Baja"
                  ? "pi pi-undo"
                  : "pi pi-power-off"
              }
              className={`p-button-rounded p-button-sm p-button-text ${
                row.original.estado === "Baja"
                  ? "p-button-success"
                  : "p-button-warning"
              }`}
              tooltip={
                row.original.estado === "Baja" ? "Reactivar" : "Dar de baja"
              }
              tooltipOptions={{ position: "top" }}
              onClick={() =>
                confirmarCambioEstadoFn(
                  row.original.serial, // Usar serial para identificar
                  row.original.estado === "Baja" ? "Activo" : "Baja",
                  cambiarEstadoEquipo
                )
              }
            />
            <Button
              icon="pi pi-calendar-plus"
              className="p-button-rounded p-button-sm p-button-text p-button-info"
              tooltip="Nuevo Mantenimiento"
              tooltipOptions={{ position: "top" }}
              onClick={() => manejarNuevoMantenimiento(row.original.serial)} // Usar serial
            />
          </div>
        ),
        disableSortBy: true, // Acciones no suelen ser ordenables
      },
    ],
    [cambiarEstadoEquipo, manejarNuevoMantenimiento]
  );
  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]);

  useEffect(() => {
    if (!busquedaDebounced) {
      setEquiposFiltrados(equipos || []);
      return;
    }

    const terminoBusquedaNormalizado = normalizarString(busquedaDebounced);

    const filtrados = (equipos || []).filter((equipo) => {
      return Object.keys(equipo).some((key) => {
        const valor = equipo[key];

        if (valor !== null && valor !== undefined) {
          const valorNormalizado = normalizarString(String(valor));
          return valorNormalizado.includes(terminoBusquedaNormalizado);
        }

        return false;
      });
    });

    setEquiposFiltrados(filtrados);
  }, [busquedaDebounced, equipos]);

  const TarjetaEquipoItem = ({
    equipo,
    alEditar,
    alAlternarEstado,
    alNuevoMantenimiento,
  }) => {
    const estadoSeverity = getEstadoSeverity(equipo.estado);
    return (
      <Card className="mb-3 w-full shadow-1 hover:shadow-3 transition-shadow transition-duration-300">
        <div className="flex flex-column sm:flex-row justify-content-between">
          <div className="flex-grow">
            <div className="text-xl font-bold mb-2">Serial: {equipo.serial}</div>
            {equipo.nombreDelEquipo && <p className="mt-0 mb-1"><strong>Nombre:</strong> {equipo.nombreDelEquipo}</p>}
            {equipo.placa && <p className="mt-0 mb-1"><strong>Placa:</strong> {equipo.placa}</p>}
            <p className="mt-0 mb-1">
              <strong>Marca:</strong> {equipo.marca}
            </p>
            <p className="mt-0 mb-1">
              <strong>Modelo:</strong> {equipo.modelo}
            </p>
            {equipo.ip && <p className="mt-0 mb-1"><strong>IP:</strong> {equipo.ip}</p>}
            <p className="mt-0 mb-1">
              <strong>Ubicación:</strong> {equipo.ubicacion}
            </p>
            <p className="mt-0 mb-1">
              <strong>Estado:</strong>{" "}
              <Tag severity={estadoSeverity} value={equipo.estado || "N/A"} />
            </p>
          </div>
          <div className="flex flex-column sm:flex-row sm:items-start gap-2 mt-3 sm:mt-0 flex-shrink-0">
            <Button
              icon="pi pi-pencil"
              className="p-button-sm p-button-primary w-full sm:w-auto"
              tooltip="Editar"
              onClick={() => alEditar(equipo)}
            />
            <Button
              icon={equipo.estado === "Baja" ? "pi pi-undo" : "pi pi-power-off"}
              className={`p-button-sm w-full sm:w-auto ${
                equipo.estado === "Baja"
                  ? "p-button-success"
                  : "p-button-warning"
              }`}
              tooltip={equipo.estado === "Baja" ? "Reactivar" : "Dar de baja"}
              onClick={() =>
                alAlternarEstado(
                  equipo.serial, // Usar serial
                  equipo.estado === "Baja" ? "Activo" : "Baja"
                )
              }
            />
            <Button
              icon="pi pi-calendar-plus"
              className="p-button-sm p-button-info w-full sm:w-auto"
              tooltip="Nuevo Mantenimiento"
              onClick={() => alNuevoMantenimiento(equipo.serial)} // Usar serial
            />
          </div>
        </div>
      </Card>
    );
  };

  const manejarAlternarEstadoTarjeta = (serial, estadoActual) => {
    const nuevoEstado = estadoActual === "Baja" ? "Activo" : "Baja"; // El estado actual es del equipo, no el nuevo estado
    confirmarCambioEstadoFn(serial, estadoActual === "Baja" ? "Activo" : "Baja", cambiarEstadoEquipo);
  };

  const manejarEditarEquipoTarjeta = (equipo) => {
    setEquipoEditando(equipo);
    asignarMostrarModelo(true);
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-2xl font-bold m-0">Gestión de Equipos</h1>{" "}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <span className="p-input-icon-left w-full sm:w-auto">
            <i className="pi pi-search" />
            <InputText
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar..."
              className="w-full"
            />
          </span>
          {/* Botón Nuevo Equipo */}
          <Button
            label="Nuevo Equipo"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={() => {
              setEquipoEditando(null);
              asignarMostrarModelo(true);
            }}
          />
        </div>
      </div>

      {esMovilPequeno &&
      !busquedaDebounced &&
      equiposFiltrados.length === equipos.length ? (
        <div className="text-center p-3 my-3 border-1 surface-border border-round surface-ground">
          <i className="pi pi-search text-3xl text-primary mb-3"></i>
          <p className="text-lg">Usa la búsqueda para encontrar equipos.</p>
          <p className="text-sm text-color-secondary">
            En pantallas pequeñas, los resultados se muestran como tarjetas
            individuales.
          </p>
        </div>
      ) : esMovilPequeno && equiposFiltrados.length > 0 ? (
        <div className="mt-4">
          {equiposFiltrados.map((equipo) => (
            <TarjetaEquipoItem
              key={equipo.serial} // Usar serial como key
              equipo={equipo}
              alEditar={manejarEditarEquipoTarjeta}
              alAlternarEstado={manejarAlternarEstadoTarjeta}
              alNuevoMantenimiento={manejarNuevoMantenimiento}
            />
          ))}
        </div>
      ) : (
        <div className="tabla-con-bordes overflow-x-auto">
          <TablaEquipos
            columns={columnas}
            data={equiposFiltrados}
            loading={carga}
          />
        </div>
      )}
      {mostrarModelo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              {equipoEditando ? "Editar Equipo" : "Nuevo Equipo"}
            </h2>
            <p> {/* Ajustar según los campos del formulario real */}
              Formulario de equipo (Serial: {equipoEditando?.serial || "Nuevo"})
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => asignarMostrarModelo(false)}
              />
              <Button
                label={equipoEditando ? "Guardar Cambios" : "Crear Equipo"}
                icon="pi pi-check"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
