var app = {
	inicio: function(){
		//diametro 50 de
		DIAMETRO_BOLA = 50;
		dificultad = 0;
		puntuacion = 0;
		
		//ver el tamaño del dispositivo para que el juego se adapte a toda la pantalla
		alto = document.documentElement.clientHeight;
		ancho = document.documentElement.clientWidth;
		
		velocidadX = 0;
		velocidadY = 0;
		
		app.vigilaSensores();
		app.iniciaJuego();
	},

	iniciaJuego: function(){		
		//function para preparar las cosas
		function preload(){
			//arancamos en motor de phisica de Phaser
			//se utiliza par gravedad, rapidez etc en los juegos
			game.physics.startSystem(Phaser.Physics.ARCADE);
			
			game.stage.backgroundColor = '#f27';
			game.load.image('bola', '..img/bola.png');
			game.load.image('objetivo', '..img/objetivo.png');
		}
		
		//function para crear las cosas
		function create(){
			/*
			//se inicial la imagen 'bola' en los puntos indicados por inicioX y inicioY
			game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
			//hace que la bola actue con las leyes de la phisica
			game.physics.arcade.enable(bola);
			*/
			
			//vamos a crear un texto que este en la esquina a la altura 15 y 15
			//le añadimos puntuación y varias opciones css
			scoreText = game.add.text(15, 15, puntuacion, {fontSize: '100px', fill: '#757'});
						
			objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
			bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
			
			game.physics.arcade.enable(bola);
			game.physics.arcade.enable(objetivo);
			
			//al cuerpo de la boda le decimos que haga la detección de la bola con el borde del dispositivo
			bola.body.collideWorldBounds = true;
			//cada vez que toca el borde genera una señal
			bola.body.onWorldBounds = new Phaser.Signal();
			//señal que decrementaPuntuacion una vez que toca el borde
			bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
		}
		
		//function para actualizar las cosas
		function update(){
			var factorDificultad = (300 + (dificultad * 100));
			
			bola.body.velocidadY = (velocidadY * factorDificultad);
			bola.body.velocidadX = (velocidadX * (-1 * factorDificultad) );
			
			//que nos detecte cuando la bola se cruza con el objetivo que se lanse la puntuacion
			game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
		}
		
		var estados = (preload: preload, create: create, update: update);
		//creamos un nuevo juego de phaser con Phaser.Game
		//le damos ancho y alto
		//la forma de renderizar es Phaser.CANVAS
		//lo colocamos en el id del html pahser
		//y le ponemos los estados
		var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser'.estados);
	},
	
	decrementaPuntuacion: function(){
		puntuacion = puntuacion - 1;
		scoreText.text = puntuacion;
	},
	
	incrementaPuntuacion: function(){
		puntuacion = puntuacion + 1;
		scoreText.text = puntuacion;
		
		//para iniciar el juego en otro punto
		objetivo.body.x = app.inicioX();
		objetivo.body.y = app.inicioY();
		
		if(puntuacion > 0){
			dificultad += 1;
		}
	},
	
	inicioX: function(){
		return app.numeroAleatorioHata(ancho - DIAMETRO_BOLA);
	},
	
	inicioY: function(){
		return app.numeroAleatorioHata(alto - DIAMETRO_BOLA);
	},
	
	numeroAleatorioHata: function(limite){
		return Math.floor(Math.random() * limite);
	},
	
	vigilaSensores: function(){
		function onError(){
			console.log('onError!');
		}
		
		function onSuccess(datosAceleration){
			app.detectaAgitacion(datosAceleration);
			app.registraDireccion(datosAceleration);
		}
		
		//vamos a leer estos datos de acceleración con watchAcceleration cada 1s
		navigator.accelerometer.watchAcceleration(this.onSuccess, onError, {frequency: 10});
	},
	
	detectaAgitacion: function(datosAceleration){
		var agitacionX = datosAceleration.x > 10;
		var agitacionY = datosAceleration.y > 10;
		
		if(agitacionX || agitacionY){
			//para recomenzar el juego
			setTimeout(app.recomienza, 1000);
		}
	},
	
	recomienza: function(){
		document.location.reload(true);
	},
	
	registraDireccion: function(datosAceleration){
		velocidadX = datosAceleration.x;
		velocidadY = datosAceleration.y;
	}
};

if('addEventListener' in document){
	document.addEventListener('deviceready', function(){
		app.inicio();
	}, false);
}