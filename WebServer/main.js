/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//to run, you will need to npm install mqtt -g (sudo access might be required

var http = require('http'),
io = require('socket.io');

// Create server & socket
var server = http.createServer(function(req, res)
{
  // Send HTML headers and message
  res.writeHead(404, {'Content-Type': 'text/html'});
  res.end("<h1>Sorry, couldn't find anything! 404</h1>");
});
server.listen(5555);
io = io.listen(server);

//var io = require("socket.io")(80);

io.on('connection',function(socket){

    var usersJSON = userIDs();
    var currIntervalID;
    //future implementation: if possible, simplify on by getting event
    // var events = ['clientID','real_time','battery','rBatt','accel','rAccel','pos'];

    console.log('a machine has connected');

    //display all users
    socket.emit('clientIds',usersJSON);
    console.log(usersJSON);


    socket.on('clientId', function(data){
        clearInterval(currIntervalID);
        socket.emit('clientIds',usersJSON);
        // console.log(usersJOSN);
    });

    //once clientID is selected, display accel data
    //input: '{"clientID":String}'
    //output: '{"clientID":String, "accelX":int, "accelY":int, "accelZ"int}'
    socket.on('real-time', function(data){
        if(currIntervalID != null){
            clearInterval(currIntervalID);
        };
        if(isJSON(data)){
            var parsed = JSON.parse(data);
            var curr_ID = parsed.clientId;
            currIntervalID = setInterval(function(){
                    realTimeQ(curr_ID);
                }, 500);
        } else{
            console.log("real-time socket JSON incorrect");
            // console.log(data);
        }
    });

    //listen for battery query
    //input: '{"clientID":String, "datetime"Array[]}'
    //output: '{"clientID":String, "datetime":Array[], "battery":Array[]}'
    socket.on('battery',function(data){
        if(currIntervalID != null){
            clearInterval(currIntervalID)
        };
        if(isJSON(data)){
            // console.log("Searching for battery data");
            //input & output values
            var parsed = JSON.parse(data);  
            var curr_ID = parsed.clientID;
            var start = parsed.start;
            var end = parsed.end;
            // console.log(dateTimeRec);
            //function to query server
            batteryQuery(curr_ID, start, end);
        } else{
            console.log("battery socket JSON incorrect");
            //console.log(data);
        }
    });

    //listen for accel query
    //input: '{"clientID":String, "datetime"Array[]}'
    //output: '{"clientID":"abc", "datetime":Array[], "accelX":Array[], "accelY":Array[], "accelZ"Array[]}'
    socket.on('accel', function(data){
        if(currIntervalID != null){
            clearInterval(currIntervalID)
        };
        if(isJSON(data)){
            //input & output values
            var parsed = JSON.parse(data);  
            var curr_ID = parsed.clientID;
            var start = parsed.start;
            var end = parsed.end;
            //function to query server
            accelQuery(curr_ID, start, end);
            // socket.emit('rAccel',message);
        } else{
            console.log("accel socket JSON incorrect");
            //console.log(data);
        }
    });

    //listen for GPS query
    //input:
    //output:
    socket.on('pos', function(data){
    });

    //helper functions
    //returns the list of cliendId
    //OUTPUT:
    function userIDs(){
        var userIDs = '{"clientIds":[{"clientId":"351559070571963"},{"clientId":"999999999999999"},{"clientId":"000000000000000"},{"clientId":"555555555555555"},{"clientId":"355136057747803"}]}';
        // console.log(userIDs);
        return userIDs;
    };
    function realTimeQ(curr_ID){
    //realTime mock code with needed input and expected output
        // var x = 0.8559271097183228;
        // var y = 0.1041477769613266;
        // var z = 9.460687637329102;
        // var message = '{"clientId":'+curr_ID+
        //                 ', "accelX":'+x+
        //                 ', "accelY":'+y+
        //                 ', "accelZ":'+z+'}';    
        // console.log(message);
        // return message;

        var payload = {
        "size": 100,
        "sort": [
             {
                 "datetime": 
                     {"order":"desc"}
             }
         ],
         "fields": ['clientId','datetime', 'accelX', 'accelY', 'accelZ'],
         "query": {
             "term" : { "clientId" : curr_ID }
                 }
             }
        var payloadString = JSON.stringify(payload);
        var URL = "http://45.55.1.125:9200/message/heartbeat/_search"
        var message;
        var request = require('request');
        request({
            url: URL, 
            method: 'POST',
            body: payloadString 
        }, //the callback function when something is successfully retrieved
            function(error, response, body){
                if(error) {
                    console.log(error);
                } else {
                    console.log("Found data");
                    // currIntervalID = setInterval(function(){
                    socket.emit('rRealTime',body);
                    //     }, 1000);
                    //console.log(body);
                    //message = body;
                    //console.log(message);
                }
            });
            //console.log("Message = " + body);
            //return message;
        // }
    };

    function batteryQuery(curr_ID, start, end){
    //Battery mock code with needed input and expected output
        // var rBatt = [{"batt":0.9999999988079071},{"batt":0.6099999988079071},{"batt":0.4699999988079071},{"batt":0.2399999988079071}];
        // var message = '{"clientId":'+JSON.stringify(curr_ID)+
        //              ', "dateTimeRec":'+JSON.stringify(dateTimeRec)+
        //              ', "batteryRec":'+JSON.stringify(rBatt)+'}';
        //var message = '[{"datetime":"1456869619000","battery":0.9999999988079071,"clientId":"351559070571963"},{"datetime":"1456869619500","battery":0.6099999988079071,"clientId":"351559070571963"},{"datetime":"1456869620000","battery":0.4699999988079071,"clientId":"351559070571963"},{"datetime":"1456869620500","battery":0.2399999988079071,"clientId":"351559070571963"}]';
        //console.log(message);
        console.log(curr_ID);
        console.log(start);
        console.log(end);

    	var payload = {
    		"size": 5000,
    		"sort": [
    		    {
    		        "datetime": 
    		            {"order":"desc"}
                }
    	    ],
    		"fields": ['clientId','datetime', 'battery'],
    		"query": {
    			"filtered":{
    				"query":{
		    			"term" : { 
		    				"clientId" : curr_ID
		    					}
		    	      		},
    		       	"filter": {
    		         	"range": {
    		           		"datetime": {
    		             		"to": end,
    		             		"from": start
    		           		}
    		         	}	
    		    	}
    			}
    		}
    	}

    	var payloadString = JSON.stringify(payload);
    	var URL = "http://45.55.1.125:9200/message/heartbeat/_search"
    	var message;
    	var request = require('request');
    	request({
    		url: URL, 
    		method: 'POST',
    		body: payloadString 
    	}, //the callback function when something is successfully retrieved
    		function(error, response, body){
    			if(error) {
    	    		console.log(error);
    			} else {
    				console.log("Found data");
    				socket.emit('rBatt', body);
    				//console.log(body);
    				//message = body;
    				//console.log(message);
    			}
    		});
    		//console.log("Message = " + body);
    		//return message;
    	// }

    };

    function accelQuery(curr_ID, start, end){
    //Accel mock code with needed input and expected output        
        // var rX = [{"accelX":0.8559271097183228},{"accelX":0.9559271097183228},{"accelX":0.8559271097183228},{"accelX":0.9559271097183228}];
        // var rY = [{"accelY":0.1041477769613266},{"accelY":0.1041477769613266},{"accelY":0.1041477769613266},{"accelY":0.1041477769613266}];
        // var rZ = [{"accelZ":9.4606876373291024},{"accelZ":8.4606876373291024},{"accelZ":7.4606876373291024},{"accelZ":6.4606876373291024}];
        //  var message = '{"clientId":'+JSON.stringify(curr_ID)+
        //                  ', "dateTimeRec":'+JSON.stringify(dateTimeRec)+
        //                  ', "accelXRec":'+JSON.stringify(rX)+
        //                  ', "accelYRec":'+JSON.stringify(rY)+
        //                  ', "accelZRec":'+JSON.stringify(rZ)+'}';
        // var message = '[{"datetime":"1456869619000","accelX":0.8559271097183228,"accelY":0.1041477769613266,"accelZ":9.4606876373291024,"clientId":"351559070571963"},{"datetime":"1456869619500","accelX":0.9559271097183228,"accelY":0.1041477769613266,"accelZ":8.460687637329102,"clientId":"351559070571963"},{"datetime":"1456869620000","accelX":0.8559271097183228,"accelY":0.1041477769613266,"accelZ":7.4606876373291024,"clientId":"351559070571963"},{"datetime":"1456869620500","accelX":0.9559271097183228,"accelY":0.1041477769613266,"accelZ":6.460687637329102,"clientId":"351559070571963"}]';
        // console.log(message);
        // return message;
        var payload = {
            "size": 5000,
            "sort": [
                {
                    "datetime": 
                        {"order":"desc"}
                }
            ],
            "fields": ['clientId','datetime', 'accelX', 'accelY', 'accelZ'],
    		"query": {
    			"filtered":{
    				"query":{
		    			"term" : { 
		    				"clientId" : curr_ID
		    					}
		    	      		},
    		       	"filter": {
    		         	"range": {
    		           		"datetime": {
    		             		"to": end,
    		             		"from": start
    		           		}
    		         	}	
    		    	}
    			}
    		}
    	}

        var payloadString = JSON.stringify(payload);
        var URL = "http://45.55.1.125:9200/message/heartbeat/_search"
        var message;
        var request = require('request');
        request({
            url: URL, 
            method: 'POST',
            body: payloadString 
        }, //the callback function when something is successfully retrieved
            function(error, response, body){
                if(error) {
                    console.log(error);
                } else {
                    console.log("Found data");
                    socket.emit('rAccel', body);
                    //console.log(body);
                    //message = body;
                    //console.log(message);
                }
            });
            //console.log("Message = " + body);
            //return message;
        // }
    };
});



