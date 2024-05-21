
import { validationResult } from 'express-validator';

import {Categoria, Precio, Propiedad} from '../modelos/relaciones.js';


const admin =(req,res)=>{
    res.render('propiedades/admin',{
    pagina:'Mis propiedades',
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
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {}
})
}
const guardar = async (req,res)=>{

///validacion
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        const [categorias, precios]= await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
        res.render('propiedades/crear',{
            pagina:'Crear propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
            
        }
    )}

    //crear un registro
    const {titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio:PrecioId, categoria:CategoriaId, } = req.body;
    const {id: UsuarioId} = req.usuario;
    try {
        const propiedadGuardada= await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat, 
            lng,
            PrecioId,
            CategoriaId,
            UsuarioId,
            imagen: ''
        })

        const {id}= propiedadGuardada;
        res.redirect(`/propiedades/agregar-imagen/${id}`)

        
    } catch (error) {
        console.log(error)
    }

}

const agregarImagen= async (req, res) => {
    const {id}=req.params;



    ///validar que la propiedad exista
    const propiedad = await  Propiedad.findByPk(id);

    if(!propiedad){ 
        return res.redirect('/propiedades')
}

    //validar que la propiedad no este publicada
    
    if(propiedad.publicado) { 
        return res.redirect('/propiedades')
}
    // /validar que propiedad pertenezca a quien visita la pagina
//     if (req.usuario.id !== propiedad.usuarioId){ 
//         return res.redirect('/mis-propiedades')
// }
// console.log(propiedad)


    res.render('propiedades/agregar-imagen',{
    pagina:`Agregar Imagen: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    propiedad
})
}



export {
     admin,
     crear,
     guardar,
     agregarImagen
    }
