// Archivo: GestionarEquipos.jsx
import { useState, useEffect, useRef, useCallback,useMemo } from "react";
import { mockEquiposService as equiposService } from "../../servicios/mockEquipos.api.js";
// *** IMPORTAR LA TABLA MEJORADA (TablaEquipos) ***
import { TablaEquipos } from "../../autenticacion/contexto/TablaDatos.jsx" // <-- Usa la ruta correcta de tu TablaEquipos
import { Button } from "primereact/button"; // Botón de PrimeReact
// *** IMPORTAR EL COMPONENTE AccionesCell ***
// <-- Usa la ruta donde creaste AccionesCell
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import {
  cargarEntidadesFn,

  mostrarExitoFn,
  mostrarErrorFn,
} from "../../autenticacion/anzuelos/usoGestionFuncionesEquipo.js"; // <-- Revisa esta ruta
import PropTypes from "prop-types"; // Importar PropTypes
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog'; // Para la confirmación de baja/eliminación
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para redirigir a actualizar/nuevo mantenimiento
//import ModalFormularioEquipo from "../componentes/ModalFormularioEquipo"; // Importar el componente ModalFormularioEquipo
function EstadoCell({ value }) {
  return (
    <span className={`estado-badge ${value === "Baja" ? "Inactivo" : "Activo"}`}>
      {value}
    </span>
  );
}

EstadoCell.propTypes = {
  value: PropTypes.string.isRequired,
};



