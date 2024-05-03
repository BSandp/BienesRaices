import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import db from './config/db.js';
//crear app
const app = express();



///habilitar lectura de datos de formulario
app.use(express.urlencoded({extended: true}));


///habilitar cookieparser
app.use(cookieParser());

//habilitar protección csfr
app.use(csrf({cookie: true}));

//conexion base de datos
try {
    await db.authenticate();
    db.sync();
    console.log('Conectado a la base de datos');
}catch(e) {
    console.error('No se pudo conectar a la base de datos', e);
}

//routing
app.use('/auth', usuarioRoutes)
app.use('/', propiedadesRoutes)


//habilitat pug

app.set('view engine', 'pug');
app.set('views', './vista');

//carpeta public
app.use(express.static('public'))

//definir un puerto y arrancar el proyecto

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`El servidor esta corriendo en el puerto ${port}`);
});

