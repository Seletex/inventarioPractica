import * as FiIcons from "react-icons/fi";
export const Icono = ({ nombre }) => {
    const FeatherIcon = FiIcons[nombre];
    return FeatherIcon ? <FeatherIcon className="text-gray-400" /> : null;
};