var express = require ("express")
, app = new express()
, http = require("http").Server(app)
, io = require("socket.io")(http)
, filter = require("./filter.js")
, config = require("./config.js")
, filterServer = require("./filterServer.js")
, Log = require ("log")
,	log = new Log("debug")
;

var port = process.env.PORT || config.app.port;

app.use(express.static(__dirname + "/public"));
app.use("/public/js", express.static(__dirname + "/public/js"));
app.use("/public/css", express.static(__dirname + "/public/css"));
app.use("/public/lib/bootstrap-3.3.7-dist/css/", express.static(__dirname + "/public/lib/bootstrap-3.3.7-dist/css/"));
app.use("/public/lib/bootstrap-3.3.7-dist/fonts/", express.static(__dirname + "/public/lib/bootstrap-3.3.7-dist/fonts/"));
app.use("/public/lib/bootstrap-3.3.7-dist/js/", express.static(__dirname + "/public/lib/bootstrap-3.3.7-dist/js/"));


app.get('/',function(req,res){
	res.redirect('index.html');
});

//filter server
filterServer.init(io);

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
