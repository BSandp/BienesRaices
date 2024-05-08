import {DataTypes} from 'sequelize'

import db from '../config/db.js'


const Categoria= db.define('Categorias',{
    nombre:{
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    }

})

export default Categoria;