var app = {
	inicio: function(){
		function onError(){
			console.log('onError!');
		}
		
		//vamos a leer estos datos de acceleración con watchAcceleration cada 1s
		navigator.accelerometer.watchAcceleration(this.onSuccess, onError, {frequency: 1000});
	},
	
	onSuccess: function(datosAceleration){
		app.detectaAgitacion(datosAceleration);
		app.representaValores(datosAceleration);
	},
	
	detectaAgitacion: function(datosAceleration){
		var agitacionX = datosAceleration.x > 10;
		var agitacionY = datosAceleration.y > 10;
		
		if(agitacionX || agitacionY){
			document.body.className = 'agitado';
		}else{
			document.body.className = '';
		}
	},
	
	//recojemos los datos de acceleración x, y o z y lo representamos
	representaValores: function(datosAceleration){
		app.representa(datosAceleration.x, '#valorx');
		app.representa(datosAceleration.y, '#valory');
		app.representa(datosAceleration.z, '#valorz');
	},
	
	representa: function(dato, elementoHTML){
		redondeo = Math.round(dato * 100) / 100
		document.querySelector(elementoHTML).innerHTML = redondeo;
	}
};

if('addEventListener' in document){
	document.addEventListener('deviceready', function(){
		app.inicio();
	}, false);
}