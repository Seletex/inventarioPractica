// Archivo: src/paginas/autenticacion/GestionarEquipos.jsx

import { useState, useEffect, useRef, useCallback,useMemo } from "react"; // Añadir useCallback
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";
import { TablaEquipos } from "../../autenticacion/contexto/TablaDatos.jsx";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
// Importar funciones del hook personalizado (si aún las usas)
import {
  confirmarCambioEstadoFn,
  cambiarEstadoEquipoFn,
  cargarEquiposFn,
  //manejoEliminarFn,
  mostrarExitoFn,
  mostrarErrorFn,
} from "../../autenticacion/anzuelos/usoGestionFuncionesEquipo.js"; // Revisa si este hook sigue siendo la mejor aproximación

export default function GestionarEquipos() {
  const [equipos, setEquipos] = useState([]); // Lista completa de equipos
  const [equiposFiltrados, setEquiposFiltrados] = useState([]); // Equipos mostrados en tabla
  const [carga, asignarCarga] = useState(true); // Estado de carga
  const [mostrarModelo, asignarMostrarModelo] = useState(false); // Visibilidad del modal (a implementar)
  const [equipoEditando, setEquipoEditando] = useState(null); // Equipo seleccionado para editar
  const [busqueda, setBusqueda] = useState(""); // Término de búsqueda
  const toast = useRef(null); // Referencia para notificaciones

  // Funciones para mostrar mensajes (usando useCallback para estabilidad)
  const mostrarExito = useCallback((mensaje) => {
    mostrarExitoFn(mensaje, toast);
  }, []); // Sin dependencias, no cambian

  const mostrarError = useCallback((mensaje) => {
    mostrarErrorFn(mensaje, toast);
  }, []); // Sin dependencias, no cambian

  // Función para cargar equipos (usando useCallback)
  const cargarEquipos = useCallback(async () => {
    // Usar la función importada o definir la lógica aquí
    await cargarEquiposFn(
      asignarCarga,
      equiposService,
      setEquipos,
      setEquiposFiltrados,
      mostrarError
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
  }, [mostrarError]); // Depende de mostrarError (que es estable por useCallback)

  // Función para cambiar estado (usando useCallback)
  const cambiarEstadoEquipo = useCallback(
    async (id, nuevoEstado) => {
      await cambiarEstadoEquipoFn(
        id,
        nuevoEstado,
        equipos, // Pasa la lista actual si la función la necesita
        equiposService,
        mostrarExito,
        cargarEquipos, // Pasa la función para recargar
        mostrarError
      );
    },
    [equipos, mostrarExito, cargarEquipos, mostrarError]
  ); // Dependencias

  // Función para eliminar (usando useCallback)
  /*const manejoEliminar = useCallback(
    async (id) => {
      // Nota: Generalmente no se elimina, se da de baja (cambio de estado)
      // Si realmente quieres eliminar:
      await manejoEliminarFn(
        id,
        equiposService,
        mostrarExito,
        cargarEquipos,
        mostrarError
      );
    },
    [mostrarExito, cargarEquipos, mostrarError]
  ); // Dependencias*/

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
        // Considera usar un componente Tag de PrimeReact para mejor estilo
        Cell: ({ value }) => (
          <span
            className={`estado-badge ${
              value === "Baja" ? "text-red-500 font-semibold" : "text-green-600"
            }`} // Ejemplo con Tailwind
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Acciones",
        accessor: "acciones", // No es un accessor real, solo para la columna
        Cell: ({ row }) => (
          <div
            className="flex flex-row gap-1 whitespace-nowrap flex-nowrap"
             style={{ display: "flex", flexWrap: "nowrap" }} // Flex ya lo hace, nowrap es default
          >
     
     
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-sm p-button-text p-button-primary"
              tooltip="Editar"
              tooltipOptions={{ position: "top" }}
              onClick={() => {
                setEquipoEditando(row.original);
                asignarMostrarModelo(true); // Abrir modal de edición
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
            {/* Botón Eliminar (si es necesario, usualmente se prefiere dar de baja) */}
            {/* <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-sm p-button-text p-button-danger"
            tooltip="Eliminar Permanentemente"
            tooltipOptions={{ position: "top" }}
            onClick={() => manejoEliminar(row.original.placa)} // Confirmación sería ideal aquí también
          /> */}
          </div>
        ),
        disableSortBy: true,
        // style: { whiteSpace: "nowrap" }, // No suele ser necesario con flex
        // width: 150, // Dejar que flex ajuste o definir min-width si es necesario
      },
    ],
    [cambiarEstadoEquipo]
  ); // Dependencia de la función para acciones

  // Cargar equipos al montar el componente
  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]); // Dependencia estable gracias a useCallback

  // Filtrar equipos cuando cambia la búsqueda o la lista completa de equipos
  useEffect(() => {
    if (!busqueda) {
      setEquiposFiltrados(equipos || []); // Mostrar todos si no hay búsqueda
      return;
    }

    const searchTermLower = busqueda.toLowerCase();

    // Asegurarse que equipos sea un array antes de filtrar
    const filtrados = (equipos || []).filter((equipo) => {
      // Iterar sobre las claves del objeto equipo
      return Object.keys(equipo).some((key) => {
        const valor = equipo[key];

        // --- CORRECCIÓN APLICADA ---
        // Comprobar si el valor existe (no es null ni undefined) antes de llamar a toString()
        if (valor !== null && valor !== undefined) {
          // Convertir a string de forma segura y comparar en minúsculas
          return String(valor).toLowerCase().includes(searchTermLower);
        }
        // Si el valor es null o undefined, no puede coincidir
        return false;
        // --- FIN CORRECCIÓN ---
      });
    });

    setEquiposFiltrados(filtrados);
  }, [busqueda, equipos]); // Dependencias del efecto de filtrado

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
      <div className="tabla-con-bordes">
        {" "}
        {/* Revisa si esta clase es necesaria o usa estilos de TablaEquipos */}
        <TablaEquipos
          columns={columnas}
          data={equiposFiltrados}
          loading={carga}
          // Pasar funciones de editar/eliminar si TablaEquipos las soporta directamente
          // onEdit={(equipo) => { setEquipoEditando(equipo); asignarMostrarModelo(true); }}
          // onDelete={manejoEliminar} // O la función de cambio de estado
        />
      </div>
      {/* Modal/Dialog para Crear/Editar Equipo */}
      {/* Reemplaza este div con tu componente Modal real (ej. Dialog de PrimeReact) */}
      {mostrarModelo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              {equipoEditando ? "Editar Equipo" : "Nuevo Equipo"}
            </h2>
            {/* Aquí iría tu FORMULARIO para crear/editar */}
            <p>
              Formulario de equipo (Placa: {equipoEditando?.placa || "Nueva"})
            </p>
            {/* ... campos del formulario ... */}
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
                // onClick={handleGuardarEquipo} // Necesitarías esta función
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
