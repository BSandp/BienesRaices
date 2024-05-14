import Propiedad from './Propiedad.js';
import Categoria from './Categoria.js';
import Precio from './Precio.js';
import Usuario from './Usuario.js';


Propiedad.belongsTo(Precio,{foreignKey: 'PrecioId'});
Propiedad.belongsTo(Categoria,{foreignKey: 'CategoriaId'});
Propiedad.belongsTo(Usuario,{foreignKey: 'UsuarioId'});




export{
    Propiedad,
    Categoria,
    Precio,
    Usuario
}