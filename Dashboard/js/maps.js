//STOP. DON'T LOOK. IT'S BEEN POSTPONED!

//map JSON object into graph
//INPUT: JSON Object
//			where __n is the total number of data points
//OUTPUT: map with user
function mapDisplay(){
/* 	var margin = {
		top: 20,
		right: 50,
		bottom: 30,
		left: 50
		};
	var width = 1000 - margin.left - margin.right;
	var height = 300 - margin.top - margin.bottom;

	var svg = d3.select('#history')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.attr('transform','translate('+margin.left+','+margin.top+')'); */
	var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
			
	// initialize();
};

function initialize(){
	var mapProp = {
	center: new google.maps.LatLng(51.508742, -0.120850),
	zoom: 5,
mapTypeId: google.maps.MapTypeId.ROADMAP
	};
var map = new google.maps.Map(document.getElementById("history"), mapProp);
};

google.maps.event.addDomListener(window, 'load', initialize);