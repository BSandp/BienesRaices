import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config ({path:'.env'})

const db = new Sequelize(process.env.BD_NOMBRE,process.env.BD_USER , process.env.BD_CONTRA,
{
    host: process.env.BD_HOST,
    port: 3307,
    dialect: "mysql",
    define:{
        timestamps: true
    },

    ///PARA RENDIMIENTO
    pool: {
        max: 5, //MAXIMO DE CONEXION
        min: 0,//MINIMO DE CONEXION
        acquire: 30000, //TIEMPO DE RESPUESTA ANTES DE SALIR ERROR
        idle: 10000 //SEGUNDOS PARA DESCONECTARSE SIN USO
    },
    operatorsAliases: false
});

export default db;