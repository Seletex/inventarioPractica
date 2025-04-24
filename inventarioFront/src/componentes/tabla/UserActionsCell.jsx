import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
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
 UserActionsCell.propTypes = {
    row: PropTypes.shape({
      original: PropTypes.object.isRequired,
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
  };
