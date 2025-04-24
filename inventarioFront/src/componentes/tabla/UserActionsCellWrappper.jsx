import React from 'react';
import PropTypes from 'prop-types';
import { UserActionsCell } from './UserActionsCell.jsx'; // Import the UserActionsCell component
export function UserActionsCellWrapper({ row, onEdit }) {
  return (
    <UserActionsCell
      row={row}
      onEdit={onEdit}
    />
  );
}
UserActionsCellWrapper.propTypes = {
  row: PropTypes.object.isRequired, // Add validation for row
  onEdit: PropTypes.func.isRequired,
};