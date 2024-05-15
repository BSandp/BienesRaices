import categorias from "./categoriasSeed.js";
import usuarios from "./usuarios.js";
import db from "../config/db.js";
import precios from "./PreciosSeed.js";
import {Precio, Categoria, Usuario} from '../modelos/relaciones.js';



const importarDatos= async () => {

    try {

    /// auttenticar
         await db.authenticate();
         console.log('Conectado a la base de datos');
    //crear columnas
        await db.sync();
    // insertar datos
    await Promise.all([
         Categoria.bulkCreate(categorias),
         Precio.bulkCreate(precios),
         Usuario.bulkCreate(usuarios)
    ]);
        console.log('Datos insertados en la base de datos');
        process.exit(0);
    } catch (error) {

        console.log(error);
        process.exit(1);
    }

}

const EliminarDatos= async () => {

    try {


    // insertar datos
    // await Promise.all([
    //      Categoria.destroy({where:{}, truncate: true}),
    //      Precio.destroy({where:{}, truncate: true})
    // ]);

    await db.sync({force:true});
    console.log('Datos eliminados de la base de datos');
    process.exit();

    } catch (error) {

        console.log(error);
        process.exit(1);
    }

}

if (process.argv[2] === "-i"){
    importarDatos();
    
}
if (process.argv[2] === "-e"){
    EliminarDatos();
    
}