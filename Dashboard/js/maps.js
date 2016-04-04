// function displayLastLoc(data) {
// 	console.log("HERE");
// };
 function displayLastLoc(data) {
 	document.getElementById("real-time").innerHTML = "";
	document.getElementById("history").innerHTML = "";

	if (isJSON(data)) {
		var data = JSON.parse(data);
		var data = data.hits.hits;
		console.log(data);
		var currLat = parseFloat(data[0].fields.lat[0]);
		var currLon = parseFloat(data[0].fields.lon[0]);

		// console.log("lat: " + currLat + " lon: " + currLon);
		
		if(currLat != 0 && currLon != 0){
			plotLoc(currLat, currLon);
		} else{
			document.getElementById('history').innerHTML = "UNABLE TO PLOT MAP; GPS WASN'T TURNED ON"
			// var map = new google.maps.Map(document.getElementById('history'), {
			// 	center: {lat: 49.246292, lng: -123.116226},
			// 	zoom: 15
			// });
		};
	} else {
		console.log("batteryDisplay JSON incorrect");
		console.log(data);
	}
};


function plotLoc(lat, lon) {
	currLoc = {lat: lat, lng: lon};
	document.getElementById('history').style.width = "700px";
	document.getElementById('history').style.height = "500px";
	var map = new google.maps.Map(document.getElementById('history'), {
		center: {lat: 49.246292, lng: -123.116226},
		zoom: 15
	});
		// map.style.width = 700 + "px";
		// map.style.height = 500 + "px";
	map.panTo(currLoc);
	
	var marker = new google.maps.Marker({
		position: currLoc,
		map: map,
		title: 'Last Known Location'
	});
};

 