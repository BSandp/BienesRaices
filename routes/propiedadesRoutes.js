import express  from "express";

import {admin, crear }from '../controlador/propiedadControlador.js'


const router=express.Router()

router.get('/propiedades', admin)
router.get('/propiedades/crear', crear)




export default router