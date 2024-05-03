import jwt  from 'jsonwebtoken';






const generarJWT = id=>jwt.sign({id}, process.env.JWT_SECRETA, {expiresIn: '1d'});  

const generarId= () => Math.random().toString(32).substring(2) + Date.now().toString(32) ;



export {
    generarId,
    generarJWT
}