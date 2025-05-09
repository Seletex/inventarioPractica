import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { mockUsuariosService as usuariosService } from "../../servicios/mockUsuarios.api.js";
import { TablaEquipos } from "../../autenticacion/contexto/TablaDatos.jsx";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import {
  mostrarErrorFn,
  mostrarExitoFn,
  cargarEntidadesFn,
  manejoEliminarEntidadFn,
} from "../../autenticacion/anzuelos/usoGestionFuncionesUsuario.js";
const normalizarString = (str) => {
  if (typeof str !== "string") return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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
  return "info";
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
  const [mostrarModal, asignarMostrarModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const toast = useRef(null);

  const mostrarMensajeExito = useCallback((mensaje) => {
    mostrarExitoFn(mensaje, toast);
  }, []);

  const mostrarMensajeError = useCallback((mensaje) => {
    mostrarErrorFn(mensaje, toast);
  }, []);

  const busquedaDebounced = useDebounce(busqueda, 300);
  const esMovilPequeno = useMediaQuery("(max-width: 575px)");

  const cargarUsuarios = useCallback(async () => {
    await cargarEntidadesFn(
      asignarCarga,
      usuariosService,
      setUsuarios,
      setUsuariosFiltrados,
      mostrarMensajeError,
      "usuarios"
    );
  }, [mostrarMensajeError]);
  const manejoEliminarUsuario = useCallback(
    async (id) => {
      // Ejemplo si necesitaras confirmación aquí:
      // confirmarAccionFn(
      //   '¿Está seguro de eliminar este usuario?',
      //   'Confirmar Eliminación',
      //   async () => {
      await manejoEliminarEntidadFn(
        id,
        usuariosService,
        mostrarMensajeExito,
        cargarUsuarios,
        mostrarMensajeError,
        "usuario",
        toast
      );
    },
    [mostrarMensajeExito, cargarUsuarios, mostrarMensajeError]
  );

  const abrirModal = useCallback((usuario = null) => {
    setUsuarioEditando(usuario);
    asignarMostrarModal(true);
  }, []);

  const cerrarModal = useCallback(() => {
    asignarMostrarModal(false);
    setUsuarioEditando(null);
  }, []);

  const manejarGuardadoExitoso = useCallback(() => {
    cerrarModal();
    cargarUsuarios();
  }, [cerrarModal, cargarUsuarios]);

  const columnas = useMemo(
    () => [
      { Header: "Nombre Completo", accessor: "nombreCompleto" },
      { Header: "Correo Electrónico", accessor: "correo" },
      {
        Header: "Rol",
        accessor: "rol",
        Cell: ({ value }) => {
          const severity = getRolSeverity(value);

          return <Tag severity={severity} value={value || "N/A"} />;
        },
      },
      {
        Header: "Acciones",
        id: "acciones",
        Cell: ({ row }) => (
          <div className="flex flex-row gap-1 flex-nowrap">
            {" "}
            <EditUserButton onClick={() => abrirModal(row.original)} />
            <DeleteUserButton
              onClick={() => manejoEliminarUsuario(row.original.id)}
            />
          </div>
        ),
        disableSortBy: true,
      },
    ],
    [abrirModal, manejoEliminarUsuario]
  );
  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

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

  const TarjetaUsuarioItem = ({ usuario, alEditar, alEliminar }) => {
    const rolSeverity = getRolSeverity(usuario.rol);

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
          <span className="p-input-icon-left w-full sm:w-auto">
            <i className="pi pi-search" />
            <InputText
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar usuarios..."
              className="w-full"
            />
          </span>

          <Button
            label="Nuevo Usuario"
            icon="pi pi-plus"
            className="p-button-primary"
            onClick={() => abrirModal(null)}
          />
        </div>
      </div>

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
          {console.log(
            "Verificando IDs en usuariosFiltrados:",
            usuariosFiltrados.map((u) => ({
              id: u.id,
              nombre: u.nombreCompleto,
            }))
          )}
          {usuariosFiltrados.map((usuario, index) => {
            const keyParaElemento =
              usuario.id !== undefined && usuario.id !== null
                ? usuario.id
                : `usuario-fallback-${index}`;

            if (usuario.id === undefined || usuario.id === null) {
              console.warn(
                `Usuario encontrado sin un 'id' válido en el índice ${index}. Usando fallback key: "${keyParaElemento}". Usuario problemático:`,
                usuario
              );
            }
            return (
              <TarjetaUsuarioItem
                key={keyParaElemento}
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
          <TablaEquipos
            columns={columnas}
            data={usuariosFiltrados}
            loading={carga}
          />
        </div>
      )}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              {usuarioEditando ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
            <p>Formulario de usuario (ID: {usuarioEditando?.id || "Nuevo"})</p>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text"
                onClick={cerrarModal}
              />
              <Button
                label={usuarioEditando ? "Guardar Cambios" : "Crear Usuario"}
                icon="pi pi-check"
                onClick={() => {
                  console.log("Guardando:", usuarioEditando || "Nuevo Usuario");
                  manejarGuardadoExitoso();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
