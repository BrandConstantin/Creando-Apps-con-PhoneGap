var app = {
	model: {
		'notas': [{"titulo": 'Comprar comida', "contenido":, "Oferta en Mercadona"}];
	},
	
	// Initialize Firebase
	firebaseConfig: {
	apiKey: "AIzaSyAbtiFaIwh8yyLf-7gds-ONbBIKQl6w2vQ",
	authDomain: "miriadax-45124.firebaseapp.com",
	databaseURL: "https://miriadax-45124.firebaseio.com",
	projectId: "miriadax-45124",
	storageBucket: "miriadax-45124.appspot.com",
	messagingSenderId: "859891122160"
	},
	
	inicio: function(){
		this.iniciaFastClick();
		this.iniciaFirebase();
		this.iniciaBotones();
		this.refrescarLista();
	},
	
	iniciaFastClick: function(){
		FastClick.attach(document.body);
	},
	
	iniciaBotones: function(){
		var salvar = document.querySelector('#salvar');
		var aniadir = document.querySelector('#aniadir');
		
		aniadir.addEventListener('click', this.mostrarEditor, false);
		salvar.addEventListener('click', this.salvarNotas, false);
	},
	
	iniciaFirebase: function(){
		firebase.inicializeApp(this.firebaseConfig);
	},
	
	mostrarEditor: function(){
		document.getElementById('titulo').value = "";
		document.getElementById('comentario').value = "";
		document.getElementById('note-editor').style.display = "block";
		document.getElementById('titulo').focus();
	},
	
	salvarNotas: function(){
		app.construirNota();
		app.ocultarEditor();
		app.refrescarLista();
		app.grabarDatos();
	},
	
	construirNota: function(){
		var notas = app.model.notas;
		
		notas.push({"titulo": app.extraerTitulo(), "contenido": app.extraerContenido() });
	},
	
	extraerTitulo: function(){
		return document.getElementById('titulo').value;
	},
	
	extraerContenido: function(){
		return document.getElementById('contenido').value;
	},
	
	ocultarEditor: function(){
		document.getElementById('note-editor').style.display = 'none';
	},
	
	refrescarLista: function(){
		var div = document.getElementById('notes-list');
		
		div.innerHTML = this.aniadirNotasLista();
	},
	
	aniadirNotasLista: function(){
		var notas = this.model.notas;
		var notasDivs = "";
		
		for(var i in notas){
			var titulo = notas[i].titulo;
			notasDivs = notasDivs + this.aniadirNota(i, titulo);
		}
		
		return notasDivs;
	},
	
	aniadirNota: function(id, titulo){
		return "<div class='note-item' id='notas[" + id + "]'>" + titulo + "</div>";
	},
	
	//////////////////////////////////////////
	//grabar los datos para que cuando se apague la aplicación que no se pierdan los datos
	grabarDatos: function(){
		window.resolveLocalFilesSystemURL(cordova.file.externalApplicationStorageDirectory, this.gotFS, this.fail);
	},
	
	gotFS: function(fileSystem){
		fileSystem.getFile("files/" + "model.json", {create: true, exclusive: false}, app.gotFileEntry, app.fail);
	},
	
	gotFileEntry: function(fileEntry){
		fileEntry.createWriter(app.gotFileWriter, app.fail);
	},
	
	gotFileWriter: function(writer){
		writer.onwriteend = function(evt){
			console.log("datos grabados en externalApplicationStorageDirectory");
			if(app.hayWifi()){
				app.salvarFirebase();
			}
		};
		
		writer.write(JSON.stringify(app.model));
	},
	
	////////////////////////////////////////////////////////
	//guardar los datos en firebase
	salvarFirebase: function(){
		var ref = firebase.storage().ref('model.json');
		
		ref.putString(JSON.stringify(app.model));
	},
	////////////////////////////////////////
	
	hayWifi: function(){
		return navigator.connection.type === 'wifi';
	},
	
	leerDatos: function(){
		window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, this.obtenerFS, this.fail);
	},
	
	obtenerFS: function(fileSystem){
		fileSystem.getFile("files/" + "model.json", null, app.obtenerFileEntry, app.noFail);
	},
	
	obtenerFileEntry: function(fileEntry){
		fileEntry.file(app.leerFile, app.fail);
	},
	
	leerFile: function(file){
		var reader = new FileReader();
		
		reader.onloadend = function(evt){
			var data = evt.target.result;
			
			app.model = JSON.parse(data);
			app.inicio();
		};
		
		reader.readAsText(file);
	},
	
	////////////////////////////////////////////////////////////////////7
	
	noFile: function(error){
		app.inicio();
	},
	
	fail: function(error){
		console.log(error.code);
	},	

};

if('addEventListener' in document){
	document.addEventListener('deviceready', function(){
		app.inicio();
	}, false);
}
}