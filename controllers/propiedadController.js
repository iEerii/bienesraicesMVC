

const admin = (request, response) => {
    response.render('propiedades/admin', {
        pagina: 'Mis propiedades',
        barra: true
    })
}

//formulario para crear una nueva propiedad
const crear = (request, response) => {
    response.render('propiedades/crear', {
        pagina: 'Crear propiedad',
        barra: true
    })
}

export {
    admin,
    crear
}