//=-=socketIO code termination=-=//

var mqtt = require('mqtt');
var options = {
    keepalive: 0,
	clean: true
//    port: 800
}

console.log('Started MQTT Websocket');
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://45.55.1.125', options);

client.on('connect', function() {
  client.publish('team-mat-canary', null, {retain: true});
  client.subscribe('team-mat-canary');
  console.log('connected to mqtt broker');
}); 

//called when a message event is received
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log("Receiving message");

  if(message.toString()==""){
    return;
  }

  if(fallDetected(message)){
    sendSOSMessage('server', JSON.parse(message).clientId, JSON.parse(message).clientId, JSON.parse(message).lat, JSON.parse(message).lon);
  };

  var messageJSON = JSON.parse(message.toString());
  console.log(messageJSON);

  // console.log(message);
	var id = generateUUID();
  	var stringMessage = message.toString();

    if(messageJSON.hasOwnProperty('type') && messageJSON.type === 'sos'){
        sendSOSMessage('client', JSON.parse(message).clientId, JSON.parse(message).datetime, -1, -1);
    }
			
 	//the following block will log the hearbeat to elasticsearch
 	//TODO: uncomment this when the android client sends the proper JSON
 	if (messageJSON.hasOwnProperty('type') && messageJSON.type === 'heartbeat'){
	console.log("Logging heartbeat");
 	var URL = "http://45.55.1.125:9200/message/heartbeat/" + id;
	 	
 	var request = require('request');
	request({
		url: URL, 
		method: 'PUT',
		body: stringMessage
	}, //the callback function when something is successfully stored in elasticsearch
		function(error, response, body){
			if(error) {
				console.log("Error occurred");
	    		console.log(error);
			} else {
				console.log("Body contents");
	    		console.log(body);
            }
        }
    );
}
});


