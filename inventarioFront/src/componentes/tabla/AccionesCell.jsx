import React from "react";
import PropTypes from "prop-types";
import { Button } from "primereact/button"; // Importar Button de PrimeReact
import { useNavigate } from "react-router-dom"; // Importar useNavigate

function AccionesCell({ row, onEdit, onDecommission, onDelete, onProgramMaintenance }) {
  // 'row.original' contiene el objeto de datos completo de la fila actual
  const equipo = row.original;
  const navigate = useNavigate(); // Hook para navegación programática (si se necesita para redirección)

  // --- Funciones para manejar clic en los botones ---
  const handleEditClick = () => {
    // Llama al callback pasado como prop, o navega directamente
    if (onEdit) {
      onEdit(equipo); // Pasa el objeto completo del equipo
    } else {
      // Opción común: Navegar a la página de actualización con la placa
      navigate(`/actualizar-equipo/${equipo.placa}`);
    }
  };
  const handleProgramMaintenanceClick = () => {
    // Llama al callback pasado como prop
    if (onProgramMaintenance) {
      navigate(`/nuevo-mantenimiento/${equipo.placa}`); // Navegar a la página de nuevo mantenimiento
      onProgramMaintenance(equipo.placa, "Baja");
    }
  };

  const handleDeleteClick = () => {
    // Llama al callback pasado como prop
    if (onDelete) {
      // Se puede pasar el identificador (placa) y quizás el nuevo estado si el callback lo necesita
      onDelete(equipo.placa, "Baja");
    }
  }

  const handleDecommissionClick = () => {
    // Llama al callback pasado como prop
    if (onDecommission) {
      // Se puede pasar el identificador (placa) y quizás el nuevo estado si el callback lo necesita
      onDecommission(equipo.placa, "Baja");
    }
    // Nota: La confirmación (ej: ConfirmDialog) debería manejarse *antes* de llamar a onDecommission en el componente padre.
  };

  return (
    <div
      className="flex flex-row gap-1"
      style={{ display: "flex", flexWrap: "nowrap" }}
    >
      {equipo.estado !== "Baja" && ( // Ejemplo: No permitir editar si ya está de baja
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-sm p-button-text p-button-primary"
          tooltip="Editar"
          tooltipOptions={{ position: "top" }}
          onClick={handleEditClick} // Llama a la función manejadora
        />
      )}

      {equipo.estado !== "Baja" && (
        <Button
          icon="pi pi-power-off" // Icono para dar de baja (o similar)
          className="p-button-rounded p-button-sm p-button-text p-button-warning"
          tooltip="Dar de baja"
          tooltipOptions={{ position: "top" }}
          onClick={handleDecommissionClick} // Llama a la función manejadora
          // Ya deshabilitado por la condición de renderizado {equipo.estado !== 'Baja'}
          // disabled={equipo.estado === 'Baja'}
        />
      )}

      {/* Ejemplo: Botón Programar Mantenimiento (si el equipo no está de baja) */}
      {equipo.estado !== "Baja" && (
        <Button
          icon="pi pi-calendar" // Icono de calendario
          className="p-button-rounded p-button-sm p-button-text p-button-info"
          tooltip="Programar Mantenimiento"
          tooltipOptions={{ position: "top" }}
          onClick={() => navigate(`/nuevo-mantenimiento/${equipo.placa}`)} // Navegar a la página de nuevo mantenimiento
        />
      )}
      {equipo.estado !== "Baja" && (
        <Button
          icon="pi pi-calendar" // Icono de calendario
          className="p-button-rounded p-button-sm p-button-text p-button-info"
          tooltip="Programar Mantenimiento"
          tooltipOptions={{ position: "top" }}
          onClick={handleProgramMaintenanceClick} // Navegar a la página de nuevo mantenimiento
        />
      )}
      {equipo.estado !== "Baja" && ( // Ejemplo: No permitir editar si ya está de baja
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-sm p-button-text p-button-primary"
          tooltip="Editar"
          tooltipOptions={{ position: "top" }}
          onClick={handleDeleteClick} // Llama a la función manejadora
        />
      )}
    </div>
  );
}

// Prop Types para AccionesCell
AccionesCell.propTypes = {
  // 'row' es la prop que react-table pasa a las funciones Cell
  row: PropTypes.shape({
    original: PropTypes.object, // Permite que original sea null o undefined para mayor robustez, aunque idealmente no debería serlo
  }).isRequired,
  // Funciones callback pasadas desde el padre
  onEdit: PropTypes.func.isRequired, // Función para manejar la edición
  onDecommission: PropTypes.func.isRequired, // Función para manejar la baja
  onDelete: PropTypes.func.isRequired, // Función para manejar la eliminación
  onProgramMaintenance: PropTypes.func, // Añadido Programar Mantenimiento (si lo implementaste)
};
export { AccionesCell };