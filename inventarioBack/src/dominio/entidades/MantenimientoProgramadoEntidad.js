import { EntitySchema } from "typeorm";

const MantenimientoProgramadoEntidad = new EntitySchema({
  name: "MantenimientoProgramado",
  tableName: "mantenimientos_programados",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    fechaProgramada: {
      type: "timestamp",
      nullable: false,
    },
    descripcion: {
      type: "text",
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 50,
      nullable: false,
      default: "Pendiente",
    },
    idEquipo: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    equipo: {
      type: "many-to-one",
      target: "Equipo",
      joinColumn: { name: "idEquipo" },
      onDelete: "CASCADE",
    },
  },
});

export default MantenimientoProgramadoEntidad;
