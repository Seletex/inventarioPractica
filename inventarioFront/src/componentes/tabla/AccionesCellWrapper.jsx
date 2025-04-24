import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';

const AccionesCellWrapper = ({ rowData, onEdit, onDelete }) => {
  return (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        outlined
        severity="info"
        onClick={() => onEdit(rowData)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        onClick={() => onDelete(rowData)}
      />
    </div>
  );
};

AccionesCellWrapper.propTypes = {
  rowData: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AccionesCellWrapper;
