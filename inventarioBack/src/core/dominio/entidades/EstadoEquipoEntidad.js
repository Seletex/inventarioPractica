import { EntitySchema } from "typeorm";

const EstadoEquipoEntidad = new EntitySchema({
  name: "EstadoEquipo",
  tableName: "estado_equipo",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    nombre: {
      type: "varchar",
    },
  },
});

export default EstadoEquipoEntidad;
