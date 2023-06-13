import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';
import db from './config/db.js'

//crear la app
const app = express();

//Habilitar lectura de datos de formulario
app.use ( express.urlencoded({extended: true}) )

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

//Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});