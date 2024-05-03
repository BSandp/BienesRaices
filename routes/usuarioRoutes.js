import express from 'express';
import { formularioLogin, autenticar, formularioRegistro, formularioOlvideContraseña,registrar,comprobar, resetPassword, comprobarToken, nuevoPassword} from '../controlador/usuarioControlador.js';

const router= express.Router();

router.get('/login', formularioLogin)
router.post('/login', autenticar)

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)

router.get('/olvide-password', formularioOlvideContraseña)
router.post('/olvide-password', resetPassword)

router.get('/confirmar/:token', comprobar)


//almacenar y guardar contraseña
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)





export default router;