function fallDetected(message){
    if(isJSON(message)){
        var inputJSON = JSON.parse(message);
        var inputAccelX = inputJSON.accelX;
        var inputAccelY = inputJSON.accelY;
        var inputAccelZ = inputJSON.accelZ;
        var inputClientId = inputJSON.clientId;

        if(inputAccelX<-20 ||inputAccelY<-20 ||inputAccelZ<-20){
            return true;
        }
    }
    else {
        return false;
    }
}
// function isJSON(message){
//     try {
//         JSON.parse(message);
//     } catch (e) {
//         return false;
//     }
//     return true;
//   }
  

  // if (messageJSON.hasOwnProperty("status") && messageJSON.status === "disconnect"){
  //     console.log("Intention to exit was logged");
  //     client.end();
  // }

//getHeartbeatResponses(1456464385000,1456464387000);

//**HELPER FUNCTIONS BELOW***
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};


//@Wes: use this function to return all the heartbeats that fall within the start and end times
function getHeartbeatResponses(start, end){
	var payload = {
		"size": 5000,
		"sort": [
		    {
		        "datetime": 
		            {"order":"desc"}
            }
	    ],
		"query": {
	    	"filtered": {
	      		"query": {
	       			"match_all": {}
	      		},
		      	"filter": {
		        	"range": {
		          		"datetime": {
		            		"to": end,
		            		"from": start
		          		}
		        	}			
		    	}
	    	}
	  	}
	}

	var payloadString = JSON.stringify(payload);
	var URL = "http://45.55.1.125:9200/message/heartbeat/_search"
	var request = require('request');
	request({
		url: URL, 
		method: 'POST',
		body: payloadString 
	}, //the callback function when something is successfully retrieved
		function(error, response, body){
			if(error) {
	    		console.log(error);
			} else {
	    		//console.log(body);
			}
		});
	// }

};

function isJSON(message){
    try {
        JSON.parse(message);
    } catch (e) {
        return false;
    }
    return true;
};

function sendSOSMessage(source, clientId, datetime, lat, lon){
    var payload = {
        "clientId": clientId,
        "datetime": datetime,
        "lat": lat,
        "lon": lon
    }
    io.emit('sos', payload);
    console.log("logging sos");
}

// getHeartbeatResponses(0, "now");

function getServerIDs(){
    var payload = {
        "size": 0,
        "aggs" : {
            "id" : {
                "terms" : { "field" : "clientId" }
            }
        }
    }

    var payloadString = JSON.stringify(payload);

    var request = require('request');
    var URL = "http://45.55.1.125:9200/message/heartbeat/_search"

    request({
        url: URL, 
        method: 'POST',
        body: payloadString
        }, 

        //the callback function when something is successfully retrieved
        function(error, response, body){
            if(error) {
                console.log(error);
            } else {
                var responseObject = JSON.parse(body);
                var buckets = responseObject.aggregations.id.buckets;
                console.log(buckets);
                var returnArray = []

                for(var i=0;i<buckets.length;i++){
                    returnArray.push(buckets[i].key);
                }

                console.log(returnArray);
            }
        });


}
// getServerIDs();