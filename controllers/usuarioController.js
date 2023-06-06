const formularioLogin = (require, response) => {
    response.render('auth/login', {

    })
}

const formularioRegistro = (require, response) => {
    response.render('auth/registro', {
        pagina: 'Crear Cuenta'
    })
}

export {
    formularioLogin,
    formularioRegistro
}