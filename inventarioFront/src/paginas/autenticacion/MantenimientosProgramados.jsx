import { useState, useEffect, useRef, useCallback } from "react";
import { mockEquiposService as mantenimientosProgramadosService } from "../../servicios/mockEquipos.api.js";
import { TablaEquipos } from "../../autenticacion/contexto/TablaDatos.jsx";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card"; // Importar Card
import { Tag } from "primereact/tag"; // Añadida importación del componente Tag
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import {
  cargarEquiposFn,
  manejoEliminarFn,
  mostrarExitoFn,
  mostrarErrorFn,
} from "../../autenticacion/anzuelos/usoGestionFuncionesEquipo.js";
import { useNavigate } from "react-router-dom";
import { utilizarConsultaMedios, utilizarRebote } from "../../componentes/utiles/GanchosAMedida.jsx";

export default function MantenimientosProgramados() {
  const [mantenimientosProgramados, setMantenimientosProgramados] = useState([]);
  const [mantenimientosFiltrados, setMantenimientosFiltrados] = useState([]);
  const [carga, asignarCarga] = useState(true);
  const [mostrarDialogoEditar, asignarMostrarDialogoEditar] = useState(false);
  const [ setEquipoEditando] = useState(null);
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
    placaOriginal: "", // Para identificar el equipo a actualizar
    fechaRealizacion: null,
    estadoEquipo: "",
    observaciones: "",
    // Podrías añadir más campos si fueran editables, como 'tecnico'
  });
  const isMobileSmall = utilizarConsultaMedios("(max-width: 575px)"); // Breakpoint similar a sm de PrimeFlex
  const debouncedBusqueda = utilizarRebote(busqueda, 300); // 300ms de delay

  const opcionesEstadoEquipo = [
    { label: "Activo", value: "Activo" },
    { label: "En Mantenimiento", value: "En Mantenimiento" },
    { label: "Inactivo", value: "Inactivo" },
    { label: "De Baja", value: "De Baja" }, // Asegúrate que estos valores coincidan con los de tu mock/API
  ];
  // Columnas para la tabla
  const columnas = [
    { Header: "Placa", accessor: "placa" },
    {
      Header: "Equipo Completo",
      Cell: ({ row }) => {
        const equipoItem = row.original;

        if (equipoItem && typeof equipoItem.equipo === "function") {
          // Si existe el objeto y 'equipo' es una función, llámala
          return equipoItem.equipo();
        } else {
          // Si no, muestra un mensaje de error o un valor por defecto
          console.warn(
            "El objeto de datos no tiene la función 'equipo':",
            equipoItem
          );
          return "N/A o Error de datos"; // O algún otro valor por defecto
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
        <div
          className="flex gap-1"
          style={{ display: "flex", flexWrap: "nowrap" }}
        >
          {!row.original.fechaRealizacion && (
            <Button
              icon="pi pi-check"
              className="p-button-rounded p-button-sm p-button-success"
              tooltip="Registrar realización"
              onClick={() => handleRegistrarRealizacion(row.original)} // CORREGIDO: Pasar el objeto completo
            />
          )}
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-sm p-button-primary"
            tooltip="Editar"
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
      width: 100, // Ajustado
      minWidth: 90, // Añadido
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
              setPlacaParaVerObservacion(row.original.placa);
              setObservacionParaVer(value);
              setVerObservacionVisible(true);
            }}
          />
        );
      },
      width: 100, // Ajustado
      minWidth: 80, // Añadido
      style: { paddingLeft: "0.5rem", paddingRight: "0.5rem" },
    },
  ];

  // Función para mostrar mensajes de éxito
  const mostrarExito = (mensaje) => {
    mostrarExitoFn(mensaje, toast);
  };

  // Función para mostrar mensajes de error
  const mostrarError = useCallback(
    (mensaje) => {
      mostrarErrorFn(mensaje, toast);
    },
    [toast]
  );

  // Cargar equipos al iniciar el componente
  const cargarEquipos = useCallback(async () => {
    await cargarEquiposFn(
      asignarCarga,
      mantenimientosProgramadosService,
      setMantenimientosProgramados,
      setMantenimientosFiltrados,
      mostrarError
    );
  }, [asignarCarga, setMantenimientosProgramados, setMantenimientosFiltrados, mostrarError]);

  // Manejar eliminar un equipo
  const manejoEliminar = async (id) => {
    await manejoEliminarFn(
      id,
      mantenimientosProgramadosService, // Asumiendo que manejoEliminarFn usa este servicio para eliminar
      mostrarExito,
      cargarEquipos,
      mostrarError
    );
  };
  // Manejar registro de realización de mantenimiento
  const handleRegistrarRealizacion = (mantenimiento) => {
    setMantenimientoSeleccionado(mantenimiento);
    setObservacionActual(mantenimiento.observaciones || ""); // Pre-llenar si ya existe
    setMostrarDialogoObservacion(true);
  };

  const confirmarRealizacionConObservacion = async () => {
    if (!mantenimientoSeleccionado) return;
    try {
      await mantenimientosProgramadosService.registrarRealizacion(
        mantenimientoSeleccionado.placa, // Usar placa como identificador
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

  // Manejar edición de mantenimiento
  const handleAbrirDialogoEditar = (equipo) => {
    setEquipoEditando(equipo);
    setDatosFormEdicion({
      placaOriginal: equipo.placa, // Usaremos la placa original para la actualización
      fechaRealizacion: equipo.fechaRealizacion
        ? new Date(equipo.fechaRealizacion)
        : null,
      estadoEquipo: equipo.estado || "", // El estado general del equipo
      observaciones: equipo.observaciones || "",
      // tecnico: equipo.tecnico || '', // Si el técnico también fuera editable
    });
    asignarMostrarDialogoEditar(true);
  };

  const handleCampoEdicionChange = (e) => {
    const { name, value } = e.target;
    setDatosFormEdicion((prev) => ({ ...prev, [name]: value }));
  };

  // Cargar equipos al iniciar el componente
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
    if (!datosFormEdicion.placaOriginal) return;
    try {
      const datosParaActualizar = {
        fechaRealizacion: datosFormEdicion.fechaRealizacion,
        estado: datosFormEdicion.estadoEquipo, // Asegúrate que el backend espera 'estado'
        observaciones: datosFormEdicion.observaciones,
        // tecnico: datosFormEdicion.tecnico, // Si es editable
      };
      await mantenimientosProgramadosService.actualizarMantenimiento(
        datosFormEdicion.placaOriginal,
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

  // Filtrar equipos cuando cambia la búsqueda
  useEffect(() => {
    if (debouncedBusqueda) {
      const filtrados = mantenimientosProgramados.filter((mantenimiento) =>
        Object.values(mantenimiento).some((val) =>
          val && typeof val === "object"
            ? JSON.stringify(val).toLowerCase().includes(debouncedBusqueda.toLowerCase())
            : String(val).toLowerCase().includes(debouncedBusqueda.toLowerCase())
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
          <div className="text-xl font-bold mb-2">
            Placa: {mantenimiento.placa}
          </div>
          <p className="mt-0 mb-1">
            <strong>Equipo:</strong>{" "}
            {typeof mantenimiento.equipo === "function"
              ? mantenimiento.equipo()
              : `${mantenimiento.marca} ${mantenimiento.modelo || ""}`}
          </p>
          <p className="mt-0 mb-1">
            <strong>Tipo:</strong>{" "}
            <Tag
              value={mantenimiento.tipo}
              severity={mantenimiento.tipo === "Preventivo" ? "info" : "danger"}
            />
          </p>
          <p className="mt-0 mb-1">
            <strong>Ubicación:</strong> {mantenimiento.ubicacion}
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
            <Tag value={mantenimiento.estado || "N/A"} />{" "}
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
                setPlacaParaVerObservacion(mantenimiento.placa);
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
        {/* Controles de Búsqueda y Nuevo Mantenimiento */}
        <div className="flex flex-column sm:flex-row justify-content-between align-items-center mb-4 gap-3">
          {/* Espacio para el título ya está manejado por Card, podemos poner aquí un subtítulo o nada */}
          {/* <span className="text-xl font-semibold">Programados</span> */}

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

        {/* Table Section */}
        {isMobileSmall &&
        !busqueda &&
        mantenimientosFiltrados.length === mantenimientosProgramados.length ? ( // Mostrar mensaje solo si no hay búsqueda y no se han filtrado
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
                key={mantenimiento.placa}
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
        {/* Dialogo para observaciones al registrar realización */}
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
                <strong>{mantenimientoSeleccionado.placa}</strong>
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

        {/* Dialogo para Editar Mantenimiento */}
        <Dialog
          header={`Editar Mantenimiento - Placa: ${datosFormEdicion.placaOriginal}`}
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
