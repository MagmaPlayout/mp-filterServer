var express = require ("express");
var app = new express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

var Log = require ("log"),
	log = new Log("debug");

var port = process.env.PORT || 3001;

app.use(express.static(__dirname + "/public"));

app.get('/',function(req,res){
	res.redirect('index.html');
});

io.on('connection',function(socket){
	log.info("Un cliente se conecto" );
	socket.on('filter',function(filterHtml){
		log.info("recibido de un cliente: " + filterHtml );
		socket.broadcast.emit('filter',filterHtml);
	})
})

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
