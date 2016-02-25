/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//to run, you will need to npm install mqtt -g (sudo access might be required
var mqtt = require('mqtt');
var options = {
    keepalive: 0,
//    port: 800
}


console.log('Started MQTT Websocket');
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://45.55.1.125', options);
 
client.on('connect', function () {
  client.subscribe('team-mat-canary');
  console.log('connected');
});
 
 //called when a message event is received
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString());

  // var messageJSON = JSON.parse(message.toString());
  // console.log(messageJSON);

  // console.log(message);



// !!!  TODO: FOR RECEIVING SOS MESSAGES FROM WATCH
// if(receiveSOSMessage){
//   sendSOSToDashboard();
// }

// !!!  TODO: ADD LOGIC FOR DETECTION OF FALL AND SEND SOS TO DASHBOARD
// if(detectFALL){
//   sendSOSToDashboard();
// }


// !!!  TODO: SOCKET CODE BELOW
// var app = require('http').createServer(handler)
// var io = require('socket.io')(app);
// var fs = require('fs');

// app.listen(80);

// function handler (req, res) {
//   fs.readFile(__dirname + '/index.html',
//   function (err, data) {
//     if (err) {
//       res.writeHead(500);
//       return res.end('Error loading index.html');
//     }

//     res.writeHead(200);
//     res.end(data);
//   });
// }

// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });



  if(isJSON(message)){
    var inputJSON = JSON.parse(message);
    var inputDateTime = inputJSON.datetime;
    var inputAccelX = inputJSON.accelX;
    var inputAccelY = inputJSON.accelY;
    var inputAccelZ = inputJSON.accelZ;
    var inputbattery = inputJSON.accelZ;
    var batteryPercent = inputbattery*100;
    var inputClientId = inputJSON.clientId;
    
    if(inputAccelX<1){
      console.log('fall');
    }
  }
  else{
    console.log('Not a JSON message')
  }

  function isJSON(message){
    try {
        JSON.parse(message);
    } catch (e) {
        return false;
    }
    return true;
  }
  

  // if (messageJSON.hasOwnProperty("status") && messageJSON.status === "disconnect"){
  //     console.log("Intention to exit was logged");
  //     client.end();
  // }
});