var express = require("express");
var app = new express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var config = require("./config.js");
var filterServer = require("./filterServer.js");
var Log = require("log");
var log = new Log("debug");
var PORT = process.env.PORT || config.app.port;

app.use(express.static(__dirname + "/public"));
app.use("/public/js", express.static(__dirname + "/public/js"));
app.use("/public/css", express.static(__dirname + "/public/css"));
app.use("/public/lib/bootstrap-3.3.7-dist/css/", express.static(__dirname + "/public/lib/bootstrap-3.3.7-dist/css/"));
app.use("/public/lib/bootstrap-3.3.7-dist/fonts/", express.static(__dirname + "/public/lib/bootstrap-3.3.7-dist/fonts/"));
app.use("/public/lib/bootstrap-3.3.7-dist/js/", express.static(__dirname + "/public/lib/bootstrap-3.3.7-dist/js/"));


http.listen(PORT, function () {
    log.info("Filter Server - Listening port: %s", PORT);
});

filterServer.init(io);
