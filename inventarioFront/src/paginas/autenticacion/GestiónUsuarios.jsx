import { useState, useEffect, useRef } from "react";

import { mockUsuariosService as usuariosService } from "../../servicios/mockUsuarios.api.js"; 
import { TablaEquipos } from "../../autenticacion/contexto/TablaDatos.jsx"; 
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { mostrarErrorFn , mostrarExitoFn,cargarEntidadesFn, manejoEliminarEntidadFn,}
 from "../../autenticacion/anzuelos/usoGestionFuncionesUsuario.js";


export default function GestionarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [carga, asignarCarga] = useState(true);
  const [mostrarModelo, asignarMostrarModelo] = useState(false); // Esto probablemente controlará un modal para editar/crear usuario
  const [usuarioEditando, setUsuarioEditando] = useState(null); // Renombrado
  const [busqueda, setBusqueda] = useState("");
  const toast = useRef(null);

  

  const columnas = [
    { Header: "Nombre Completo", accessor: "nombreCompleto" },
    { Header: "Correo Electrónico", accessor: "correo" },
    { Header: "Rol", accessor: "rol" },

    {
      Header: "Acciones",
      accessor: "acciones",
      Cell: ({ row }) => (
        <div
          className="flex flex-row gap-1"
          style={{ display: "flex", flexWrap: "nowrap" }}
        >
          <Button
            icon="pi pi-pencil" // Icono para editar
            className="p-button-rounded p-button-sm p-button-text p-button-primary"
            tooltip="Editar Usuario"
            tooltipOptions={{ position: "top" }}
            onClick={() => {
              setUsuarioEditando(row.original); // Pasa el objeto de usuario
              asignarMostrarModelo(true); // Mostrar modal de edición/creación
            }}
          />

          <Button
            icon="pi pi-trash" // Icono para eliminar
            className="p-button-rounded p-button-sm p-button-text p-button-danger"
            tooltip="Eliminar Usuario"
            tooltipOptions={{ position: "top" }}
            onClick={() => manejoEliminarUsuario(row.original.id)} // Usa la función adaptada/creada para eliminar usuario
          />
        </div>
      ),
      disableSortBy: true,
      style: { whiteSpace: "nowrap" },
      width: 150,
    },
  ];

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    if (busqueda) {
      const filtrados = usuarios.filter((usuario) =>
        Object.values(usuario).some(
          (val) =>
            val != null &&
            val.toString().toLowerCase().includes(busqueda.toLowerCase()) // Añadir val != null para evitar errores si algún valor es null/undefined
        )
      );
      setUsuariosFiltrados(filtrados);
    } else {
      setUsuariosFiltrados(usuarios);
    }
  }, [busqueda, usuarios]);
  const manejoEliminarUsuario = async (id) => {
    await manejoEliminarEntidadFn(
      id,
      usuariosService,
      mostrarExito,
      cargarUsuarios,
      mostrarError,
      "usuario", // Nombre de la entidad
      toast // Pasar la referencia del toast
    );
  };
  const cargarUsuarios = async()=> (
    await cargarEntidadesFn(
      asignarCarga,
      usuariosService,
      setUsuarios,
      setUsuariosFiltrados,
      mostrarError,
      "usuarios" // Nombre de la entidad
    ));

  const mostrarExito = (mensaje) => {
    mostrarExitoFn(mensaje, toast);
  };

  const mostrarError = (mensaje) => {
    mostrarErrorFn(mensaje, toast);
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <div className="flex justify-content-between align-items-center mb-4">
        {/* Cambiar título */}
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <div className="flex gap-2">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar usuarios..." // Cambiar placeholder
              className="w-full"
            />
          </span>
          {/* Botón para crear nuevo usuario */}
          <Button
            label="Nuevo Usuario" // Cambiar label
            icon="pi pi-plus"
            onClick={() => {
              setUsuarioEditando(null);
              asignarMostrarModelo(true);
            }}
          />
        </div>
      </div>
      <div className="tabla-con-bordes">
        <TablaEquipos // El componente TablaDatos es genérico, el nombre del archivo está bien
          columns={columnas}
          data={usuariosFiltrados} // Pasar los usuarios filtrados
          loading={carga}
        />
      </div>

      {mostrarModelo && (
        <ModalFormularioUsuario
          usuario={usuarioEditando} // Pasa el objeto de usuario (null para nuevo)
          visible={mostrarModelo}
          onHide={() => asignarMostrarModelo(false)} // Función para cerrar el modal
          onSave={() => {
            // Función que se llama al guardar
            asignarMostrarModelo(false); // Cerrar modal
            cargarUsuarios(); // Recargar la lista después de guardar
          }}
          mostrarExito={mostrarExito} // Pasar funciones de mensaje
          mostrarError={mostrarError}
          usuariosService={usuariosService} // Pasar el servicio de usuarios
        />
      )}
    </div>
  );
}

// Probablemente necesites un componente ModalFormularioUsuario en otro archivo
// import { ModalFormularioUsuario } from './ModalFormularioUsuario'; // Ejemplo
