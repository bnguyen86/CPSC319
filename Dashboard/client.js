var socket = io();
// socket.on('news', function(data){
// 	console.log(data);
//     // socket.emit('data request',{client: 'data'});
// });

// returns the user selected
function userSelection(id){
	console.log("selected user: " + id);
	socket.emit('user','{"user": '+ id +'}');
};


// displays the selected users real-time accel data
socket.on('real_time_data',function(data){
	console.log(data);
});

// displays the users available
function userButtonCreation(parsed){
	for(i = 0; i < parsed.users.length; i++){
		console.log("parsed length: " + parsed.users.length);
		var element = document.createElement("button");
		var id  =  parsed.users[i];
		element.id = id;
		element.innerHTML = id;
		element.addEventListener("click", function(){
			userSelection(this.id);
		}, false);
		var dis_loc = document.getElementById("user_dis");
		dis_loc.appendChild(element);
	}

}
socket.on('users',function(data){
	console.log(data);
	var parsed = JSON.parse(data);
	userButtonCreation(parsed);
});