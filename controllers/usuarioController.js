import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'

const formularioLogin = (request, response) => {
    response.render('auth/login', {
        pagina: "Iniciar Sesión"
    })
}

const formularioRegistro = (request, response) => {
    response.render('auth/registro', {
        pagina: 'Crear Cuenta'
    })
}

const registrar = async (request, response) => {
    //Validacion
    await check('nombre').notEmpty().withMessage('¡El nombre es obligatorio!').run(request)

    let resultado = validationResult(request)
    response.json(resultado.array());

    const usuario = await Usuario.create(request.body)
    response.json(usuario)
}

const formularioOlvidePassword = (request, response) => {
    response.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
}