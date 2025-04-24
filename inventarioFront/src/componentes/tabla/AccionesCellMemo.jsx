import React from 'react';
import PropTypes from 'prop-types';
import AccionesCellWrapper from './AccionesCellWrapper'; // Asegúrate de que la ruta sea correcta
function AccionesCellMemo({ row, onEdit, onDecommission, onDelete }) {
  return (
    <AccionesCellWrapper
      row={row}
      onEdit={onEdit}
      onDecommission={onDecommission}
      onDelete={onDelete}
    />
  );
}

AccionesCellMemo.propTypes = {
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDecommission: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AccionesCellMemo;
