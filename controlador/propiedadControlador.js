import Precio from '../modelos/Precio.js';
import Categoria from '../modelos/Categoria.js';

const admin =(req,res)=>{
    res.render('propiedades/admin',{
    pagina:'Mis propiedades',
    barra:true
})}
//form crear propiedad

const crear = async (req,res)=>{
//consultar precios y categorias
    const [categorias, precios]= await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear',{
    pagina:'Crear propiedad',
    barra:true,
    categorias,
    precios
})
}


export {
     admin,
     crear
    }
