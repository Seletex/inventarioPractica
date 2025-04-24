import React from "react";
import PropTypes from "prop-types";
export function AccionesCellColumn({ row, manejarEdicion, manejarDarDeBaja, manejarEliminacion }) {
  return (
    <AccionesCellMemo
      row={row}
      onEdit={manejarEdicion}
      onDecommission={manejarDarDeBaja}
      onDelete={manejarEliminacion}
    />
)}

AccionesCellColumn.propTypes = {
  row: PropTypes.object.isRequired,
  manejarEdicion: PropTypes.func.isRequired,
  manejarDarDeBaja: PropTypes.func.isRequired,
  manejarEliminacion: PropTypes.func.isRequired,
};