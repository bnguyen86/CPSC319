function displayLastLoc(data) {
	console.log("HERE");
	console.log(data);
};
/* function displayLastLoc(data) {
	if (isJSON(data)) {
		var data = JSON.parse(data);
		var data = data.hits.hits;
		var currLat = data[999].fields.lat[0];
		var currLon = data[999].fields.lon[0];
		console.log("lat: " + currLat + " lon: " + currLon);
		
		plotLoc(currLat, currLon);
		
	} else {
		
		var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 49.246292, lng: -123.116226},
		zoom: 15
	});
		
	}
};

function plotLoc(lat, lon) {
	currLoc = {lat: lat, lng: lon};
	
	var map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 49.246292, lng: -123.116226},
		zoom: 15
	});
	
	map.panTo(currLoc);
	
	var marker = new google.maps.Marker({
		position: currLoc,
		map: map,
		title: 'Current Location'
	});
};

 */