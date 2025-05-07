// Archivo: src/paginas/autenticacion/GestionarEquipos.jsx

import { useState, useEffect, useRef, useCallback, useMemo } from "react"; // Añadir useCallback
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";
import { TablaEquipos } from "../../autenticacion/contexto/TablaDatos.jsx";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card"; // Importar Card
import { Tag } from "primereact/tag"; // Importar Tag
import { useNavigate } from "react-router-dom"; // Importar useNavigate
// Importar funciones del hook personalizado (si aún las usas)
import {
  confirmarCambioEstadoFn,
  cambiarEstadoEquipoFn,
  cargarEquiposFn,
  //manejoEliminarFn,
  mostrarExitoFn,
  mostrarErrorFn,
} from "../../autenticacion/anzuelos/usoGestionFuncionesEquipo.js"; // Revisa si este hook sigue siendo la mejor aproximación
import { normalizarString } from "../../componentes/utiles/UtilidadesTexto.jsx";
import {
  useDebounce,
  useMediaQuery,
} from "../../componentes/utiles/GanchosAMedida.jsx";

export default function GestionarEquipos() {
  const [equipos, setEquipos] = useState([]); // Lista completa de equipos
  const [equiposFiltrados, setEquiposFiltrados] = useState([]); // Equipos mostrados en tabla
  const [carga, asignarCarga] = useState(true); // Estado de carga
  const [mostrarModelo, asignarMostrarModelo] = useState(false); // Visibilidad del modal (a implementar)
  const [equipoEditando, setEquipoEditando] = useState(null); // Equipo seleccionado para editar
  const [busqueda, setBusqueda] = useState(""); // Término de búsqueda
  const toast = useRef(null); // Referencia para notificaciones
  const navigate = useNavigate(); // Hook para navegación

  const getEstadoSeverity = (estado) => {
    const lowerEstado = estado?.toLowerCase();
    if (lowerEstado === "activo") return "success";
    if (lowerEstado === "inactivo") return "warning";
    if (lowerEstado === "baja") return "danger";
    if (lowerEstado === "mantenimiento") return "info";
    return "info"; // Default
  };
  const mostrarMensajeExito = useCallback((mensaje) => {
    mostrarExitoFn(mensaje, toast);
  }, []);

  const mostrarMensajeError = useCallback((mensaje) => {
    mostrarErrorFn(mensaje, toast);
  }, []);

  const busquedaDebounced = useDebounce(busqueda, 300);
  const esMovilPequeno = useMediaQuery("(max-width: 575px)");

  // Función para cargar equipos (usando useCallback)
  const cargarEquipos = useCallback(async () => {
    // Usar la función importada o definir la lógica aquí
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
    //   setEquiposFiltrados(data || []); // Inicialmente mostrar todos
    // } catch (error) {
    //   mostrarError(error.message || "Error al cargar equipos");
    //   setEquipos([]);
    //   setEquiposFiltrados([]);
    // } finally {
    //   asignarCarga(false);
    // }
  }, [mostrarMensajeError]); // Depende de mostrarError (que es estable por useCallback)

  // Función para cambiar estado (usando useCallback)
  const cambiarEstadoEquipo = useCallback(
    async (id, nuevoEstado) => {
      await cambiarEstadoEquipoFn(
        id,
        nuevoEstado,
        equipos, // Pasa la lista actual si la función la necesita
        equiposService,
        mostrarMensajeExito,
        cargarEquipos, // Pasa la función para recargar
        mostrarMensajeError
      );
    },
    [equipos, mostrarMensajeExito, cargarEquipos, mostrarMensajeError]
  ); // Dependencias

  // Navegar a nuevo mantenimiento
  const manejarNuevoMantenimiento = useCallback(
    (placa) => {
      navigate(`/nuevo-mantenimiento/${placa}`);
    },
    [navigate]
  );

  // Columnas para la tabla (usando useMemo para optimización)
  const columnas = useMemo(
    () => [
      { Header: "Placa", accessor: "placa" },
      { Header: "Marca", accessor: "marca" },
      { Header: "Modelo", accessor: "modelo" },
      { Header: "Ubicación", accessor: "ubicacion" },
      {
        Header: "Estado",
        accessor: "estado",
        // Usar Tag de PrimeReact para mjeorar
        Cell: ({ value }) => {          const severity = getEstadoSeverity(value);
        
          return <Tag severity={severity} value={value || "N/A"} />;
        },
      },
      {
        Header: "Acciones",
        accessor: "acciones", // No es un accessor real, solo para la columna
        Cell: ({ row }) => (
          <div
            className="flex flex-row gap-1" // flex-nowrap es el comportamiento por defecto de flex
            style={{ display: "flex" }}
          >
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-sm p-button-text p-button-primary"
              tooltip="Editar"
              tooltipOptions={{ position: "top" }}
              onClick={() => {
                setEquipoEditando(row.original);
                asignarMostrarModelo(true); // Abrir modal de edición
                navigate("/actualizar-equipo/:placa");
              }}
            />
            <Button
              icon={
                row.original.estado === "Baja"
                  ? "pi pi-undo"
                  : "pi pi-power-off"
              } // Cambiar icono si está de baja
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
                  // Usar la función importada para confirmación
                  row.original.placa, // Usar placa como ID si es único
                  row.original.estado === "Baja" ? "Activo" : "Baja", // Estado a cambiar
                  cambiarEstadoEquipo // Función a ejecutar si confirma
                )
              }
              // No deshabilitar, permitir reactivar
              // disabled={row.original.estado === "Baja"}
            />
            <Button
              icon="pi pi-calendar-plus" // Icono para nuevo mantenimiento
              className="p-button-rounded p-button-sm p-button-text p-button-info" // Estilo info o el que prefieras
              tooltip="Nuevo Mantenimiento"
              tooltipOptions={{ position: "top" }}
              onClick={() => manejarNuevoMantenimiento(row.original.placa)}
            />            
          </div>
        ),
        disableSortBy: true,

      },
    ],
    [cambiarEstadoEquipo, manejarNuevoMantenimiento]
  );
  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]);

  // Filtrar equipos cuando cambia la búsqueda o la lista completa de equipos
  useEffect(() => {
    if (!busquedaDebounced) {
      // Usar debouncedBusqueda
      setEquiposFiltrados(equipos || []); // Mostrar todos si no hay búsqueda
      return;
    }

    const terminoBusquedaNormalizado = normalizarString(busquedaDebounced);

    // Asegurarse que equipos sea un array antes de filtrar
    const filtrados = (equipos || []).filter((equipo) => {
      // Iterar sobre las claves del objeto equipo
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

  // Componente para mostrar cada equipo como una Card en móvil
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
          <div>
            <div className="text-xl font-bold mb-2">Placa: {equipo.placa}</div>
            <p className="mt-0 mb-1">
              <strong>Marca:</strong> {equipo.marca}
            </p>
            <p className="mt-0 mb-1">
              <strong>Modelo:</strong> {equipo.modelo}
            </p>
            <p className="mt-0 mb-1">
              <strong>Ubicación:</strong> {equipo.ubicacion}
            </p>
            <p className="mt-0 mb-1">
              <strong>Estado:</strong>{" "}
              <Tag severity={estadoSeverity} value={equipo.estado || "N/A"} />
            </p>
          </div>
          <div className="flex flex-column sm:flex-row sm:align-items-start gap-2 mt-3 sm:mt-0">
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
                  equipo.placa,
                  equipo.estado === "Baja" ? "Activo" : "Baja"
                )
              }
            />
            <Button
              icon="pi pi-calendar-plus"
              className="p-button-sm p-button-info w-full sm:w-auto"
              tooltip="Nuevo Mantenimiento"
              onClick={() => alNuevoMantenimiento(equipo.placa)}
            />
          </div>
        </div>
      </Card>
    );
  };

  const manejarAlternarEstadoTarjeta = (placa, estadoActual) => {
    const nuevoEstado = estadoActual === "Baja" ? "Activo" : "Baja";
    confirmarCambioEstadoFn(placa, nuevoEstado, cambiarEstadoEquipo);
  };

  const manejarEditarEquipoTarjeta = (equipo) => {
    setEquipoEditando(equipo);
    asignarMostrarModelo(true); // Abrir modal de edición
  };

  return (
    <div className="p-4">
      <Toast ref={toast} /> {/* Para mostrar notificaciones */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-2xl font-bold m-0">Gestión de Equipos</h1>{" "}
        {/* Quitar margen default */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Input de Búsqueda */}
          <span className="p-input-icon-left w-full sm:w-auto">
            <i className="pi pi-search" />
            <InputText
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar..."
              className="w-full" // Ocupar ancho disponible
            />
          </span>
          {/* Botón Nuevo Equipo */}
          <Button
            label="Nuevo Equipo"
            icon="pi pi-plus"
            className="p-button-primary" // Estilo primario
            onClick={() => {
              setEquipoEditando(null); // Indicar que es nuevo
              asignarMostrarModelo(true); // Abrir modal de creación/edición
            }}
          />
        </div>
      </div>
      {/* Tabla de Equipos */}
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
              key={equipo.placa}
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
            <p>
              Formulario de equipo (Placa: {equipoEditando?.placa || "Nueva"})
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
