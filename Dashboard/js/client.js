var socket = io('http://45.55.1.125:80/');
// var socket = io();
var curr_ID;
var qDate;
// var qDate = '"start": "1456869619000", "end": "1456869620500"';
// var rDateTime = [{"datetime":"1456869619000"},{"datetime":"1456869619500"},{"datetime":"1456869620000"},{"datetime":"1456869620500"}];

//set Date values of query onLoad
window.onload = function(){
	var d = new Date();
	document.getElementById("start").value = d.getFullYear()+'-01-01T00:00';
	document.getElementById("end").value = d.toISOString().substring(0,16);
}

//parse the clientIDs into buttons/lists
// INPUT: 
// OUTPUT:
socket.on('clientIds',function(data){
	// console.log(data);
	var parsed = JSON.parse(data);
	// console.log(parsed);
	if(document.getElementById("user_dis").childNodes.length == 0){
		userButtonCreation(parsed);
	}
});

// displays the users available
function userButtonCreation(parsed){
	for(i = 0; i < parsed.clientIds.length; i++){
		// console.log("parsed length: " + parsed.clientIds.length);
		// console.log(parsed.clientIds[i].clientId);
		var element = document.createElement("button");
		var id  =  parsed.clientIds[i].clientId;
		element.tag = "uid";
		element.id = id;
		element.innerHTML = id;
		element.addEventListener("click", function(){
			userSelection(this.id);
		});
		var dis_loc = document.getElementById("user_dis");
		dis_loc.appendChild(element);
	}
};

// returns the user selected
function userSelection(id){
	curr_ID = id;
	console.log("selected clientId: " + id);
	var message = '{"clientId":'+ JSON.stringify(id) +'}';
	socket.emit('clientId',message);
};


// displays the selected users real-time accel data
socket.on('real_time',function(data){
	console.log(data);
});

//Query function called by the button
function query(event){
	var message = '{"clientID":'+JSON.stringify(curr_ID)+
					', '+ qDate+'}';
					// '",'+rDateTime+'}';
					// console.log(message);
					
	switch(event){
		case 'clientId':
			socket.emit('clientId',message);
			break;
		case 'battery':
			socket.emit('battery',message);
			break;
		case 'accel':
			socket.emit('accel',message);
			break;
		case 'pos':
			socket.emit('pos',message);
			break;
	}
};

//display/render data
socket.on('rBatt',function(data){
	batteryDisplay(data);
});

socket.on('rAccel',function(data){
	accelDisplay(data);
	// console.log(data);
});

socket.on('rPos',function(data){
	mapDisplay(data);
});


//Sets the dates to be used to query server/database
function submitDateTime(){
	var start = document.getElementById("start").value;
	var end = document.getElementById("end").value;
	pStart =Date.parse(start);
	pEnd = Date.parse(end);
	qDate = '"start":"'+pStart+'", "end":"'+pEnd+'"';
	return qDate;
};

function isJSON(message){
    try {
        JSON.parse(message);
    } catch (e) {
        return false;
    }
    return true;
};
