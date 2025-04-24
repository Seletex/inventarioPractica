import * as FiIcons from "react-icons/fi";
import PropTypes from "prop-types";

export const Icono = ({ nombre }) => {
    const FeatherIcon = FiIcons[nombre];
    return FeatherIcon ? <FeatherIcon className="text-gray-400" /> : null;
};

Icono.propTypes = {
    nombre: PropTypes.string.isRequired,
};