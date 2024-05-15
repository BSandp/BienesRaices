import  jwt  from "jsonwebtoken"
import {Usuario} from '../modelos/relaciones.js'

const protegerRuta= async (req, res, next) => {
    //verificar si hay token JWT
    const {_token} = req.cookies
    if(!_token) return res.redirect('/auth/login')
    //comprobar el token

    try {
        const decoded = jwt.verify(_token,process.env.JWT_SECRETA)
        const usuario=await Usuario.scope("eliminarInformacion").findByPk(decoded.id)

        if(usuario){
            req.usuario = usuario;
        }else{
            return res.redirect('/auth/login')
        }
        return next();
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }
}

export {
    protegerRuta
}
