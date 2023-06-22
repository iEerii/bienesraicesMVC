(function() {
    
    const lat = 34.0417856;
    const lng = -118.2623532;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //el pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)

    //Detectar el movimiento del pin 
    marker.on('moveend', function(){
        marker = e.target
        
        const posicion= marker.getLatLgn()

        mapa.panTo(new L.LatLng.lat, posicion.lng)
    })

})()