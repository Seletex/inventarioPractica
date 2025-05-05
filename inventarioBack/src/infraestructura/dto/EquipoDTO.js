/**
 * @class EquipoDTO
 * @description Data Transfer Object para representar la información de un equipo.
 *              Valida los campos requeridos en el momento de la creación.
 */
class EquipoDTO {
  /**
   * @param {string} placa - Placa única del equipo (Requerido).
   * @param {string} tipoEquipo - Tipo de equipo (ej. Portátil, Escritorio) (Requerido).
   * @param {string} marca - Marca del equipo (Requerido).
   * @param {string} [modelo] - Modelo específico del equipo.
   * @param {string} [serial] - Número de serie del equipo (Corresponde a 'numeroSerie' en algunos contextos).
   * @param {string} ubicacion - ID o nombre de la ubicación actual (Requerido).
   * @param {string} [ram] - Cantidad de RAM (ej. "8GB").
   * @param {string} [tipo_almacenamiento] - Tipo de almacenamiento (ej. SSD, HDD).
   * @param {string} [almacenamiento] - Capacidad de almacenamiento (ej. "256GB").
   * @param {string} [sistema_operativo] - Sistema operativo instalado.
   * @param {string} [office] - Versión de Office instalada.
   * @param {string} fecha_adquisicion - Fecha de adquisición (YYYY-MM-DD) (Requerido).
   * @param {string} [fechaEntrega] - Fecha de entrega al usuario (YYYY-MM-DD). (Opcional, no presente claramente en forms)
   * @param {string} [garantia] - Indica si el equipo tiene garantía ('true'/'false' desde el form).
   * @param {string} [tiempo_garantia] - Detalles o fecha de fin de la garantía.
   * @param {string} [teclado] - Indica si se entregó teclado ('true'/'false' desde el form).
   * @param {string} [mouse] - Indica si se entregó mouse ('true'/'false' desde el form).
   * @param {string} [monitor] - Marca del monitor entregado (Viene de 'monitor' en el form).
   * @param {string} [modelo_monitor] - Modelo del monitor entregado.
   * @param {string} [responsable] - ID o nombre del usuario responsable.
   * @param {string} [usuarioAsignado] - ID o nombre del usuario asignado al equipo (Corregido typo 'usaurioAsignado').
   * @param {string} [entregado] - Indica si el equipo ha sido entregado ('true'/'false' desde el form).
   * @param {string} [estado='Operativo'] - Estado actual del equipo (ej. Operativo, En reparación, De baja).
   * @throws {Error} Si alguno de los campos requeridos falta o es inválido.
   */
  constructor(
    placa,
    tipoEquipo,
    marca,
    modelo,
    serial, // Ajustado nombre
    ubicacion,
    ram,
    tipo_almacenamiento, // Ajustado nombre
    almacenamiento,
    sistema_operativo, // Ajustado nombre
    office,
    fecha_adquisicion, // Ajustado nombre
    fechaEntrega, // Mantener si se necesita, aunque no claro en forms
    garantia, // Recibe el sí/no del form
    tiempo_garantia, // Recibe los detalles del form
    teclado,
    mouse,
    monitor, // Recibe la marca del monitor del form
    modelo_monitor, // Ajustado nombre
    responsable,
    usuarioAsignado, // Añadido campo (corregido typo)
    entregado,
    estado
  ) {
    // --- Validaciones de campos requeridos (basado en CrearEquipos.jsx) ---
    if (!placa || typeof placa !== 'string' || placa.trim() === '') {
        throw new Error("La 'placa' es requerida y debe ser una cadena no vacía para EquipoDTO.");
    }
    if(!tipoEquipo || typeof tipoEquipo !== 'string' || tipoEquipo.trim() === ''){
        throw new Error("El 'tipoEquipo' es requerido para EquipoDTO.");
    }
    if(!marca || typeof marca !== 'string' || marca.trim() === ''){
        throw new Error("La 'marca' es requerida para EquipoDTO.");
    }
    if(!ubicacion || typeof ubicacion !== 'string' || ubicacion.trim() === ''){
        throw new Error("La 'ubicacion' es requerida para EquipoDTO.");
    }
    if(!fecha_adquisicion || typeof fecha_adquisicion !== 'string' || fecha_adquisicion.trim() === ''){
      throw new Error("La 'fecha_adquisicion' es requerida para EquipoDTO.");
    }
    // Nota: 'entregado' y otros campos booleanos/selects son opcionales en el form, así que no se validan como requeridos aquí.

    // --- Asignación de propiedades a la instancia ---
    this.placa = placa.trim();
    this.tipoEquipo = tipoEquipo.trim();
    this.marca = marca.trim();
    this.modelo = modelo?.trim() || null;
    this.serial = serial?.trim() || null; // Usar nombre del form
    this.ubicacion = ubicacion.trim();
    this.ram = ram?.trim() || null;
    this.tipo_almacenamiento = tipo_almacenamiento?.trim() || null; // Usar nombre del form
    this.almacenamiento = almacenamiento?.toString().trim() || null; // Convertir a string si es número
    this.sistema_operativo = sistema_operativo?.trim() || null; // Usar nombre del form
    this.office = office?.trim() || null;
    this.fecha_adquisicion = fecha_adquisicion.trim(); // Usar nombre del form
    this.fechaEntrega = fechaEntrega?.trim() || null; // Mantener si es útil
    this.tieneGarantia = String(garantia).toLowerCase() === 'true'; // Convertir sí/no a booleano
    this.tiempo_garantia = tiempo_garantia?.trim() || null; // Usar nombre del form para detalles
    this.teclado = String(teclado).toLowerCase() === 'true';
    this.mouse = String(mouse).toLowerCase() === 'true';
    this.marcaMonitor = monitor?.trim() || null; // Guardar la marca que viene del form
    this.modelo_monitor = modelo_monitor?.trim() || null; // Usar nombre del form
    this.responsable = responsable?.trim() || null;
    this.usuarioAsignado = usuarioAsignado?.trim() || null; // Añadido
    this.entregado = String(entregado).toLowerCase() === 'true';
    this.estado = estado?.trim() || 'Operativo'; // Añadir estado por defecto si no viene
  }
}

module.exports = EquipoDTO;
