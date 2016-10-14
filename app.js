var express = require ("express");
var app = new express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var filter = require("./filter.js");
var config = require("./config.js")
var Log = require ("log"),
	log = new Log("debug");

var port = process.env.PORT || config.app.port;

app.use(express.static(__dirname + "/public"));

app.get('/',function(req,res){
	res.redirect('index.html');
});

//---------------------------------------------------
//-------------- SOCKETS ----------------------------
//---------------------------------------------------
io.on('connection',function(socket){
	log.info("Un cliente se conecto." );

	filter.getAll(function(error,reply){
		if(!error){
			socket.emit("filterList", reply);
		}

	});

	//Espera por todos los html que el usuario va agregando al video
	socket.on('filterEditor',function(filterHtml){

		log.info("recibido de un cliente: " + filterHtml );

		//Esta linea envia los cambios al socket que esta escuchando en melt
		socket.broadcast.emit('filterChanged',filterHtml);
	});

	//actualizo un filtro.
	socket.on("filterSave", function(filterJson){

		filter.update(filterJson);

	});

	//Agrego nuevo filtro
	socket.on("filterAdd", function(filterJson){
		filter.add(filterJson);
		filter.getAll(function(error,reply){
			if(!error){
				socket.emit("filterList", reply);
			}

		});
	});
});

//---------------------------------------------------
//---------------------------------------------------
//---------------------------------------------------


http.listen(port,function(){
	log.info("Filter editor - Bienvenidos gatos!");
	log.info("Servidor escuchando a traves del puerto %s",port)

});



/*

// Configuracion de server para API publica.
var fs = require('fs');
var express = require('express');
var cors = require('cors');

var app = express();

app.use(cors());
//app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  contents = fs.readFileSync('sliderImages.json', 'utf8');
  res.end(contents);
});

app.listen(process.env.PORT || 8080);
*/
