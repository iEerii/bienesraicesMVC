import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'
import { generarId } from '../helpers/tokens.js'
import { emailRegistro } from '../helpers/emails.js'
import { response } from 'express'

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
                email: request.body.email
            }
        })
    }

    //Almacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //Enviar mensaje de confirmación
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //Mostrar mensaje de confirmación
    response.render('templates/mensaje', {
        pagina: 'Cuenta Creada Exitosamente',
        mensaje: 'Hemos Enviado un Email de Confirmación. Presiona en el enlace'
    })
}

//Funcion que compureba una cuenta
const confirmar = (request, response) => {
    const { token } = request.params;
    console.log( token );
   
    //Verificar si el token es válido

    //Confirmar la cuenta
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
    confirmar,
    formularioOlvidePassword
}