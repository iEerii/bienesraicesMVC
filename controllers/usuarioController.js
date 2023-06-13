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
    //Extraer los datos
    const {nombre, email, password} = request.body
    //Validacion
    await check('nombre').notEmpty().withMessage('¡El nombre es obligatorio!').run(request)
    await check('email').isEmail().withMessage('¡Eso no parece un email!').run(request)
    await check('password').isLength({min:6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(request)
    await check('repetir_password').equals(password).withMessage('Las contraseñas no coinciden').run(request)
   
    let resultado = validationResult(request)
    
    //Verificar que el resultado este vacío
    if(!resultado.isEmpty()) {
        //errores
        return response.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: request.body.nombre,
                email:request.body.email
            }
        })
    }

    //Verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne({where : {email} })
    if (existeUsuario) {
        return response.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{msg: 'El Usuario ya está Registrado'}],
            usuario: {
                nombre: request.body.nombre,
                email:request.body.email
            }
        })
    }
    console.log(existeUsuario)
    return;
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