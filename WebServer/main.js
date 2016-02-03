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
var client = mqtt.connect('mqtt://broker.mqttdashboard.com', options);
 
client.on('connect', function () {
  client.subscribe('team-mat');
  console.log('connected');
});
 
 //called when a message event is received
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString());
  var messageJSON = JSON.parse(message.toString());
  
  if (messageJSON.hasOwnProperty("status") && messageJSON.status === "disconnect"){
      console.log("Intention to exit was logged");
      client.end();
  }
});