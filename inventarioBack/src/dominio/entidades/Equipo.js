// src/dominio/entidades/Equipo.js

const EspecificacionesEquipo = require('./EspecificacionesEquipo');
const GarantiaEquipo = require('./GarantiaEquipo');
// Podrías importar tipos/enums si los defines, ej. para estado

/**
 * Representa la entidad Equipo dentro del dominio de negocio.
 */
class Equipo {
    /**
     * @param {string | null} id - Identificador único (null si es nuevo).
     * @param {string} placa - Identificador físico/etiqueta del equipo.
     * @param {string} tipoEquipoId - ID o clave del tipo de equipo (ej. 'COMPUTADOR', 'IMPRESORA').
     * @param {string} marcaId - ID o clave de la marca.
     * @param {string} ubicacionId - ID o clave de la ubicación.
     * @param {Date} fechaAdquisicion - Fecha de compra o ingreso.
     * @param {string | null} modelo - Modelo específico del equipo.
     * @param {string | null} serial - Número de serie del fabricante.
     * @param {EspecificacionesEquipo} especificaciones - VO con detalles técnicos.
     * @param {GarantiaEquipo} garantia - VO con información de garantía.
     * @param {boolean} tieneTeclado - Indica si incluye teclado.
     * @param {boolean} tieneMouse - Indica si incluye mouse.
     * @param {string | null} marcaMonitor - Marca del monitor asociado (si aplica).
     * @param {string | null} modeloMonitor - Modelo del monitor asociado (si aplica).
     * @param {string | null} responsable - Nombre de la persona asignada.
     * @param {boolean} entregado - Indica si el equipo ha sido entregado al responsable.
     * @param {string} [estado='ACTIVO'] - Estado actual del equipo (ej. 'ACTIVO', 'BAJA', 'MANTENIMIENTO').
     */
    constructor(
        id,
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
        estado = 'ACTIVO' // Valor por defecto para el estado
    ) {
        // Validaciones básicas de campos requeridos
        if (!placa || !tipoEquipoId || !marcaId || !ubicacionId || !fechaAdquisicion) {
            throw new Error("Faltan datos esenciales (placa, tipo, marca, ubicación, fecha adquisición) para crear la entidad Equipo.");
        }
        if (!(especificaciones instanceof EspecificacionesEquipo)) {
             throw new Error("Se requiere una instancia válida de EspecificacionesEquipo.");
        }
         if (!(garantia instanceof GarantiaEquipo)) {
             throw new Error("Se requiere una instancia válida de GarantiaEquipo.");
        }

        this.id = id;
        this.placa = placa;
        this.tipoEquipoId = tipoEquipoId;
        this.marcaId = marcaId;
        this.ubicacionId = ubicacionId;
        this.fechaAdquisicion = fechaAdquisicion instanceof Date ? fechaAdquisicion : new Date(fechaAdquisicion);
        this.modelo = modelo ?? null;
        this.serial = serial ?? null;
        this.especificaciones = especificaciones; // Instancia de EspecificacionesEquipo
        this.garantia = garantia; // Instancia de GarantiaEquipo
        this.tieneTeclado = !!tieneTeclado; // Asegura booleano
        this.tieneMouse = !!tieneMouse; // Asegura booleano
        this.marcaMonitor = marcaMonitor ?? null;
        this.modeloMonitor = modeloMonitor ?? null;
        this.responsable = responsable ?? null;
        this.entregado = !!entregado; // Asegura booleano
        this.estado = estado;
    }

    /**
     * Método estático (fábrica) para crear una nueva instancia de Equipo.
     * Útil para encapsular lógica como generación de ID o creación de VOs.
     * @param {object} datos - Datos del formulario o API.
     * @param {object} servicios - Servicios externos necesarios (inyectados).
     * @param {function} servicios.generarId - Función para crear un ID único (ej. UUID).
     * @returns {Equipo} Una nueva instancia de Equipo.
     */
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
            datos.garantia === 'si', // Convertir 'si'/'no' a booleano
            datos.tiempo_garantia
        );

        // Asegurarse que la fecha sea un objeto Date
        const fechaAdquisicion = datos.fecha_adquisicion ? new Date(datos.fecha_adquisicion) : new Date();

        return new Equipo(
            id,
            datos.placa,
            datos.tipoEquipo, // Asume que el valor del select es el ID/clave
            datos.marca,      // Asume que el valor del select es el ID/clave
            datos.ubicacion,  // Asume que el valor del select es el ID/clave
            fechaAdquisicion,
            datos.modelo,
            datos.serial,
            especificaciones,
            garantia,
            datos.teclado === 'si', // Convertir 'si'/'no' a booleano
            datos.mouse === 'si',   // Convertir 'si'/'no' a booleano
            datos.monitor, // Asume que el valor del select es la marca/ID
            datos.modelo_monitor,
            datos.responsable,
            datos.entregado === 'si' // Convertir 'si'/'no' a booleano
            // Se puede añadir estado inicial si es necesario
        );
    }

    /**
     * Devuelve una representación simple del objeto para API/transferencia.
     * @returns {object} Objeto plano con los datos del equipo.
     */
    toPlainObject() {
        return {
            id: this.id,
            placa: this.placa,
            tipoEquipoId: this.tipoEquipoId,
            marcaId: this.marcaId,
            ubicacionId: this.ubicacionId,
            fechaAdquisicion: this.fechaAdquisicion.toISOString().split('T')[0], // Formato YYYY-MM-DD
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
        };
    }

    // --- Posibles Métodos de Comportamiento ---
    // marcarComoEntregado(responsable) { ... }
    // cambiarUbicacion(nuevaUbicacionId) { ... }
    // darDeBaja() { this.estado = 'BAJA'; }
}

module.exports = Equipo;
