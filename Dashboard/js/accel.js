//accel JSON object into graph
//INPUT: JSON Object
//OUTPUT: accel graph with all three dimensions
function accelDisplay(data){
	// console.log(data);
	document.getElementById("real-time").innerHTML = "";
	document.getElementById("history").innerHTML = "";
	var margin = {
		top: 20,
		right: 50,
		bottom: 100,
		left: 50
		};
	var width = 1000 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;
	// var lines = ["X","Y","Z"];
	// var lineX;
	// var lineY;
	// var lineZ;

	if(isJSON(data)){
		var data = JSON.parse(data);
		var data = data.hits.hits;
		// console.log(data);

//=======================================================X Axis (dateTime)
		var x = d3.time.scale.utc()
			// .domain([xMin, xMax])
			.domain(d3.extent(data,function(d){
				return d.fields.datetime;
			}))
			.range([0, width]);

//=======================================================Y Axis (Range)
		var y = d3.scale.linear()
			.domain([-20,+20])
			// .domain(d3.extent(data,function(d){
			// 	return d.fields.accelX;
			// }))
			.range([height, 0]);


//=======================================================Axises display
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom')
			.ticks(3)
			.tickFormat(d3.time.format("%x %X"));
			
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left')
			.ticks(5);

//=======================================================Paths (Lines and Areas)
		var lineX = d3.svg.line()
			.x(function(d){
				// console.log(x(new Date(parseInt(d.datetime))));
				return x(new Date(parseInt(d.fields.datetime)));
			})
			.y(function(d){
				return y(d.fields.accelX);
			})
			.interpolate("linear");

		var lineY = d3.svg.line()
			.x(function(d){
				// console.log(x(new Date(parseInt(d.datetime))));
				return x(new Date(parseInt(d.fields.datetime)));
			})
			.y(function(d){
				return y(d.fields.accelY);
			})
			.interpolate("linear");

		var lineZ = d3.svg.line()
			.x(function(d){
				// console.log(x(new Date(parseInt(d.datetime))));
				return x(new Date(parseInt(d.fields.datetime)));
			})
			.y(function(d){
				return y(d.fields.accelZ);
			})
			.interpolate("linear");


//=======================================================DRAWING		
		var graph = d3.select('#history')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom);

//=======================================================clipPath & Sizes
			graph.append('clipPath')
			.attr("id","rect-clip")
			.append("rect")
			.attr("width", width)
			.attr("height", height);

//=======================================================DRAWING PATHS
//=======================================================AccelX
			graph.append('path')
			.attr("class", "line")
			.attr("id", "lineX")
			.attr("d", lineX(data))
			.attr("stroke", "blue")
			.attr("fill", "none")
			.style("opacity", 1)
			.attr("clip-path", "url(#rect-clip)")
			.attr('transform','translate('+margin.left+','+margin.top+')');
//=======================================================AccelY
			graph.append('path')
			.attr("class", "line")
			.attr("id", "lineY")
			.attr("d", lineY(data))
			.attr("stroke", "green")
			.attr("fill", "none")
			.style("opacity", 1)
			.attr("clip-path", "url(#rect-clip)")
			.attr('transform','translate('+margin.left+','+margin.top+')');
//=======================================================AccelZ
			graph.append('path')
			.attr("class", "line")
			.attr("id", "lineZ")
			.attr("d", lineZ(data))
			.attr("stroke", "red")
			.attr("fill", "none")
			.style("opacity", 1)
			.attr("clip-path", "url(#rect-clip)")
			.attr('transform','translate('+margin.left+','+margin.top+')');


//=======================================================LineX Legend
			graph.append("text")
			.attr("x", (width/2))
			.attr("y", (height + margin.top + ((margin.top + margin.bottom)/2)))
			.attr("class", "legend")
			.attr("id", "legX")
			.style("fill", "blue")
			.on("click",function(){
				if(d3.select("#lineX").style("opacity") == 1){
					// console.log(d3.select("#lineX").style("opacity"))
					d3.select("#lineX")
					.transition().duration(100)
					.style("opacity", 0);
					// document.getElementById("legX").opacity = 0.5;
				} else{
					// console.log(document.getElementById("legX").opacity)
					d3.select("#lineX")
					.transition().duration(100)
					.style("opacity", 1);
					// document.getElementById("legX").opacity = 1;
				};
			})
			.text("lineX");

//=======================================================lineY Legend
			graph.append("text")
			.attr("x", (margin.left + (width/2)))
			.attr("y", (height + margin.top + ((margin.top + margin.bottom)/2)))
			.attr("class", "legend")
			.attr("id", "legY")
			.style("fill", "green")
			.on("click",function(){
				if(d3.select("#lineY").style("opacity") == 1){
					// console.log(document.getElementById("legY").opacity)
					d3.select("#lineY")
					.transition().duration(100)
					.style("opacity", 0);
					// document.getElementById("legY").opacity = 0.5;
				} else{
					// console.log(document.getElementById("legY").opacity)
					d3.select("#lineY")
					.transition().duration(100)
					.style("opacity", 1);
					// document.getElementById("legY").opacity = 1;
				};
			})
			.text("lineY");

//=======================================================lineZ Legend
			graph.append("text")
			.attr("x", ((margin.left*2) + (width/2)))
			.attr("y", (height + margin.top + ((margin.top + margin.bottom)/2)))
			.attr("class", "legend")
			.attr("id", "legZ")
			.style("fill", "red")
			.on("click",function(event){
				if(d3.select("#lineZ").style("opacity") == 1){
					// console.log("legZ opacity 1")
					d3.select("#lineZ")
					.transition().duration(100)
					.style("opacity", 0);
					// document.getElementById("legZ").opacity = 0.5;
				} else{
					// console.log("legZ opacity 0")
					d3.select("#lineZ")
					.transition().duration(100)
					.style("opacity", 1);
					// document.getElementById("legZ").opacity = 1;
				};
			})
			.text("lineZ");

//=======================================================DRAWING AXISES
			graph.append('g')
			.attr('class', 'y axis')
			.attr("stroke-width", 1)
			.attr('transform','translate('+margin.right+','+margin.top+')')
			.call(yAxis)
			.append("text")
	        .attr("transform", "rotate(-90)")
	        .attr("y", -(margin.left))
	        .attr("x",0 - (height / 2))
	        .attr("dy", "1em")
	        .style("text-anchor", "middle")
	        .text("G-Force");

			graph.append('g')
			.attr('class', 'x axis')
			.attr("stroke-width", 1)
			.attr('transform','translate('+margin.left+','+(height+margin.top)+')')
			.call(xAxis);
			// .append("text")
			// .attr("class", "legend")
			// .attr("transform", "translate("+((width+margin.left+margin.right)/2) + " ," + (height+margin.bottom+margin.top) + ")")
			// .style("text-anchor", "middle")
			// .text("Date & Time");
	} else{
		console.log("accelDisplay JSON incorrect");
		console.log(data);
	}
};