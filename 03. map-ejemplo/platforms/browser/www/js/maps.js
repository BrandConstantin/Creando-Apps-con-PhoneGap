var app = {
  inicio: function(){
    this.iniciaFastClick();
  },

  iniciaFastClick: function () {
    FastClick.attach(document.body);
  },
  
  dispositivoListo: function(){
	  //getCurrentPosition el método para saber la localización
	  navigator.geolocation.getCurrentPosition(app.dibujaCoordenadas, app.errorAlSolicitarLocalizacion);
  },
  
  dibujaCoordenadas: function(position){
	  //para dibujar longitud y latitude en la pantalla
	  var coordsDiv = document.querySelector('#coords');
	  coordsDiv.innerHTML = 'Latitud: ' + position.coords.latitude + 
							' Longitud: ' + position.coords.longitude;
		
		//utilizamos la libreria leafet representada por L
		var miMapa = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13); 
		
		L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJhbmRjb25zdGFudGluIiwiYSI6ImNqMnZzejVzNjAwNXUzMm16Zjd6cWttMGgifQ.JGHR7LGbFyJ9F45gE2MDUA', {
		  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		  maxZoom: 18
		}).addTo(miMapa);
		
		//function que toma latitud y longitud en un array, un texto, y referencia en nuesto mapa
		app.pintaMarcador([position.coords.latitude, position.coords.longitude], 'Aqui estoy!', miMapa);
		
		//el navegador le pasa un evento con la info de longitud y latitud
		miMapa.on('click', function(evento){
			//función javaScript toFixed que solo pasa 2 decimales del número 
			var texto = 'Marcador en l (' + evento.latlng.lat.toFixed(2) + ') ' +
					' y L(' + evento.latlng.lng.toFixed(2) + ')';
			app.pintaMarcador(evento.latlng, texto, miMapa);
		});
  },
  
  pintaMarcador: function(latlng, texto, mapa){
	  //L.marker crea un marcador en la latitud y longitud que hemos indicado
	  var marcador = L.marker(latlng).addTo(mapa);
	  
	  //una ventanita que recoje y luego con open abre el texto que hemos pasado en array
	  marcador.bindPopup(texto).openPopup();
  },
  
  errorAlSolicitarLocalizacion: function(error){
	  console.log(error.code + ' : ' + error.message);
  }
};

if ('addEventListener' in document) {
	//DOMContentLoaded significa que se han cargado todos los elementos de la página
    document.addEventListener('DOMContentLoaded', function() {
        app.inicio();
    }, false);
	
	//deviceready significa que el dispositivo esta listo para utilizar la function de localización
	document.addEventListener('deviceready', function() {
        app.dispositivoListo();
    }, false);
}

