/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//========================================== GLOBAL VARIABLES
var URLsearch = "http://45.55.1.125:9200/message/heartbeat/_search"
var URL_log = "http://45.55.1.125:9200/message/heartbeat/";
var http = require('http'),
    io = require('socket.io');
var request = require('request');
var mqtt = require('mqtt');
var options = {
    keepalive: 0,
    clean: true
}

//========================================== GLOBAL VARIABLES END

//========================================== CONNECTIONS

// Create HTTP server & socket connection
var server = http.createServer(function(req, res) {
    // Send HTML headers and message
    res.writeHead(404, {
        'Content-Type': 'text/html'
    });
    res.end("<h1>Sorry, couldn't find anything! 404</h1>");
});
server.listen(5555);
io = io.listen(server);

io.on('connection', function(socket) {
    console.log('a machine has connected');
    var currIntervalID;

    //display all users
    getClientIDs();

    socket.on('clientId', function(data) {
        clearInterval(currIntervalID);
        getClientIDs();
    });

    //once clientID is selected, display accel data
    //input: '{"clientID":String}'
    //output: '{"clientID":String, "accelX":int, "accelY":int, "accelZ"int}'
    socket.on('real-time', function(data) {
        if (currIntervalID != null) {
            clearInterval(currIntervalID);
        };
        if (isJSON(data)) {
            var parsed = JSON.parse(data);
            var curr_ID = parsed.clientId;
            currIntervalID = setInterval(function() {
                realTimeQ(curr_ID);
            }, 500);
        } else {
            console.log("real-time socket JSON incorrect");
            // console.log(data);
        }
    });

    //clear the interval for real-time data retrieval
    socket.on('stop-real', function(data) {
        clearInterval(currIntervalID);
    });
    //listen for battery query
    //input: '{"clientID":String, "datetime"Array[]}'
    //output: '{"clientID":String, "datetime":Array[], "battery":Array[]}'
    socket.on('battery', function(data) {
        if (currIntervalID != null) {
            clearInterval(currIntervalID)
        };
        if (isJSON(data)) {
            // console.log("Searching for battery data");
            //input & output values
            var parsed = JSON.parse(data);
            var curr_ID = parsed.clientID;
            var start = parsed.start;
            var end = parsed.end;
            // console.log(dateTimeRec);
            //function to query server
            batteryQuery(curr_ID, start, end);
        } else {
            console.log("battery socket JSON incorrect");
            //console.log(data);
        }
    });

    //listen for accel query
    //input: '{"clientID":String, "datetime"Array[]}'
    //output: '{"clientID":"abc", "datetime":Array[], "accelX":Array[], "accelY":Array[], "accelZ"Array[]}'
    socket.on('accel', function(data) {
        if (currIntervalID != null) {
            clearInterval(currIntervalID)
        };
        if (isJSON(data)) {
            //input & output values
            var parsed = JSON.parse(data);
            var curr_ID = parsed.clientID;
            var start = parsed.start;
            var end = parsed.end;
            //function to query server
            accelQuery(curr_ID, start, end);
            // socket.emit('rAccel',message);
        } else {
            console.log("accel socket JSON incorrect");
            //console.log(data);
        }
    });

    //listen for GPS query
    //input:
    //output:
    socket.on('pos', function(data) {});

    //========================================== ELASTICSEARCH QUERIES

    //@Wes: use this function to return all the heartbeats that fall within the start and end times
    function getHeartbeatResponses(start, end) {
        var payload = {
            "size": 10000,
            "sort": [{
                "datetime": {
                    "order": "desc"
                }
            }],
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
        request({
                url: URLsearch,
                method: 'POST',
                body: payloadString
            }, //the callback function when something is successfully retrieved
            function(error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    //console.log(body);
                }
            });
        // }

    };

    function getClientIDs() {
        var payload = {
            "size": 0,
            "aggs": {
                "id": {
                    "terms": {
                        "field": "clientId"
                    }
                }
            }
        }

        var payloadString = JSON.stringify(payload);

        request({
                url: URLsearch,
                method: 'POST',
                body: payloadString
            },

            //the callback function when something is successfully retrieved
            function(error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    var responseObject = JSON.parse(body);
                    var buckets = responseObject.aggregations.id.buckets;
                    var returnArray = []

                    for (var i = 0; i < buckets.length; i++) {
                        returnArray.push(buckets[i].key);
                    }
                    socket.emit('clientIds', returnArray);
                    console.log(returnArray);
                }
            });
    };

    function realTimeQ(curr_ID) {
        var payload = {
            "size": 1000,
            "sort": [{
                "datetime": {
                    "order": "desc"
                }
            }],
            "fields": ['clientId', 'clientName', 'datetime', 'accelX', 'accelY', 'accelZ'],
            "query": {
                "term": {
                    "clientId": curr_ID
                }
            }
        }
        var payloadString = JSON.stringify(payload);
        var message;
        request({
                url: URLsearch,
                method: 'POST',
                body: payloadString
            }, //the callback function when something is successfully retrieved
            function(error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Found data: Real-Time");
                    socket.emit('rRealTime', body);
                }
            });
        //console.log("Message = " + body);
        //return message;
        // }
    };

    function batteryQuery(curr_ID, start, end) {
        console.log(curr_ID);
        console.log(start);
        console.log(end);

        var payload = {
            "size": 9000,
            "sort": [{
                "datetime": {
                    "order": "desc"
                }
            }],
            "fields": ['clientId', 'clientName', 'datetime', 'battery', 'transferRate'],
            "query": {
                "filtered": {
                    "query": {
                        "term": {
                            "clientId": curr_ID
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
        var message;
        request({
                url: URLsearch,
                method: 'POST',
                body: payloadString
            }, //the callback function when something is successfully retrieved
            function(error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Found data: Battery");
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

    function accelQuery(curr_ID, start, end) {
        var payload = {
            "size": 9000,
            "sort": [{
                "datetime": {
                    "order": "desc"
                }
            }],
            "fields": ['clientId', 'clientName', 'datetime', 'accelX', 'accelY', 'accelZ'],
            "query": {
                "filtered": {
                    "query": {
                        "term": {
                            "clientId": curr_ID
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
        var message;
        request({
                url: URLsearch,
                method: 'POST',
                body: payloadString
            }, //the callback function when something is successfully retrieved
            function(error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Found data: Accel");
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
    socket.on('disconnect',function(){
        clearInterval(currIntervalID);
    });
    //========================================== ELASTICSEARCH QUERIES END

});

// Create MQTT connection

console.log('Started MQTT Websocket');
var client = mqtt.connect('mqtt://45.55.1.125', options);

client.on('connect', function() {
    client.publish('team-mat-canary', null, {
        retain: true
    });
    client.subscribe('team-mat-canary');
    console.log('connected to mqtt broker');
});

//========================================== CONNECTIONS END

//========================================== MESSAGE RECEIVING AND ANALYSIS

//called when a message event is received

client.on('message', function(topic, message) {
    // message is Buffer 
    console.log("Receiving message");

    if (message.toString() == "") {
        return;
    }

    if (fallDetected(message)) {
        sendSOSMessage('server', JSON.parse(message).clientId, JSON.parse(message).clientName, JSON.parse(message).lat, JSON.parse(message).lon);
    };

    var messageJSON = JSON.parse(message.toString());
    console.log(messageJSON);

    // console.log(message);
    var id = generateUUID();
    var stringMessage = message.toString();

    if (messageJSON.hasOwnProperty('type') && messageJSON.type === 'sos') {
        sendSOSMessage('client', JSON.parse(message).clientId, JSON.parse(message).clientName, JSON.parse(message).datetime, JSON.parse(message).lat, JSON.parse(message).lon);
    }

    //the following block will log the hearbeat to elasticsearch
    //TODO: uncomment this when the android client sends the proper JSON
    if (messageJSON.hasOwnProperty('type') && messageJSON.type === 'heartbeat') {
        console.log("Logging heartbeat");

        request({
                url: URL_log + id,
                method: 'PUT',
                body: stringMessage
            }, //the callback function when something is successfully stored in elasticsearch
            function(error, response, body) {
                if (error) {
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

//========================================== MESSAGE RECEIVING AND ANALYSIS END

//========================================== HELPER FUNCTIONS

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

function fallDetected(message) {
    if (isJSON(message)) {
        var inputJSON = JSON.parse(message);
        var inputAccelX = inputJSON.accelX;
        var inputAccelY = inputJSON.accelY;
        var inputAccelZ = inputJSON.accelZ;
        var inputClientId = inputJSON.clientId;

        if (inputAccelX < -20 || inputAccelY < -20 || inputAccelZ < -20) {
            return true;
        }
    } else {
        return false;
    }
}

function isJSON(message) {
    try {
        JSON.parse(message);
    } catch (e) {
        return false;
    }
    return true;
};

function sendSOSMessage(source, clientId, clientName, datetime, lat, lon) {
    var payload = {
        "clientId": clientId,
        "clientName": clientName,
        "datetime": datetime,
        "lat": lat,
        "lon": lon
    }
    io.emit('sos', payload);
    console.log("logging sos");
}

//========================================== HELPER FUNCTIONS END