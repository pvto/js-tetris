var connect = require('connect');
var serveStatic = require('serve-static');
var port = 8080;
console.log("opening server at port " + port);
connect().use(serveStatic(__dirname)).listen(port);
