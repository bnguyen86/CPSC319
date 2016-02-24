var express = require("express");
var path = require("path");
var app = express();
app.use('/', express.static(__dirname + '/'));
var http = require('http').Server(app);

var port = 9000;
/* var serverURL = "localhost";


var server = http.createServer(function (req, res) {
});

server.listen(port, serverURL);
console.log('Server running on ' + serverURL +  ' port ' + port);
 
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
}); */

//app.listen(port);
//console.log("App listening on port " + port);

//app.use(express.static(__dirname+"/index.html"));
console.log(__dirname);
app.get('/', function(req, res) {
	res.sendFile(__dirname+'/index.html');
	//console.log(__dirname);
	});
	
http.listen(port, function(){
  console.log('listening on *:9000');
});