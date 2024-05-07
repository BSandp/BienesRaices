(function() {
    const lat = 4.6452112;
    const lng = -74.0823946;
    const mapa = L.map('mapa').setView([lat, lng ], 13);
    let marker;

    //usar provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


// agregamos el pin del mapa

    marker = L.marker([lat, lng] ,{
        draggable: true,
        autoPan: true
    })
    .addTo(mapa);


//capturar la ubicaicon del pin del mapa
    marker.on('moveend', function(evento){
        marker = evento.target;
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))
    // obtener info de las calles al soltar el pin 


        geocodeService.reverse().latlng(posicion, 13).run(function(error, result){
            console.log(result)

            marker.bindPopup(result.address.LongLabel)


            //llenar los campos con la información de la ubiaccion

            document.querySelector('.calle').textContent = result.address?.Address ?? "";
            document.querySelector('#calle').value = result.address?.Address ?? "";
            document.querySelector('#lat').value = result.latlng?.lat ?? "";
            document.querySelector('#lng').value = result.latlng?.lng ?? "";
        })
    })


})()