import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { generarId,generarJWT } from '../helpers/tokens.js';
import {emailRegistro, olvidePassword} from '../helpers/emails.js';

import Usuario from '../modelos/Usuario.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()

    })
}


const autenticar = async (req, res) => {

    await check("email").isEmail().withMessage('validar el email').run(req)
    await check("password").notEmpty().withMessage('contraseña invalida').run(req)


    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }
    const {email, password} = req.body;

    const usuario = await Usuario.findOne({where:{email}})
    if (!usuario) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: "el usuario no existe"}]
        })
    }

    // comprobar usuario confirmado

    if(!usuario.confirmado){

        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg:"el usuario no ha sido verificado"}]
        })
    }
    // comprobar contraseña


    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg:"La contraseña es invalida"}]
        })
    }
    //AUTENTICAR USUARIO

    const token=generarJWT(usuario.id)

    //habilitar en coockie

    return res.cookie('_token',token,{
        httpOnly:true,
        //secure:true
    }).redirect('/propiedades')
 
}




const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}
const registrar = async (req, res) => {
    // validación de datos
    await check("nombre").notEmpty().withMessage('el nombre es obligatorio').run(req)
    await check("email").isEmail().withMessage('validar el email').run(req)
    await check("password").isLength({ min: 6 }).withMessage('la contraseña es obligatoria y debe tener minimo 6 caracteres').run(req)
    await check("repetir_password").equals(req.body.password).withMessage('las contraseñas deben ser iguales').run(req)


    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }

    //extraer los datos del req.body
    const { nombre, email, password } = req.body;

    //verificar usuario duplicado

    const existeUser = await Usuario.findOne({ where: { email } })

    if (existeUser) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'el usuario ya esta registrado' }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
                // password: req.body.password
            }
        })
    }
    //almacenar usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })



    //enviar email de confirmation
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })




    /// mensaje de confirmación
    res.render('templates/mensajes', {
        pagina:'Cuenta creada correctamente',
        mensaje: 'Se ha enviado un correo para la autentificación de la cuenta, presiona en el enlace',
        // tipo:'success',

    })


}


//confirmar cuenta
const comprobar =async (req, res) => {
    const {token} = req.params;
    //VERIFICAR SI EL TOKEN ES VALIDO
    const usuario= await Usuario.findOne({where:{token}});
    if(!usuario){
        return res.render('auth/confirmar-cuenta',{
            pagina: 'Error al Confirmar cuenta',
            mensaje: 'hubo un error al confirmar tu cuenta, itenta denuevo',
            error: true
        })
    }
    //CONFIRRMAR CUENTA
    
    usuario.token= null;  
    usuario.confirmado = true;
    await usuario.save();
    

    res.render('auth/confirmar-cuenta',{
        pagina: 'Cuenta confirmada',
        mensaje: 'la cuenta se confirmo correctamente'
    })
}


const formularioOlvideContraseña = (req, res) => {
    res.render('auth/olvide-password', {
        csrfToken: req.csrfToken(),
        pagina: 'Recuperar Contraseña'
    })
}
const resetPassword = async (req, res) => {

   // validación de datos
    await check("email").isEmail().withMessage('validar el email').run(req)

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/olvide-password', {
            csrfToken: req.csrfToken(),
            pagina: 'Recuperar contraseña',
            errores: resultado.array(),
        })
    }

    //buscar usuario por id
    const {email} = req.body;
    const usuario = await Usuario.findOne({where:{email}});


    if(!usuario){
        return res.render('auth/olvide-password', {
            csrfToken: req.csrfToken(),
            pagina: 'Recuperar contraseña',
            errores: [{ msg: 'el usuario no existe' }],
        })
    }

    //generar un token y enviar un email
    usuario.token = generarId();
    await usuario.save();

    //enviar email
    olvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    //renderizar el mensaje

    res.render('templates/mensajes', {
        pagina:'Reestablecer tu contraseña',
        mensaje: 'hemos enviado un correo con las instrucciones',
        // tipo:'success',

    })

}



const comprobarToken = async (req, res) =>{


    const {token}= req.params;

    const usuario = await Usuario.findOne({where: {token}})

    if(!usuario){
        res.render('auth/confirmar-cuenta',{
            pagina: 'restablece tu password',
            mensaje: 'hubo un error al validartu información, intenta denuevo',
            error: true
        })
    }

    //mostrar formulario para el cambio

    res.render('auth/reset-password',{
        pagina: 'restablece tu password',
        csrfToken: req.csrfToken(),
        
    })

}

const nuevoPassword= async(req,res)=>{
    await check("password").isLength({ min: 6 }).withMessage('la contraseña es obligatoria y debe tener minimo 6 caracteres').run(req)
    await check("repetir_password").equals(req.body.password).withMessage('las contraseñas deben ser iguales').run(req)

    
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        return res.render('auth/reset-password', {
            csrfToken: req.csrfToken(),
            pagina: 'restablece tu password',
            errores: resultado.array(),
        })
    }


    const {token} = req.params;
    const {password} = req.body;
    //identificar el usuario deñl cambio

    const usuario = await Usuario.findOne({where: {token}})
    //hashear la nueva password
    const salt= await bcrypt.genSalt(10)
    usuario.password= await bcrypt.hash(password, salt);
    usuario.token= null;
    await usuario.save();

    res.render('auth/confirmar-cuenta',{
        pagina: 'password Reestablecido',
        mensaje: 'Se ha realizado el cambio',
    })

}



export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    comprobar,
    resetPassword,
    formularioOlvideContraseña,
    nuevoPassword,
    comprobarToken
    
}