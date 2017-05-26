var app = {
  inicio: function(){
    this.iniciaFastClick();
	this.iniciaBotones();
  },

  iniciaFastClick: function () {
    FastClick.attach(document.body);
  },
  
  iniciaBotones: function(){	
	var buttonAction = document.querySelector('#button-action');
	buttonAction.addEventListener('click', function(){
		app.cargarFoto(Camera.PictureSourceType.CAMERA);
	});
	
	//accedemos con querySelectorAll a todos los botones que tiene la clase button-filter
	//nos lo devuelve en la misma orden escrita
	var filterButtons = document.querySelectorAll('.button-filter');
	filterButtons[0].addEventListener('click', function(){
		//le aplica una función de callback de aplicaFiltro
		app.aplicaFiltro('gray');
	});
	
	//var filterButtons = document.querySelectorAll('.button-filter');
	filterButtons[1].addEventListener('click', function(){
		app.aplicaFiltro('negative');
	});
	
	//var filterButtons = document.querySelectorAll('.button-filter');
	filterButtons[2].addEventListener('click', function(){
		app.aplicaFiltro('sepia');
	});
	
	//cargar foto
	var buttonGallery = document.querySelector('#button-galery');
	buttonGallery.addEventListener('click', function(){
		app.cargarFoto(Camera.PictureSourceType.PHOTOLIBRARY);
	});
  },
  
  //cargar la foto tomada
  cargarFoto: function(pictureSourceType){
	  var opciones = {
		  //calidad de la foto
		  quality: 50,
		  //de donde se coje la foto
		  sourceType: pictureSourceType,
		  //donde almacenar la foto
		  destinationType: Camera.DestinationType.FILE_URI,
		  //ancho y alto de la foto
		  targetWidth: 300,
		  targetHeight: 300,
		  //que no aplique factor de corrección de las camaras
		  correctOrientation: true
	  };
	  
	  navigator.camera.getPicture(app.fotoCargada, app.errorAlCargarFoto, opciones);  
  },
  
  fotoCargada: function(imageURI){
	  var img = document.createElement('img');
	  
	  img.onload = function(){
		  app.pintarFoto(img);
	  }
	  
	  img.src = imageURI;
  },
  
  //función tomar foto para acceder a la camera
  tomarFoto: function(){
	  var opciones = {
		  //calidad de la foto
		  quality: 50,
		  //donde almacenar la foto
		  destinationType: Camera.DestinationType.FILE_URI,
		  //ancho y alto de la foto
		  targetWidth: 300,
		  targetHeight: 300,
		  //que no aplique factor de corrección de las camaras
		  correctOrientation: true
	  };
	  
	  navigator.camera.getPicture(app.fotoTomada, app.errorAlTomarFoto, opciones);
  },
  
  fotoTomada: function(imageURI){
	  //coje la foto
	  var img = document.createElement('img');
	  
	  //espera a cargar la foto ante de ejecutar la función
	  img.onload = function(){
		  app.pintarFoto(img);
	  }
	  
	  //para pintar la imagen en la pantalla
	  img.src = imageURI;
  },
  
  pintarFoto: function(img){
	  var canvas = document.querySelector('#foto');
	  var context = canvas.getContext('2d');
	  
	  canvas.width = img.width;
	  canvas.height = img.height;
	  context.drawImage(img, 0, 0, img.width, img.height);
  },
  
  errorAlTomarFoto: function(message){
	  console.log('Fallo al tomar la foto o toma cancelada: ' + message);
  },
  
  errorAlCargarFoto: function(message){
	  console.log('Fallo al cargar la foto o toma cancelada: ' + message);
  },
  
  //toma como parametro el nombre del filtro
  aplicaFiltro: function(filterName){
	  var canvas = document.querySelector('#foto');
	  var context = canvas.getContext('2d');
	  
	  //con el metodo getImageData obtenemos info de los pixeles de la imagen
	  imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	  
	  //con la libreria effects le pasamos los datos y accedemos en la función para aplicar el filtro
	  effects[filterName](imageData.data);
	  
	  context.putImageData(imageData, 0, 0);
  }
};

var imageData;

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        app.inicio();
    }, false);
}

