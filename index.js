import express from 'express';
import csrf from 'csurf';
import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadesRoutes from './routes/propiedadesRoutes.js';
import db from './config/db.js'
import cookieParser from 'cookie-parser';

//crear la app
const app = express();

//Habilitar lectura de datos de formulario
app.use ( express.urlencoded({extended: true}) )

//Habilitar cookieParser
app.use(cookieParser())

//Habilitar CSRF
app.use(csrf({cookie: true}))

//Conexion a la bd
try {
    await db.authenticate();
    db.sync()
    console.log('Conexion correcta a la base de datos')
} catch(error){
    console.log(error)
}

//Habilitar pug
app.set('view engine', 'pug');
app.set('views', './views');

//Carpeta pública
app.use(express.static('public'));

//Routing
app.use('/auth', usuarioRoutes);
app.use('/', propiedadesRoutes);

//Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});