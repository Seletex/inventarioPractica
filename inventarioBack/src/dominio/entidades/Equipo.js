const EspecificacionesEquipo = require("./EspecificacionesEquipo");
const GarantiaEquipo = require("./GarantiaEquipo");
const EstadoEquipo = require("./datos/EstadosEquipo");
class Equipo {
  constructor(
    placa,
    tipoEquipoId,
    marcaId,
    ubicacionId,
    fechaAdquisicion,
    modelo,
    serial,
    especificaciones,
    garantia,
    tieneTeclado,
    tieneMouse,
    marcaMonitor,
    modeloMonitor,
    responsable,
    entregado,
    estado = EstadoEquipo.Activo // Valor por defecto para el estado
  ) {
    // Validaciones básicas de campos requeridos
    if (
      !placa ||
      !tipoEquipoId ||
      !marcaId ||
      !ubicacionId ||
      !fechaAdquisicion
    ) {
      throw new Error(
        "Faltan datos esenciales (placa, tipo, marca, ubicación, fecha adquisición) para crear la entidad Equipo."
      );
    }
    if (!(especificaciones instanceof EspecificacionesEquipo)) {
      throw new Error(
        "Se requiere una instancia válida de EspecificacionesEquipo."
      );
    }
    if (!(garantia instanceof GarantiaEquipo)) {
      throw new Error("Se requiere una instancia válida de GarantiaEquipo.");
    }
    if (estado && !Object.values(EstadoEquipo).includes(estado)) {
      throw new Error(`Estado inicial '${estado}' no es válido.`);
    }
    // Ajustar estado inicial si ya viene con responsable/entregado
    if (responsable && entregado && estado === EstadoEquipo.Activo) {
      estado = EstadoEquipo.Asignado;
    }

    this.id = id;
    this.placa = placa;
    this.tipoEquipoId = tipoEquipoId;
    this.marcaId = marcaId;
    this.ubicacionId = ubicacionId;
    this.fechaAdquisicion =
      fechaAdquisicion instanceof Date
        ? fechaAdquisicion
        : new Date(fechaAdquisicion);
    this.modelo = modelo ?? null;
    this.serial = serial ?? null;
    this.especificaciones = especificaciones;
    this.garantia = garantia;
    this.tieneTeclado = !!tieneTeclado;
    this.tieneMouse = !!tieneMouse;
    this.marcaMonitor = marcaMonitor ?? null;
    this.modeloMonitor = modeloMonitor ?? null;
    this.responsable = responsable ?? null;
    this.entregado = !!entregado;
    this.estado = estado;
    this.motivoBaja = null;
    this.fechaBaja = null;
  }

  static crearNuevo(datos, { generarId }) {
    const id = generarId(); // Genera ID único

    // Crear instancias de los Value Objects
    const especificaciones = new EspecificacionesEquipo(
      datos.ram,
      datos.tipo_almacenamiento,
      datos.almacenamiento,
      datos.sistema_operativo,
      datos.office
    );

    const garantia = new GarantiaEquipo(
      datos.garantia === "si", // Convertir 'si'/'no' a booleano
      datos.tiempo_garantia
    );

    // Asegurarse que la fecha sea un objeto Date
    const fechaAdquisicion = datos.fecha_adquisicion
      ? new Date(datos.fecha_adquisicion)
      : new Date();

    return new Equipo(
      id,
      datos.placa,
      datos.tipoEquipo, // Asume que el valor del select es el ID/clave
      datos.marca, // Asume que el valor del select es el ID/clave
      datos.ubicacion, // Asume que el valor del select es el ID/clave
      fechaAdquisicion,
      datos.modelo,
      datos.serial,
      especificaciones,
      garantia,
      datos.teclado === "si", // Convertir 'si'/'no' a booleano
      datos.mouse === "si", // Convertir 'si'/'no' a booleano
      datos.monitor, // Asume que el valor del select es la marca/ID
      datos.modelo_monitor,
      datos.responsable,
      datos.entregado === "si" // Convertir 'si'/'no' a booleano
      // Se puede añadir estado inicial si es necesario
    );
  }
  cambiarUbicacion(nuevaUbicacionId) {
    if (!nuevaUbicacionId) {
      throw new Error("Se requiere un ID de nueva ubicación.");
    }
    if (this.estado === EstadoEquipo.Baja) {
      throw new Error("No se puede cambiar la ubicación de un equipo en baja.");
    }
    const ubicacionesValidas = Object.values(UbicacionesEnum);
    if(!ubicacionesValidas.includes(nuevaUbicacionId)) {
        throw new Error(`Ubicación '${nuevaUbicacionId}' no es válida.`);
    }
    this.ubicacionId = nuevaUbicacionId;
    console.log(
      `Equipo ${this.placa} ubicación cambiada a ${nuevaUbicacionId}`
    );
  }

