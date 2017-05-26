var app = {
  inicio: function() {
    this.iniciaFastClick();

  },

  iniciaFastClick: function () {
    FastClick.attach(document.body);
  },

  dispositivoListo: function(){
    navigator.geolocation.getCurrentPosition(app.pintaCoordenadasEnMapa, app.errorAlSolicitarLocalizacion);
	//para ver posición exacta aunque estemos en movimiento
	navigator.geolocation.watchPosition(app.pintaCoordenadasEnMapa, app.errorAlSolicitarLocalizacion, { timeout: 30000 });
  },

  pintaCoordenadasEnMapa: function(position){
    var miMapa = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);
	
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJhbmRjb25zdGFudGluIiwiYSI6ImNqMnZzejVzNjAwNXUzMm16Zjd6cWttMGgifQ.JGHR7LGbFyJ9F45gE2MDUA', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(miMapa);

    app.pintaMarcador([position.coords.latitude, position.coords.longitude], '¡Estoy aquí!', miMapa);

    miMapa.on('click', function(evento){
      var texto = 'Marcador en l(' + evento.latlng.lat.toFixed(2) + ') y L(' + evento.latlng.lng.toFixed(2) + ')';
      app.pintaMarcador(evento.latlng, texto, miMapa);
    });
	
	//dibujar circulo
	var circle = L.circle([36.70, -4.44], {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5,
		radius: 500
	}).addTo(miMapa);
	
	//icono diferente para el usuario
	/*var greenIcon = L.icon({
		iconUrl: '../img/icon1.png',
		shadowUrl: '../img/icon2.png',

		iconSize:     [38, 95], // size of the icon
		shadowSize:   [50, 64], // size of the shadow
		iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
		shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
	});*/	
  },

  pintaMarcador: function(latlng, texto, mapa){
    var marcador = L.marker(latlng).addTo(mapa);
	
	//la practica 
	var marcador = L.marker([36.70, -4.44]).addTo(mapa);
	//dibujar los iconos
	//var marcador = L.marker([36.70, -4.44], {icon: greenIcon}).addTo(mapa);
	
    marcador.bindPopup(texto).openPopup();
  },

  errorAlSolicitarLocalizacion: function(error){
    console.log(error.code + ': ' + error.message);
  }

};

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    app.inicio();
  }, false);
  document.addEventListener('deviceready', function() {
    app.dispositivoListo();
  }, false);
}
