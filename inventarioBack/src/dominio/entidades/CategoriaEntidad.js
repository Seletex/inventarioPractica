import { DataTypes } from "sequelize";
import { sequelize } from "../../database/database.js";
import { Producto } from "./ProductoEntidad.js";

export const Categoria = sequelize.define(
    "categorias",
    { id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre:{
        type: DataTypes.STRING,
    },
    descripcion:{
        type: DataTypes.STRING,
    },
    },
    
    {
        timestamps: false,
    }

    );


Categoria.hasMany(Equipo,{
    foreignKey: "categoriaId",
    sourceKey: "id",
});
Equipo.belongsTo(Categoria,{
    foreignKey: "categoriaId",
    targetId: "id",
});


