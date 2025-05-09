import { useState, useEffect, useRef, useCallback } from "react";
import { mockEquiposService as mantenimientosProgramadosService } from "../../servicios/mockEquipos.api.js";
import { TablaEquipos } from "../../autenticacion/contexto/TablaDatos.jsx";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import {
  cargarEquiposFn,
  manejoEliminarFn,
  mostrarExitoFn,
  mostrarErrorFn,
} from "../../autenticacion/anzuelos/usoGestionFuncionesEquipo.js";
import { useNavigate } from "react-router-dom";
import {
  utilizarConsultaMedios,
  utilizarRebote,
} from "../../componentes/utiles/GanchosAMedida.jsx";

export default function MantenimientosProgramados() {
  const [mantenimientosProgramados, setMantenimientosProgramados] = useState(
    []
  );
  const [mantenimientosFiltrados, setMantenimientosFiltrados] = useState([]);
  const [carga, asignarCarga] = useState(true);
  const [mostrarDialogoEditar, asignarMostrarDialogoEditar] = useState(false);
  const [setEquipoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();

  const [mostrarDialogoObservacion, setMostrarDialogoObservacion] =
    useState(false);
  const [observacionActual, setObservacionActual] = useState("");
  const [mantenimientoSeleccionado, setMantenimientoSeleccionado] =
    useState(null);
  const [verObservacionVisible, setVerObservacionVisible] = useState(false);
  const [observacionParaVer, setObservacionParaVer] = useState("");
  const [placaParaVerObservacion, setPlacaParaVerObservacion] = useState("");

  const [datosFormEdicion, setDatosFormEdicion] = useState({
    placaOriginal: "",
    fechaRealizacion: null,
    estadoEquipo: "",
    observaciones: "",
  });
  const isMobileSmall = utilizarConsultaMedios("(max-width: 575px)");
  const debouncedBusqueda = utilizarRebote(busqueda, 300);

  const opcionesEstadoEquipo = [
    { label: "Activo", value: "Activo" },
    { label: "En Mantenimiento", value: "En Mantenimiento" },
    { label: "Inactivo", value: "Inactivo" },
    { label: "De Baja", value: "De Baja" },
  ];

  const columnas = [
    // El mantenimiento se asocia a un equipo, 'equipoPlaca' o 'equipoSerial' debería venir del backend
    { Header: "Serial Equipo", accessor: "equipoSerial" }, 
    { Header: "Placa Equipo", accessor: "equipoPlaca", Cell: ({ value }) => value || "-" },
    {
      Header: "Equipo Completo",
      Cell: ({ row }) => {
        const equipoItem = row.original;
        // Necesitarías que el objeto mantenimiento tenga detalles del equipo o hacer una búsqueda
        // Esto es un placeholder, idealmente el backend adjuntaría esta info o tendrías una forma de obtenerla
        if (equipoItem && equipoItem.equipoInfo) { // Suponiendo que el backend adjunta equipoInfo
          return `${equipoItem.equipoInfo.marca || ""} ${equipoItem.equipoInfo.modelo || ""} (${equipoItem.equipoInfo.nombreDelEquipo || ""})`;
        } else {
          // Si solo tienes la placa/serial, podrías mostrar eso
          return equipoItem.equipoPlaca || equipoItem.equipoSerial || "N/A";
        }
      },
    },
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
    { Header: "Ubicación Equipo", accessor: "ubicacionEquipo" }, // Asumiendo que esto viene con el mantenimiento
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
        <div
          className="flex gap-1"
          style={{ display: "flex", flexWrap: "nowrap" }}
        >
          {!row.original.fechaRealizacion && (
            <Button
              icon="pi pi-check"
              className="p-button-rounded p-button-sm p-button-success"
              tooltip="Registrar realización del mantenimiento"
              onClick={() => handleRegistrarRealizacion(row.original)}
            />
          )}
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-sm p-button-primary"
            tooltip="Editar Mantenimiento"
            onClick={() => handleAbrirDialogoEditar(row.original)}
          />
        </div>
      ),
      disableSortBy: true,
      style: {
        whiteSpace: "nowrap",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
      },
      width: 100,
      minWidth: 90,
    },
    {
      Header: "Observaciones",
      accessor: "observaciones",
      Cell: ({ value, row }) => {
        if (!value) return <Tag value="N/A" severity="info" />;
        return (
          <Button
            icon="pi pi-eye"
            className="p-button-rounded p-button-text p-button-sm"
            tooltip="Ver Observación"
            onClick={() => {
              setPlacaParaVerObservacion(row.original.equipoPlaca || row.original.equipoSerial);
              setObservacionParaVer(value);
              setVerObservacionVisible(true);
            }}
          />
        );
      },
      width: 100,
      minWidth: 80,
      style: { paddingLeft: "0.5rem", paddingRight: "0.5rem" },
    },
  ];

  const mostrarExito = (mensaje) => {
    mostrarExitoFn(mensaje, toast);
  };

  const mostrarError = useCallback(
    (mensaje) => {
      mostrarErrorFn(mensaje, toast);
    },
    [toast]
  );

  const cargarEquipos = useCallback(async () => {
    await cargarEquiposFn(
      asignarCarga,
      mantenimientosProgramadosService,
      setMantenimientosProgramados,
      setMantenimientosFiltrados,
      mostrarError
    );
  }, [
    asignarCarga,
    setMantenimientosProgramados,
    setMantenimientosFiltrados,
    mostrarError,
  ]);

  const manejoEliminar = async (id) => {
    await manejoEliminarFn(
      id,
      mantenimientosProgramadosService,
      mostrarExito,
      cargarEquipos,
      mostrarError
    );
  };

  const handleRegistrarRealizacion = (mantenimiento) => {
    setMantenimientoSeleccionado(mantenimiento);
    setObservacionActual(mantenimiento.observaciones || "");
    setMostrarDialogoObservacion(true);
  };

  const confirmarRealizacionConObservacion = async () => {
    if (!mantenimientoSeleccionado) return;
    try {
      await mantenimientosProgramadosService.registrarRealizacion(
        mantenimientoSeleccionado.id, // Usar el ID del mantenimiento
        new Date(),
        observacionActual
      );
      mostrarExito(
        "Mantenimiento registrado con éxito y observación guardada."
      );
      setMostrarDialogoObservacion(false);
      setObservacionActual("");
      setMantenimientoSeleccionado(null);
      await cargarEquipos();
    } catch (error) {
      mostrarError(
        "Error al registrar realización: " + (error.message || error)
      );
    }
  };

  const handleAbrirDialogoEditar = (equipo) => {
    setEquipoEditando(equipo);
    setDatosFormEdicion({
      idMantenimiento: equipo.id, // ID del mantenimiento
      equipoPlaca: equipo.equipoPlaca, // Placa del equipo asociado
      fechaRealizacion: equipo.fechaRealizacion
        ? new Date(equipo.fechaRealizacion)
        : null,
      estadoEquipo: equipo.estadoEquipoPostMantenimiento || "", // Estado del equipo después del mantenimiento
      observaciones: equipo.observacionesMantenimiento || "", // Observaciones del mantenimiento
      tecnico: equipo.tecnico || "",
    });
    asignarMostrarDialogoEditar(true);
  };

  const handleCampoEdicionChange = (e) => {
    const { name, value } = e.target;
    setDatosFormEdicion((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]);

  const pieDialogoObservacion = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={() => setMostrarDialogoObservacion(false)}
        className="p-button-text"
      />
      <Button
        label="Confirmar Realización"
        icon="pi pi-check"
        onClick={confirmarRealizacionConObservacion}
        autoFocus
      />
    </div>
  );
  const handleGuardarCambiosMantenimiento = async () => {
    if (!datosFormEdicion.idMantenimiento) return;
    try {
      const datosParaActualizar = {
        fechaRealizacion: datosFormEdicion.fechaRealizacion,
        estadoEquipoPostMantenimiento: datosFormEdicion.estadoEquipo, // Asegúrate que el backend espera esto
        observaciones: datosFormEdicion.observaciones,
        tecnico: datosFormEdicion.tecnico,
      };
      await mantenimientosProgramadosService.actualizarMantenimiento(
        datosFormEdicion.idMantenimiento, // Enviar ID del mantenimiento
        datosParaActualizar
      );
      mostrarExito("Mantenimiento actualizado con éxito.");
      asignarMostrarDialogoEditar(false);
      await cargarEquipos();
    } catch (error) {
      mostrarError(
        "Error al actualizar mantenimiento: " + (error.message || error)
      );
    }
  };
  const pieDialogoEdicion = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={() => asignarMostrarDialogoEditar(false)}
        className="p-button-text"
      />
      <Button
        label="Guardar Cambios"
        icon="pi pi-save"
        onClick={handleGuardarCambiosMantenimiento}
        autoFocus
      />
    </div>
  );

  useEffect(() => {
    if (debouncedBusqueda) {
      const filtrados = mantenimientosProgramados.filter((mantenimiento) =>
        Object.values(mantenimiento).some((val) =>
          val && typeof val === "object"
            ? JSON.stringify(val)
                .toLowerCase()
                .includes(debouncedBusqueda.toLowerCase())
            : String(val)
                .toLowerCase()
                .includes(debouncedBusqueda.toLowerCase())
        )
      );
      setMantenimientosFiltrados(filtrados);
    } else {
      setMantenimientosFiltrados(mantenimientosProgramados);
    }
  }, [debouncedBusqueda, mantenimientosProgramados]);
  const MantenimientoCardItem = ({ mantenimiento, onRegistrar, onEditar }) => (
    <Card className="mb-3 w-full shadow-1 hover:shadow-3 transition-shadow transition-duration-300">
      <div className="flex flex-column sm:flex-row justify-content-between">
        <div>
          <div className="text-xl font-bold mb-2">Serial Equipo: {mantenimiento.equipoSerial}</div>
          {mantenimiento.equipoPlaca && <p className="mt-0 mb-1"><strong>Placa Equipo:</strong> {mantenimiento.equipoPlaca}</p>}
          <p className="mt-0 mb-1">
            <strong>Equipo:</strong>{" "}
            {/* Asumiendo que el backend envía info del equipo */}
            {mantenimiento.equipoInfo 
              ? `${mantenimiento.equipoInfo.marca || ""} ${mantenimiento.equipoInfo.modelo || ""} (${mantenimiento.equipoInfo.nombreDelEquipo || ""})`
              : mantenimiento.equipoPlaca || mantenimiento.equipoSerial || "N/A"
            }
          </p>
          <p className="mt-0 mb-1">
            <strong>Tipo:</strong>{" "}
            <Tag
              value={mantenimiento.tipo}
              severity={mantenimiento.tipo === "Preventivo" ? "info" : "danger"}
            />
          </p>
          <p className="mt-0 mb-1">
            <strong>Ubicación Equipo:</strong> {mantenimiento.ubicacionEquipo}
          </p>
          <p className="mt-0 mb-1">
            <strong>Técnico:</strong> {mantenimiento.tecnico}
          </p>
          <p className="mt-0 mb-1">
            <strong>Fecha Programada:</strong>{" "}
            <Tag
              value={new Date(
                mantenimiento.fechaProgramada
              ).toLocaleDateString()}
              severity={
                new Date(mantenimiento.fechaProgramada) < new Date()
                  ? "danger"
                  : "info"
              }
            />
          </p>
          <p className="mt-0 mb-1">
            <strong>Fecha Realización:</strong>{" "}
            {mantenimiento.fechaRealizacion ? (
              <Tag
                value={new Date(
                  mantenimiento.fechaRealizacion
                ).toLocaleDateString()}
                severity="success"
              />
            ) : (
              <Tag value="Pendiente" severity="warning" />
            )}
          </p>
          <p className="mt-0 mb-1">
            <strong>Estado Equipo:</strong>{" "}
            <Tag value={mantenimiento.estadoEquipoPostMantenimiento || "N/A"} />{" "}
          </p>
        </div>
        <div className="flex flex-column sm:flex-row sm:align-items-start gap-2 mt-3 sm:mt-0">
          {!mantenimiento.fechaRealizacion && (
            <Button
              icon="pi pi-check"
              className="p-button-sm p-button-success w-full sm:w-auto"
              tooltip="Registrar realización"
              onClick={() => onRegistrar(mantenimiento)}
            />
          )}
          <Button
            icon="pi pi-pencil"
            className="p-button-sm p-button-primary w-full sm:w-auto"
            tooltip="Editar"
            onClick={() => onEditar(mantenimiento)}
          />
          {mantenimiento.observaciones && (
            <Button
              icon="pi pi-eye"
              className="p-button-rounded p-button-text p-button-sm w-full sm:w-auto"
              tooltip="Ver Observación"
              onClick={() => {
                setPlacaParaVerObservacion(mantenimiento.equipoPlaca || mantenimiento.equipoSerial);
                setObservacionParaVer(mantenimiento.observaciones);
                setVerObservacionVisible(true);
              }}
            />
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <>
      <Toast ref={toast} />
      <Card
        title="Gestión de Mantenimientos Programados"
        className="m-2 md:m-4 shadow-2 border-round w-full"
      >
        <div className="flex flex-column sm:flex-row justify-content-between align-items-center mb-4 gap-3">
          <div className="flex flex-column sm:flex-row gap-2 w-full sm:w-auto justify-content-end">
            <span className="p-input-icon-left w-full sm:w-auto">
              <i className="pi pi-search" />
              <InputText
                className="w-full"
                type="text"
                aria-label="Buscar"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar..."
              />
            </span>
            <Button
              label="Nuevo Mantenimiento"
              className="p-button-success w-full sm:w-auto"
              icon="pi pi-plus"
              onClick={() => {
                setEquipoEditando(null);
                asignarMostrarDialogoEditar(true);
                navigate("/nuevo-mantenimiento");
              }}
            />
          </div>
        </div>

        {isMobileSmall &&
        !busqueda &&
        mantenimientosFiltrados.length === mantenimientosProgramados.length ? (
          <div className="text-center p-3 my-3 border-1 surface-border border-round surface-ground">
            <i className="pi pi-search text-3xl text-primary mb-3"></i>
            <p className="text-lg">
              Usa la búsqueda para encontrar mantenimientos.
            </p>
            <p className="text-sm text-color-secondary">
              En pantallas pequeñas, los resultados se muestran como tarjetas
              individuales.
            </p>
          </div>
        ) : isMobileSmall && mantenimientosFiltrados.length > 0 ? (
          <div className="mt-4">
            {mantenimientosFiltrados.map((mantenimiento) => (
              <MantenimientoCardItem
                key={mantenimiento.id} // Usar el ID del mantenimiento como key
                mantenimiento={mantenimiento}
                onRegistrar={handleRegistrarRealizacion}
                onEditar={handleAbrirDialogoEditar}
              />
            ))}
          </div>
        ) : (
          <div className="tabla-con-bordes overflow-x-auto">
            <TablaEquipos
              columns={columnas}
              data={mantenimientosFiltrados}
              loading={carga}
              onEdit={handleAbrirDialogoEditar}
              onDelete={manejoEliminar}
            />
          </div>
        )}

        <Dialog
          header="Registrar Realización de Mantenimiento"
          visible={mostrarDialogoObservacion}
          style={{ width: "90vw", maxWidth: "450px" }}
          footer={pieDialogoObservacion}
          onHide={() => setMostrarDialogoObservacion(false)}
          blockScroll
        >
          <div className="p-fluid">
            {mantenimientoSeleccionado && (
              <p className="mb-2">
                Registrando para la placa:{" "}
                <strong>{mantenimientoSeleccionado.equipoPlaca || mantenimientoSeleccionado.equipoSerial}</strong>
              </p>
            )}
            <div className="field">
              <label htmlFor="observacion" className="font-semibold">
                Observaciones (Opcional)
              </label>
              <InputTextarea
                id="observacion"
                value={observacionActual}
                onChange={(e) => setObservacionActual(e.target.value)}
                rows={5}
                autoResize
              />
            </div>
          </div>
        </Dialog>

        <Dialog
          header={`Observaciones para Placa: ${placaParaVerObservacion}`}
          visible={verObservacionVisible}
          style={{ width: "90vw", maxWidth: "600px" }}
          onHide={() => setVerObservacionVisible(false)}
          footer={
            <Button
              label="Cerrar"
              icon="pi pi-times"
              onClick={() => setVerObservacionVisible(false)}
              className="p-button-text"
            />
          }
          blockScroll
        >
          <p style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {observacionParaVer}
          </p>
        </Dialog>

        <Dialog
          header={`Editar Mantenimiento - Equipo: ${datosFormEdicion.equipoPlaca || datosFormEdicion.equipoSerial}`}
          visible={mostrarDialogoEditar}
          style={{ width: "90vw", maxWidth: "500px" }}
          footer={pieDialogoEdicion}
          onHide={() => asignarMostrarDialogoEditar(false)}
          blockScroll
        >
          <div className="p-fluid">
            <div className="field mb-3">
              <label htmlFor="fechaRealizacionEdit" className="font-semibold">
                Fecha de Realización
              </label>
              <Calendar
                id="fechaRealizacionEdit"
                name="fechaRealizacion"
                value={datosFormEdicion.fechaRealizacion}
                onChange={handleCampoEdicionChange}
                dateFormat="dd/mm/yy"
                showIcon
              />
            </div>
            <div className="field mb-3">
              <label htmlFor="estadoEquipoEdit" className="font-semibold">
                Estado del Equipo
              </label>
              <Dropdown
                id="estadoEquipoEdit"
                name="estadoEquipo"
                value={datosFormEdicion.estadoEquipo}
                options={opcionesEstadoEquipo}
                onChange={handleCampoEdicionChange}
                placeholder="Seleccione un estado"
              />
            </div>
            <div className="field">
              <label htmlFor="observacionesEdit" className="font-semibold">
                Observaciones
              </label>
              <InputTextarea
                id="observacionesEdit"
                name="observaciones"
                value={datosFormEdicion.observaciones}
                onChange={handleCampoEdicionChange}
                rows={4}
                autoResize
              />
            </div>
          </div>
        </Dialog>
      </Card>
    </>
  );
}
