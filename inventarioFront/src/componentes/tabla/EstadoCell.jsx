import PropTypes from 'prop-types';

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
  
export default EstadoCell;