var app = {
	inicio: function(){
		this.iniciaBotones();
		this.iniciaFastClick();
		this.iniciaHammer();
	},
	
	iniciaFastClick: function(){
		FastClick.attach(document.body);
	},
	
	iniciaBotones: function(){		
		var botonClaro = document.querySelector('#claro');
		var botonOscuro = document.querySelector('#oscuro');
		
		botonClaro.addEventListener('click', this.cambiarClaro, false);
		botonOscuro.addEventListener('click', this.cambiarOscuro, false);
	},
	
	iniciaHammer: function(){
		//le decimos en que zona va ha actuar hammer.js
		var zona = document.getElementById('zonaGestos');
		//inicializamos hammer en una variable hammertime
		var hammertime = new Hammer(zona);
		
		//por defecto no inicializa pinch y rotate
		//para esto lo activamos nosotros
		hammertime.get('pinch').set({enable: true});
		hammertime.get('rotate').set({enable: true});
		
		/*
		//le decimos que va ha pasar cuando recoje una de las eventos hammertime
		//ponemos todos los eventos que nos interesa
		hammertime.on('tap doubletap pan swipe press pinch rotate', function(ev){
			//le damos la funcion que la va ha manejar
			//hacemos que el texto se muestre, mostrando el tipo de evento
			document.querySelector('#info').innerHTML = ev.type + '!';
		});
		*/
		
		//detectamos el final de la animación para que le ponga el nombre a la clase vacia
		//asi cuando pulsamos volvera a producirse la animación sino se produciria 1 sola vez
		zona.addEventListener('webkitAnimationEnd', function(e){
			zona.className = '';
		});
		
		hammertime.on('doubletap', function(ev){
			zona.className = 'doubletap';
		});
		
		hammertime.on('press', function(ev){
			zona.className = 'press';
		});
				
		hammertime.on('swipe', function(ev){
			var clase = undefined;
			direccion = ev.direction;
			
			if(direccion == 4){
				clase = 'swipe-derecha';
			};
			
			if(direccion == 2){
				clase = 'swipe-izquierda';
			};
			
			zona.className = clase;
		});
		
		hammertime.on('rotate', function(ev){
			//para que la rotación no empieza nada más que pulsar dos dedos
			//y que no de vuelta continuamente sin parar
			var umbral = 25;
			
			if(ev.distance > umbral){
				zona.className = 'rotate';
			}
		});
	},
	
	cambiarClaro: function(){
		document.body.className = 'claro';
	},
	
	cambiarOscuro: function(){
		document.body.className = 'oscuro';
	},
};

//app.inicio();

//no me funciona 
//para que el boton al hacer click responda más rápido
if('addEventListener' in document){
	document.addEventListener('DOMContentLoaded', function(){
		//FastClick.attach(document.body);
		app.inicio();
	}, false);
}