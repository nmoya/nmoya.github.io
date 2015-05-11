var port = process.env.PORT || 5000;
var express = require('express');
var http = require('http');
var base_dir = __dirname;
// var io = require('socket.io');

function initServer() {
  // app.use(express.json());
  // app.use(express.urlencoded());
  app.use(express.static(__dirname + '/public'));

  /* Create server */
  server = http.createServer(app)
  server.listen(port, function() {
    console.log("SERVER RUNNING. Port: " + port);
  });
  // serv_io = io.listen(server);
  // serv_io.set("log level", 1);
  // serv_io.set('transports', ['websocket', 'xhr-polling']);
  // serv_io.set("polling duration", 3);
  // serv_io.set("connect timeout", 1000);
}

function route() {
  app.get("/", function(req, res) {
    res.sendfile('index.html')
  });

  /* serves all the static files */
  app.get(/^(.+)$/, function(req, res) {
    res.sendfile(base_dir + req.params[0]);
  });

  /*app.post("/", function(req, res) {
        console.log("Received: " + req.body.url);
        serv_io.sockets.emit('bcast', req.body);
        res.send("Broadcast: \"" + req.body.url + "\" sent!");
    });*/
}

(function main() {
  // clients = 0;
  // socket_list = {};
  // serv_io = null;

  app = express();
  initServer();
  route();

})();