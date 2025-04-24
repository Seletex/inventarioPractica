import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

import { mockUsuariosService as usuariosService } from "../../servicios/mockUsuarios.api.js"; 
import { TablaEquipos } from "../../autenticacion/contexto/TablaDatos.jsx"; 
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { 
  mostrarErrorFn, 
  mostrarExitoFn, 
  cargarEntidadesFn, 

} from "../../autenticacion/anzuelos/usoGestionFuncionesUsuario.js";
// Importar el componente modal (falta en el código original)
// import { ModalFormularioUsuario } from './ruta/al/ModalFormularioUsuario';
export function UserActionsCellWrapper({ row, onEdit }) {
  return (
    <UserActionsCell
      row={row}
      onEdit={onEdit}
    />
  );
}
export function UserActionsCell({ row, onEdit }) {
  return (
    <div
      className="flex flex-row gap-1"
      style={{ display: "flex", flexWrap: "nowrap" }}
    >
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-sm p-button-text p-button-primary"
        tooltip="Editar Usuario"
        tooltipOptions={{ position: "top" }}
        onClick={() => onEdit(row.original)}
      />
    </div>
  );
}
UserActionsCellWrapper.propTypes = {
  row: PropTypes.object.isRequired, // Add validation for row
  onEdit: PropTypes.func.isRequired,
};

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [carga, setCarga] = useState(false);
  const [mostrarModelo, setMostrarModelo] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const toast = useRef(null);

  // Definir mostrarError antes de usarlo
  const mostrarError = useCallback((mensaje) => {
    mostrarErrorFn(mensaje, toast);
  }, []);

  const mostrarExito = (mensaje) => {
    mostrarExitoFn(mensaje, toast);
  };

  // Definir cargarUsuarios antes de usarlo en useEffect
  const cargarUsuarios = useCallback(async () => {
    await cargarEntidadesFn(
      setCarga,
      usuariosService,
      setUsuarios,
      setUsuariosFiltrados,
      mostrarError,
      "usuarios"
    );
  }, [setCarga, mostrarError]);

  // Definir manejoEliminarUsuario antes de usarlo en columnas
  

  // Componente de celda de acciones fuera del componente principal
 
  
  UserActionsCell.propTypes = {
    row: PropTypes.shape({
      original: PropTypes.object.isRequired,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
  };

  // Wrapper component for UserActionsCell
  
  // Definir columnas después de los hooks y funciones que usa
  const columnas = [
    {
      Header: "Acciones",
      accessor: "acciones",
      Cell: UserActionsCellWrapper
    }
  ];
     
  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]); // Efecto inicial para cargar usuarios

  useEffect(() => {
    if (busqueda) {
      const filtrados = usuarios.filter((usuario) =>
        Object.values(usuario).some(
          (val) =>
            val != null &&
            val.toString().toLowerCase().includes(busqueda.toLowerCase())
        )
      );
      setUsuariosFiltrados(filtrados);
    } else {
      setUsuariosFiltrados(usuarios);
    }
  }, [busqueda, usuarios]); // Separar este efecto y quitar cargarUsuarios de las dependencias

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <div className="flex gap-2">
          <span className="p-input-icon-left">
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
            onClick={() => {
              setUsuarioEditando(null);
              setMostrarModelo(true);
            }}
          />
        </div>
      </div>
      <div className="tabla-con-bordes">
        <TablaEquipos
          columns={columnas}
          data={usuariosFiltrados}
          loading={carga}
        />
      </div>

      {mostrarModelo && (
        <ModalFormularioUsuario
          usuario={usuarioEditando}
          visible={mostrarModelo}
          onHide={() => setMostrarModelo(false)}
          onSave={() => {
            setMostrarModelo(false);
            cargarUsuarios();
          }}
          mostrarExito={mostrarExito}
          mostrarError={mostrarError}
          usuariosService={usuariosService}
        />
      )}
    </div>
  );
}