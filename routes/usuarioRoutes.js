import express from "express";

const router = express.Router();

router.get('/', function(require, response) {
    response.send('Hola mundo en express')
});

router.get('/nosotros', function(require, response) {
    response.send('Quienes somos')
});

export default router;