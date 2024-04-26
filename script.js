const mymap = L.map('sample_map').setView([40.416729, -3.703339], 15);
var marcador = null;
var position = null;
var polyline = null;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">',
  maxZoom: 18
}).addTo(mymap);

mymap.on('click', function(e) {
  if (!marcador) {
    // Crea un nuevo marcador y añadelo en el mapa
    marcador = L.marker(e.latlng).addTo(mymap);
  } else {
    // QUita el marcador antiguo y pone uno nuevo
    mymap.removeLayer(marcador);
    marcador = L.marker(e.latlng).addTo(mymap);
  }
  // actualiza el marcador en el mapa
  marcador.setLatLng(e.latlng);

  // comprueba la distancia entre la ubicación actual y el punto de clic
  if (position && navigator.vibrate) {
    if (e.latlng.distanceTo([position.coords.latitude, position.coords.longitude]) < 250) {
      // actualiza la posición
      position.coords.latitude = e.latlng.lat;
      position.coords.longitude = e.latlng.lng;

      navigator.vibrate(4000);
      // espera dos segundos antes de mostrar la alerta
      setTimeout(function() {
        alert("Has llegado a tu destino");
      }, 1000);
    }
  } else {
    // el navegador no es compatible con la vibración, comprobar distancia y mostrar alerta si es menor a 100 metros
    if (position && e.latlng.distanceTo([position.coords.latitude, position.coords.longitude]) < 250) {
      // espera dos segundos antes de mostrar la alerta
      setTimeout(function() {
        alert("Has llegado a tu destino");
      }, 1000);
    } else {
      alert("Estás a más de 100 metros de tu destino.");
    }
  }

  // dibuja una línea entre la ubicación actual y el marcador
  if (position && polyline) {
    mymap.removeLayer(polyline);
  }
  polyline = L.polyline([[position.coords.latitude, position.coords.longitude], [e.latlng.lat, e.latlng.lng]], { color: 'red' }).addTo(mymap);
});

//Mi ubicación
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(function(pos) {
    var latlng = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
    // borra el puntero anterior si existe
    if (position) {
      mymap.removeLayer(position.marker);
    }
    position = pos;
    position.marker = L.marker(latlng).addTo(mymap);
    mymap.panTo(latlng);
    // dibuja una línea entre la ubicación actual y el marcador
    if (marcador && polyline) {
      mymap.removeLayer(polyline);
    }
    if (marcador) {
      polyline = L.polyline([[pos.coords.latitude, pos.coords.longitude], [marcador.getLatLng().lat, marcador.getLatLng().lng]], { color: 'red' }).addTo(mymap);
    }
  });
}