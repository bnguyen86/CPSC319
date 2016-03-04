var socket = io('http://45.55.1.125:80/');
// var socket = io();
var curr_ID;
var qDate;
// var qDate = '"start": "1456869619000", "end": "1456869620500"';
// var rDateTime = [{"datetime":"1456869619000"},{"datetime":"1456869619500"},{"datetime":"1456869620000"},{"datetime":"1456869620500"}];

//set Date values of query onLoad
function dateTimePopUp(){
	var se = ["start", "end"];
	var date = document.getElementById("date");
	var subButt = document.createElement("button");
	var d = new Date();
	for(i = 0; i < se.length; i++){
		var element = document.createElement("input");
		element.type = "datetime-local"
		element.id = se[i];
		date.appendChild(element);
	}
	document.getElementById("start").value = d.getFullYear()+'-01-01T00:00';
	document.getElementById("end").value = d.toISOString().substring(0,16);
	subButt.addEventListener("click", function(){
		submitDateTime();
	});
	subButt.innerHTML = "Submit";
	date.appendChild(subButt);

}

//parse the clientIDs into buttons/lists
// INPUT: 
// OUTPUT:
socket.on('clientIds',function(data){
	// console.log(data);
	var parsed = JSON.parse(data);
	// console.log(parsed);
	// if(document.getElementById("user_dis").childNodes.length == 0){
	if(document.getElementById("user_dis").innerHTML==""){
		userButtonCreation(parsed);
	} else{
		console.log("Users buttons already loaded");
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
	document.getElementById("now").innerHTML="Current User: "+curr_ID;
	document.getElementById("user_dis").innerHTML="";
	socket.emit('real-time',message);
};



//Query function called by the button
function query(event){
	var message = '{"clientID":'+JSON.stringify(curr_ID)+
					', '+ qDate+'}';
					// '",'+rDateTime+'}';
					// console.log(message);
					
	switch(event){
		case 'clientIds':
			// userSelection(curr_ID);
			socket.emit('clientId',message);
			document.getElementById("now").innerHTML= "";
			document.getElementById("real-time").innerHTML = "";
			document.getElementById("history").innerHTML = "";
			break;
		case 'real-time':
			var message = '{"clientId":'+ JSON.stringify(curr_ID) +'}';
			socket.emit('real-time',message);
			break;
		case 'battery':
			if(document.getElementById("date").innerHTML==""){
				dateTimePopUp();
			} else{
				console.log("Date Query already loaded, after submitting, press Battery again");
			}
			socket.emit('battery',message);
			break;
		case 'accel':
			if(document.getElementById("date").innerHTML==""){
				dateTimePopUp();
			} else{
				console.log("Date Query already loaded, after submitting, press Accelerometer again");
			}
			socket.emit('accel',message);
			break;
		case 'pos':
			socket.emit('pos',message);
			break;
	}
};

// displays the selected users real-time accel data
socket.on('rRealTime',function(data){
	realTimeDisplay(data);
});

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
	console.log("SUBMIT: "+qDate);
	return qDate;
};

function clearDiv(){
	document.getElementById("date").innerHTML="";
	document.getElementById("real-time").innerHTML="";
	document.getElementById("history").innerHTML="";
}

function isJSON(message){
    try {
        JSON.parse(message);
    } catch (e) {
        return false;
    }
    return true;
};