function AccionesCellWrapper({ row }) {
  const manejarEdicion = (equipo) => {
    console.log(`Editing equipment with ID: ${equipo.id}`);
  };

  const manejarDarDeBaja = (equipo) => {
    // Define the logic for decommissioning an equipment
    console.log(`Decommissioning equipment with ID: ${equipo.id}`);
  };

  const manejarEliminacion = (equipo) => {
    // Define the logic for deleting an equipment
    console.log(`Deleting equipment with ID: ${equipo.id}`);
  };

  return (
    <AccionesCell
      row={row} // Pasar la prop 'row' recibida
      onEdit={manejarEdicion} // Pasar la función manejarEdicion como callback
      onDecommission={manejarDarDeBaja} // Pasar la función manejarDarDeBaja como callback
      onDelete={manejarEliminacion} // Pasar la función manejarEliminacion como callback
      // Puedes pasar otras props si AccionesCell las espera (ej: usuario logueado para permisos)
      // usuario={usuarioLogueado}
    />
  );
}
AccionesCellWrapper.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.object.isRequired, // Valida que 'row.original' sea un objeto
  }).isRequired,
};
export default function GestionarEquipos() {
  const [equipos, setEquipos] = useState([]);
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [carga, setCarga] = useState(true);
 //En caso de que se necesite un modal para crear/editar equipos
  const [mostrarModelo,setMostrarModelo] = useState(false); // Para el modal de crear/editar
  const [equipoEditando,setEquipoEditando] = useState(null); // Guardará el equipo seleccionado para editar
  const [busqueda, setBusqueda] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate(); // Para navegar a páginas de gestión específicas


  // --- Funciones genéricas de mensaje (si usan Toast) ---
  // Estas ya están definidas en usoGestionFunciones.js, solo las usamos aquí
  const mostrarExito = useCallback((mensaje) => {
    mostrarExitoFn(mensaje, toast);
  }, [toast]);

  const mostrarError = useCallback((mensaje) => {
    mostrarErrorFn(mensaje, toast);
  }, [toast]);


  // --- Función para cargar equipos (usando la función genérica) ---
  const cargarEquipos = useCallback(async () => {
    await cargarEntidadesFn( // Usar la función genérica
      setCarga,
      equiposService, // Pasar el servicio específico
      setEquipos,
      setEquiposFiltrados,
      mostrarError, // Pasar la función de error
      'equipos' // Pasar el nombre de la entidad para los mensajes
    );
  }, [setCarga, setEquipos, setEquiposFiltrados, mostrarError]); // Dependencias


  // --- Funciones de Acción (Llamadas desde AccionesCell) ---

  // Manejar Edición (normalmente navega a la página de actualizar)
  const manejarEdicion = useCallback((equipo) => {
      // Redirigir a la página de actualizar equipo, pasando la placa
      navigate(`/actualizar-equipo/${equipo.placa}`);
      // Opcional: Si usas un modal de edición, setEquipoEditando(equipo); setMostrarModelo(true);
  }, [navigate]); // Dependencia: navigate


  // Manejar Dar de Baja (con confirmación)
  const manejarDarDeBaja = useCallback((placa) => {
      confirmDialog({
          message: `¿Estás seguro de dar de baja el equipo con placa ${placa}?`,
          header: 'Confirmar Baja',
          icon: 'pi pi-info-circle',
          acceptClassName: 'p-button-warning', // Estilo del botón de aceptar
          accept: async () => { // Lógica al confirmar la baja
              try {
                   const datosParaBaja = { estado: 'Baja' }; // Objeto con el nuevo estado
                   await equiposService.update(placa, datosParaBaja); // Llama al servicio para actualizar el estado
                   mostrarExito(`Equipo con placa ${placa} dado de baja correctamente`);
                   cargarEquipos(); // Recargar lista para mostrar el cambio
               } catch (error) {
                    mostrarError(`Error al dar de baja equipo ${placa}: ${error.message}`);
               }
               },
          reject: () => {
              // Lógica al cancelar
               toast.info("Operación de baja cancelada"); // O usar mostrarExito/mostrarError
          }
      });
  }, [mostrarExito, mostrarError, cargarEquipos]); // Dependencias


   // Manejar Eliminación (con confirmación)
   // Esto es diferente a Dar de Baja (que cambia el estado), esto BORRA el registro
  
  // Cargar equipos al iniciar (usando el hook cargado)
  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]); // Dependencia: la función cargada del useCallback


  // Filtrar equipos cuando cambia la búsqueda (código existente)
  useEffect(() => {
    if (busqueda) {
      const filtrados = equipos.filter((equipo) =>
        Object.values(equipo).some((val) =>
          val != null && val.toString().toLowerCase().includes(busqueda.toLowerCase()) // Added null check
        )
      );
      setEquiposFiltrados(filtrados);
    } else {
      setEquiposFiltrados(equipos);
    }
  }, [busqueda, equipos]); // Dependencias


  // Define columnas para TablaEquipos (REACT-TABLE FORMAT)
  // Las columnas deben tener Header, accessor, y Cell si es necesario
  const columnas = useMemo(() => [ // Usar useMemo si las columnas no dependen del estado
      {
          Header: "Acciones",
          accessor: "acciones", // Nombre interno (no necesita coincidir con propiedad de datos)
          // *** USAR EL COMPONENTE AccionesCell DIRECTAMENTE EN LA PROP Cell ***
          Cell: ({ row }) => ( // react-table pasa 'row' a la función Cell
              <AccionesCell
                  row={row} // Pasar la prop 'row' recibida
                  onEdit={manejarEdicion} // Pasar la función manejarEdicion como callback
                  onDecommission={manejarDarDeBaja} // Pasar la función manejarDarDeBaja como callback
                  // Pasar la función manejarEliminacion como callback
                  // Puedes pasar otras props si AccionesCell las espera (ej: usuario logueado para permisos)
                  // usuario={usuarioLogueado}
              />
          ),
          disableSortBy: true, // Deshabilitar ordenación para esta columna
          // style: { whiteSpace: "nowrap" }, // Estilos para la celda (puede ir en CSS)
          // width: 150, // Ancho (prop de react-table, no de estilo CSS)
      },
  ], [manejarEdicion, manejarDarDeBaja]); // Dependencias: funciones de acción (envueltas en useCallback)

   // Si usas un modal para Crear/Editar, necesitas definirlo aquí
   const handleNuevoEquipoClick = () => { setEquipoEditando(null); setMostrarModelo(true); };
   const handleCloseModal = () => { setMostrarModelo(false); setEquipoEditando(null); };
   const handleSaveModal = () => { 
       // Lógica de guardar en modal
       cargarEquipos(); 
       handleCloseModal(); 
   };


  return (
    <div className="p-4">
      <Toast ref={toast} /> {/* Contenedor para notificaciones Toast */}
      <ConfirmDialog /> {/* Contenedor para ConfirmDialog */}

      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Equipos</h1>
        <div className="flex gap-2">
          {/* Barra de búsqueda */}
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar equipos..."
              className="w-full"
            />
          </span>
          {/* Botón Nuevo Equipo (si usas modal o navegas a página de registro) */}
          <Button
            label="Nuevo Equipo"
            icon="pi pi-plus"
             // Si usas un modal: onClick={handleNuevoEquipoClick}
             // Si navegas a página de registro:
             onClick={() => navigate('/registrar-equipo')}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="tabla-con-bordes"> {/* Clases para aplicar estilos de borde si son necesarios */}
        <TablaEquipos
          columns={columnas} // Pasar las columnas en formato react-table
          data={equiposFiltrados} // Pasar los datos a mostrar
          loading={carga} // Pasar estado de carga si TablaEquipos lo usa
          // Ya no pasamos onDelete aquí, las acciones se manejan en AccionesCell vía callbacks
          // onDelete={manejoEliminar} // <-- Eliminar esta prop
        />
{//Modal para Confirmar Baja/Eliminar (si lo usas en lugar de botones directos)}
}
      {/* Modal para Crear/Editar Equipo (si lo usas en lugar de páginas separadas) */}
      {mostrarModelo && (
        <ModalFormularioEquipo
          visible={mostrarModelo}
          onCreate={handleNuevoEquipoClick} // Si usas un modal, puedes pasar la función de crear
          onEdit={equipoEditando} // Si estás editando, pasar el equipo
          onHide={handleCloseModal}
          onSave={handleSaveModal}
          equipo={equipoEditando}
          // ... pasar servicios, mensajes, etc.
        />
      )}
    </div>
  </div>
  );
}// Fin del componente GestionarEquipos