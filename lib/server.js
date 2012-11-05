
var _ = require("underscore");
var WebSocketServer = require('ws').Server;
var http = require("http");
var filed = require("filed");

var log = require("./log");

var protocol = "http://livereload.com/protocols/official-7";

module.exports = function(opts) {

  _.defaults(opts, {
    liveCSS: true,
    port: 35729
  });

  log('Put <script src="http://localhost:' + opts.port + '/livereload.js"></script> to your pages or use the LiveReload browser extension');

  if (!opts.server) {
    opts.server = http.createServer(function(req, res){
      if (req.url.match(/^\/livereload.js.*/)) {
        log.d("Sending ", req.url);
        filed(__dirname + "/vendor/livereload.js").pipe(res);
      }
      else {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("YALR - not implemented");
      }
    });

    opts.server.listen(opts.port);
  }

  var wss = new WebSocketServer({
    server: opts.server
  });

  var clients = [];
  function removeClient(client) {
    clients.splice(clients.indexOf(client), 1);
  }

  wss.on('connection', function(ws) {

    ws.send(JSON.stringify({
      command: 'hello',
      protocols: [ protocol ],
      serverName: 'livrel'
    }));

    ws.on('message', function(msgString) {

      var message = JSON.parse(msgString);

      if (message.command === "hello" && message.protocols &&
          message.protocols.indexOf(protocol) !== -1) {
          var client = {
            socket: ws,
            meta: message
          };
          log("Client connected");
          clients.push(client);
          ws.on("close", function(){
            log("Client disconnecting");
            removeClient(client);
          });
      }

    });

  });

  return function(path){

    log("Sending update to", clients.length, "clients for file", path);

    clients.forEach(function(client){
      client.socket.send(JSON.stringify({
        command: "reload",
        path: path,
        liveCSS: opts.liveCSS
      }));
    });

  };
};
