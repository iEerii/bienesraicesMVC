//const express = require('express'); common form
import express from 'express'; //nueva forma ecm module
import usuarioRoutes from './routes/usuarioRoutes.js'

//crear la app
const app = express();

//Habilitar pug
app.set('view engine', 'pug');
app.set('views', './views');

//Carpeta pública
app.use(express.static('public'));

//Routing
app.use('/auth', usuarioRoutes);

//Definir un puerto y arrancar el proyecto
const port = 8080;
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});