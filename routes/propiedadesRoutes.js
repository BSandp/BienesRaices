import express  from "express";
import {body} from 'express-validator'
import {protegerRuta} from '../middleware/protegerRuta.js';

import {admin, crear,guardar ,agregarImagen}from '../controlador/propiedadControlador.js'


const router=express.Router()

router.get('/propiedades', protegerRuta, admin)
router.get('/propiedades/crear', protegerRuta,crear)
router.post('/propiedades/crear', protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripcion es obligatorio').isLength({max: 150 }).withMessage('La descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Seleccione una categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precio'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamientos'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').isNumeric().withMessage('Ubica la propiedad en el mapa'),

    guardar
)

router.get('/propiedades/agregar-imagen/:id', agregarImagen)





export default router