  asignarYEntregar(nombreResponsable) {
    if (!nombreResponsable) {
      throw new Error("Se requiere el nombre del responsable.");
    }
    if (
      this.estado !== ESTADOS_EQUIPO.ACTIVO &&
      this.estado !== ESTADOS_EQUIPO.ASIGNADO
    ) {
      // Permitir reasignar?
      throw new Error(
        `No se puede asignar un equipo en estado ${this.estado}.`
      );
    }
    if (this.responsable && this.entregado) {
      console.warn(
        `Equipo ${this.placa} ya estaba asignado a ${this.responsable}. Reasignando a ${nombreResponsable}.`
      );
      // Podrías requerir primero un método 'retirarEntrega'
    }

    this.responsable = nombreResponsable;
    this.entregado = true;
    this.estado = ESTADOS_EQUIPO.ASIGNADO;
    console.log(
      `Equipo ${this.placa} asignado y entregado a ${nombreResponsable}`
    );
    // Emitir evento: EquipoAsignado
  }
  retirarEntrega() {
    if (!this.responsable || !this.entregado) {
      console.warn(`Equipo ${this.placa} no estaba asignado o entregado.`);
      return; // O lanzar error si se prefiere
    }
    if (this.estado === ESTADOS_EQUIPO.BAJA) {
      throw new Error(
        "No se puede retirar la entrega de un equipo dado de baja."
      );
    }

    const antiguoResponsable = this.responsable;
    this.responsable = null;
    this.entregado = false;
    this.estado = ESTADOS_EQUIPO.ACTIVO; // Vuelve a estar disponible
    console.log(`Equipo ${this.placa} retirado de ${antiguoResponsable}`);
    // Emitir evento: EquipoEntregaRetirada
  }
  darDeBaja(motivo, fecha = new Date()) {
    if (this.estado === ESTADOS_EQUIPO.BAJA) {
      console.warn(`Equipo ${this.placa} ya estaba dado de baja.`);
      return;
    }
    if (this.entregado || this.responsable) {
      throw new Error(
        `Primero debe retirar la entrega del equipo ${this.placa} antes de darlo de baja.`
      );
    }
    if (!motivo) {
      throw new Error("Se requiere un motivo para dar de baja el equipo.");
    }

    this.estado = EstadoEquipo.Baja;
    this.motivoBaja = motivo;
    this.fechaBaja = fecha;
    this.responsable = null; // Asegurar que no quede asignado
    this.entregado = false;
    console.log(`Equipo ${this.placa} dado de baja. Motivo: ${motivo}`);
    // Emitir evento: EquipoDadoDeBaja
  }
  ponerEnMantenimiento() {
    if (this.estado === EstadoEquipo.Baja) {
      throw new Error(
        "No se puede poner en mantenimiento un equipo dado de baja."
      );
    }
    if (this.estado === EstadoEquipo.Mantenimiento) {
      console.warn(`Equipo ${this.placa} ya está en mantenimiento.`);
      return;
    }
    if (this.entregado || this.responsable) {
      throw new Error(
        `Primero debe retirar la entrega del equipo ${this.placa} antes de ponerlo en mantenimiento.`
      );
    }
    this.estado = EstadoEquipo.Mantenimiento;
    console.log(`Equipo ${this.placa} puesto en mantenimiento.`);
    // Emitir evento: EquipoEnMantenimiento
  }
  reactivar() {
    // Quizás no se debería poder reactivar desde BAJA sin más lógica.
    if (this.estado !== EstadoEquipo.Mantenimiento /* && this.estado !== ESTADOS_EQUIPO.BAJA */) {
        throw new Error(`No se puede reactivar un equipo en estado ${this.estado}.`);
    }

    const estadoAnterior = this.estado;
    this.estado = EstadoEquipo.Activo;
    this.motivoBaja = null; // Limpiar info de baja si viene de ahí
    this.fechaBaja = null;
    console.log(`Equipo ${this.placa} reactivado desde ${estadoAnterior}.`);
    // Emitir evento: EquipoReactivado
}
  toPlainObject() {
    return {
      id: this.id,
      placa: this.placa,
      tipoEquipoId: this.tipoEquipoId,
      marcaId: this.marcaId,
      ubicacionId: this.ubicacionId,
      fechaAdquisicion: this.fechaAdquisicion.toISOString().split("T")[0], // Formato YYYY-MM-DD
      modelo: this.modelo,
      serial: this.serial,
      // Expandir VOs
      especificaciones: {
        ram: this.especificaciones.ram,
        tipoAlmacenamiento: this.especificaciones.tipoAlmacenamiento,
        capacidadAlmacenamiento: this.especificaciones.capacidadAlmacenamiento,
        sistemaOperativo: this.especificaciones.sistemaOperativo,
        versionOffice: this.especificaciones.versionOffice,
      },
      garantia: {
        tieneGarantia: this.garantia.tieneGarantia,
        duracionGarantia: this.garantia.duracionGarantia,
      },
      tieneTeclado: this.tieneTeclado,
      tieneMouse: this.tieneMouse,
      marcaMonitor: this.marcaMonitor,
      modeloMonitor: this.modeloMonitor,
      responsable: this.responsable,
      entregado: this.entregado,
      estado: this.estado,
      estado: this.estado,
      motivoBaja: this.motivoBaja,
      fechaBaja: this.fechaBaja ? this.fechaBaja.toISOString().split('T')[0] : null,
  
    };
  }

  // --- Posibles Métodos de Comportamiento ---
  // marcarComoEntregado(responsable) { ... }
  // cambiarUbicacion(nuevaUbicacionId) { ... }
  // darDeBaja() { this.estado = 'BAJA'; }
}

module.exports = Equipo;
