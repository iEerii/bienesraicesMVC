import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import { generarId } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'

const formularioLogin = (request, response) => {
    response.render('auth/login', {
        pagina: "Iniciar Sesión",
        csrfToken: request.csrfToken()
    })
}

const autenticar = async(request, response) => {
    //Validacion
    await check('email').isEmail().withMessage('El email es obligatorio').run(request)
    await check('password').notEmpty().withMessage('El password es obligatorio').run(request)

    let resultado = validationResult(request)
    
    //Verificar que el resultado este vacío
    if(!resultado.isEmpty()) {
        //errores
        return response.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: request.csrfToken(),
            errores: resultado.array()
        })
    }
}

const formularioRegistro = (request, response) => {
    response.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: request.csrfToken()
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
            csrfToken: request.csrfToken(),
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
            csrfToken: request.csrfToken(),
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
const confirmar = async (request, response) => {
    const { token } = request.params;
   
    //Verificar si el token es válido
    const usuario = await Usuario.findOne({where: {token}})
    
    if(!usuario){
        return response.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confimar tu cuenta, intenta de nuevo',
            error: true
        })
    }

    //Confirmar la cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    response.render('auth/confirmar-cuenta', {
            pagina: 'Cuenta confirmada',
            mensaje: 'La cuenta se confirmó existosamente',
        })
}

const formularioOlvidePassword = (request, response) => {
    response.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices',
        csrfToken: request.csrfToken()
    })
}

const resetPassword = async(request, response) => {
   //Validacion
    await check('email').isEmail().withMessage('¡Eso no parece un email!').run(request)
   
    let resultado = validationResult(request)
    //Verificar que el resultado este vacío
    if(!resultado.isEmpty()) {
        return response.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: request.csrfToken(),
            errores: resultado.array()
        })
    }

    //Buscar al usuario
    const {email} = request.body

    const usuario = await Usuario.findOne({where: {email}})
    if(!usuario){
        return response.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: request.csrfToken(),
            errores: [{msg:'El email no pertenece a ningun usuario'}]
        })
    }

    //Generar un token y enviar el email
    usuario.token = generarId();
    await usuario.save();

    //Envia un email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    //Renderizar un mensaje
    response.render('templates/mensaje', {
        pagina: 'Reestablece tu password',
        mensaje: 'Hemos Enviado un Email con las instrucciones. Presiona en el enlace'
    })
}

const comprobarToken = async(request, response) => {
    const {token} = request.params;

    const usuario = await Usuario.findOne({where: {token}})
    if(!usuario){
        return response.render('auth/confirmar-cuenta', {
            pagina: 'Reestablece tu Password',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        })
    }

    //Mostrar formulario para modificar password
    response.render('auth/reset-password', {
        pagina: 'Reestablece tu password',
        csrfToken: request.csrfToken()
    })

}

const nuevoPassword = async (request, response) => {
    //Validando password
    await check('password').isLength({min:6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(request)

    let resultado = validationResult(request)
    
    //Verificar que el resultado este vacío
    if(!resultado.isEmpty()) {
        //errores
        return response.render('auth/reset-password', {
            pagina: 'Reestablece tu Password',
            csrfToken: request.csrfToken(),
            errores: resultado.array()
        })
    }

    const {token} = request.params;
    const {password} = request.body;

    //Identificar quien hace el cambio
    const usuario = await Usuario.findOnde({where: {token}})

    //Hashear
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;

    await usuario.save()

    response.render('auth/confirmar-cuenta', {
        pagina: 'Password Reestablecido',
        mensaje: 'El Password se guardó correctamente'
    })
}

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}