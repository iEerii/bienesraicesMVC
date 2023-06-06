const formularioLogin = (require, response) => {
    response.render('auth/login', {
        pagina: "Iniciar Sesión"
    })
}

const formularioRegistro = (require, response) => {
    response.render('auth/registro', {
        pagina: 'Crear Cuenta'
    })
}

const formularioOlvidePassword = (require, response) => {
    response.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword
}