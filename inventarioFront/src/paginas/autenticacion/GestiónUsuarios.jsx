import { useState, useEffect, useRef, useCallback, useMemo } from "react"; // Añadir useCallback y useMemo
import { mockUsuariosService as usuariosService } from "../../servicios/mockUsuarios.api.js";
import { TablaEquipos } from "../../autenticacion/contexto/TablaDatos.jsx"; // Reutilizamos TablaDatos
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag"; // Importar Tag para roles
import { Card } from "primereact/card"; // Importar Card
import {
  mostrarErrorFn,
  mostrarExitoFn,
  cargarEntidadesFn,
  manejoEliminarEntidadFn,
} from "../../autenticacion/anzuelos/usoGestionFuncionesUsuario.js";
const normalizarString = (str) => {
  if (typeof str !== "string") return "";
  return str
    .normalize("NFD") // Descomponer caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Eliminar diacríticos
    .toLowerCase();
};
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Hook para detectar cambios en el tamaño de la pantalla (media query)
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
};
const getRolSeverity = (rol) => {
  const lowerRol = rol?.toLowerCase();
  if (lowerRol === "administrador") return "danger";
  if (lowerRol === "tecnico") return "warning";
  return "info"; // Default
};
const EditUserButton = ({ onClick, className, tooltipOptions }) => (
  <Button
    icon="pi pi-pencil"
    className={
      className || "p-button-rounded p-button-sm p-button-text p-button-primary"
    }
    tooltip="Editar Usuario"
    tooltipOptions={tooltipOptions || { position: "top" }}
    onClick={onClick}
  />
);
const DeleteUserButton = ({ onClick, className, tooltipOptions }) => (
  <Button
    icon="pi pi-trash"
    className={
      className || "p-button-rounded p-button-sm p-button-text p-button-danger"
    }
    tooltip="Eliminar Usuario"
    tooltipOptions={tooltipOptions || { position: "top" }}
    onClick={onClick}
  />
);
export default function GestionarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [carga, asignarCarga] = useState(true);
  const [mostrarModal, asignarMostrarModal] = useState(false); // Renombrado para claridad
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const toast = useRef(null);
  // Hook para retrasar la ejecución de una función (debouncing)

  // --- FIN FUNCIONES AUXILIARES ---

  // Funciones para mostrar mensajes (estables con useCallback)
  const mostrarMensajeExito = useCallback((mensaje) => {
    mostrarExitoFn(mensaje, toast);
  }, []);

  const mostrarMensajeError = useCallback((mensaje) => {
    mostrarErrorFn(mensaje, toast);
  }, []);

  const busquedaDebounced = useDebounce(busqueda, 300);
  const esMovilPequeno = useMediaQuery("(max-width: 575px)");

  // Cargar lista de usuarios
  const cargarUsuarios = useCallback(async () => {
    await cargarEntidadesFn(
      asignarCarga,
      usuariosService,
      setUsuarios,
      setUsuariosFiltrados,
      mostrarMensajeError,
      "usuarios" // Nombre de la entidad
    );
  }, [mostrarMensajeError]); // Dependencia estable

  // Función para eliminar usuario (estable con useCallback)
  // Se asume que manejoEliminarEntidadFn ya incluye confirmación o se añade aquí
  const manejoEliminarUsuario = useCallback(
    async (id) => {
      // Ejemplo si necesitaras confirmación aquí:
      // confirmarAccionFn(
      //   '¿Está seguro de eliminar este usuario?',
      //   'Confirmar Eliminación',
      //   async () => { // Función a ejecutar si acepta
      await manejoEliminarEntidadFn(
        id,
        usuariosService,
        mostrarMensajeExito,
        cargarUsuarios, // Recargar lista
        mostrarMensajeError,
        "usuario",
        toast // Pasar ref si la función lo necesita
      );
      //   }
      // );
    },
    [mostrarMensajeExito, cargarUsuarios, mostrarMensajeError]
  );

  // Función para abrir el modal de edición/creación
  const abrirModal = useCallback((usuario = null) => {
    setUsuarioEditando(usuario);
    asignarMostrarModal(true);
  }, []);

  // Función para cerrar el modal
  const cerrarModal = useCallback(() => {
    asignarMostrarModal(false);
    setUsuarioEditando(null); // Limpiar usuario en edición
  }, []);

  // Manejador para después de guardar en el modal
  const manejarGuardadoExitoso = useCallback(() => {
    cerrarModal();
    cargarUsuarios(); // Recargar la lista
  }, [cerrarModal, cargarUsuarios]);

  // Columnas para la tabla (optimizadas con useMemo)
  const columnas = useMemo(
    () => [
      { Header: "Nombre Completo", accessor: "nombreCompleto" },
      { Header: "Correo Electrónico", accessor: "correo" },
      {
        Header: "Rol",
        accessor: "rol",
        Cell: ({ value }) => {
          // Usar Tag de PrimeReact para roles

          const severity = getRolSeverity(value); // Usar helper

          return <Tag severity={severity} value={value || "N/A"} />;
        },
      },
      {
        Header: "Acciones",
        id: "acciones", // Usar id en lugar de accessor si no mapea a datos
        Cell: ({ row }) => (
          <div className="flex flex-row gap-1 flex-nowrap">
            {" "}
            {/* Mejorado className para flexbox */}
            <EditUserButton
              onClick={() => abrirModal(row.original)} // Usar función estable
            />
            <DeleteUserButton
              onClick={() => manejoEliminarUsuario(row.original.id)} // Usar función estable
            />
          </div>
        ),
        disableSortBy: true,
      },
    ],
    [abrirModal, manejoEliminarUsuario]
  ); // Dependencias estables

  // Cargar usuarios al montar
  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]); // Dependencia estable

  // Filtrar usuarios (lógica ya corregida para null/undefined)
  useEffect(() => {
    if (!busquedaDebounced) {
      setUsuariosFiltrados(usuarios || []);
      return;
    }
    const terminoBusquedaNormalizado = normalizarString(busquedaDebounced);
    const filtrados = (usuarios || []).filter((usuario) => {
      return Object.keys(usuario).some((key) => {
        const valor = usuario[key];
        if (valor !== null && valor !== undefined) {
          const valorNormalizado = normalizarString(String(valor));
          return valorNormalizado.includes(terminoBusquedaNormalizado);
        }
        return false;
      });
    });
    setUsuariosFiltrados(filtrados);
  }, [busquedaDebounced, usuarios]);

  // Componente para mostrar cada usuario como una Tarjeta en vista móvil
  const TarjetaUsuarioItem = ({ usuario, alEditar, alEliminar }) => {
    const rolSeverity = getRolSeverity(usuario.rol); // Usar helper

    return (
      <Card className="mb-3 w-full shadow-1 hover:shadow-3 transition-shadow transition-duration-300">
        <div className="flex flex-column sm:flex-row justify-content-between">
          <div>
            <div className="text-xl font-bold mb-2">
              {usuario.nombreCompleto}
            </div>
            <p className="mt-0 mb-1">
              <strong>Correo:</strong> {usuario.correo}
            </p>
            <p className="mt-0 mb-1">
              <strong>Rol:</strong>{" "}
              <Tag severity={rolSeverity} value={usuario.rol || "N/A"} />
            </p>
          </div>
          <div className="flex flex-column sm:flex-row sm:align-items-start gap-2 mt-3 sm:mt-0">
            <EditUserButton
              className="p-button-sm p-button-primary w-full sm:w-auto"
              onClick={() => alEditar(usuario)}
              tooltipOptions={null}
            />
            <DeleteUserButton
              className="p-button-sm p-button-danger w-full sm:w-auto"
              onClick={() => alEliminar(usuario.id)}
              tooltipOptions={null}
            />
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h1 className="text-2xl font-bold m-0">Gestión de Usuarios</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Búsqueda */}
          <span className="p-input-icon-left w-full sm:w-auto">
            <i className="pi pi-search" />
            <InputText
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar usuarios..."
              className="w-full"
            />
          </span>
          {/* Botón Nuevo Usuario */}
          <Button
            label="Nuevo Usuario"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={() => abrirModal(null)} // Usar función estable
          />
        </div>
      </div>

      {/* Tabla */}
      {esMovilPequeno &&
      !busquedaDebounced &&
      usuariosFiltrados.length === usuarios.length ? (
        <div className="text-center p-3 my-3 border-1 surface-border border-round surface-ground">
          <i className="pi pi-users text-3xl text-primary mb-3"></i>
          <p className="text-lg">Usa la búsqueda para encontrar usuarios.</p>
          <p className="text-sm text-color-secondary">
            En pantallas pequeñas, los resultados se muestran como tarjetas
            individuales.
          </p>
        </div>
      ) : esMovilPequeno && usuariosFiltrados.length > 0 ? (
        <div className="mt-4">
            {/* Para depurar, puedes descomentar la siguiente línea para ver los IDs y nombres: */}
           {console.log("Verificando IDs en usuariosFiltrados:", usuariosFiltrados.map(u => ({ id: u.id, nombre: u.nombreCompleto })))} 
          {usuariosFiltrados.map((usuario, index) => {
            // Es crucial que la key sea única y estable para cada elemento.
            // Lo ideal es que usuario.id siempre sea único y esté definido.
            const keyParaElemento = usuario.id !== undefined && usuario.id !== null ? usuario.id : `usuario-fallback-${index}`;

            if (usuario.id === undefined || usuario.id === null) {
              console.warn(
                `Usuario encontrado sin un 'id' válido en el índice ${index}. Usando fallback key: "${keyParaElemento}". Usuario problemático:`,
                usuario
              );
            }
            return (
              <TarjetaUsuarioItem
                key={keyParaElemento} // Usar la key verificada o el fallback
                usuario={usuario}
                alEditar={abrirModal}
                alEliminar={manejoEliminarUsuario}
              />
            );
          })}
        </div>
      ) : (
        <div className="tabla-con-bordes overflow-x-auto">
          {" "}
          {/* Añadido overflow-x-auto para la tabla */}
          <TablaEquipos // Reutilizamos el componente de tabla
            columns={columnas}
            data={usuariosFiltrados}
            loading={carga}
          />
        </div>
      )}

      {/* Modal/Dialog para Crear/Editar Usuario */}
      {/* Reemplaza este placeholder con tu componente ModalFormularioUsuario real */}
      {mostrarModal && (
        // Asumiendo que tienes un componente ModalFormularioUsuario
        /*
         <ModalFormularioUsuario
           usuario={usuarioEditando}
           visible={mostrarModal}
           onHide={cerrarModal} // Usar función estable
           onSave={manejarGuardadoExitoso} // Usar función estable
           mostrarExito={mostrarMensajeExito}
           mostrarError={mostrarError}
           usuariosService={usuariosService}
         />
         */

        // Placeholder si aún no tienes el modal:
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              {usuarioEditando ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
            <p>Formulario de usuario (ID: {usuarioEditando?.id || "Nuevo"})</p>
            {/* ... campos del formulario ... */}
            <div className="flex justify-end gap-2 mt-6">
              <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text"
                onClick={cerrarModal} // Usar función estable
              />
              <Button
                label={usuarioEditando ? "Guardar Cambios" : "Crear Usuario"}
                icon="pi pi-check"
                onClick={() => {
                  // Lógica temporal para simular guardado
                  console.log("Guardando:", usuarioEditando || "Nuevo Usuario");
                  manejarGuardadoExitoso(); // Llama a la función de guardado
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
