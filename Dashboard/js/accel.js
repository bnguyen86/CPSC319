//accel JSON object into graph
//INPUT: JSON Object
//		ex) '[{"datetime":String, "accelX":float, "accelY":float, "accelZ":float, "clientID":String},*(__n)]'
//			where __n is the total number of data points
//OUTPUT: accel graph with all three dimensions
function accelDisplay(data){
	// console.log(data);
	// clearDiv();
	document.getElementById("real-time").innerHTML = "";
	document.getElementById("history").innerHTML = "";
	var margin = {
		top: 20,
		right: 50,
		bottom: 30,
		left: 50
		};
	var width = 1000 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	if(isJSON(data)){
		var data = JSON.parse(data);
		var data = data.hits.hits;
		// console.log(data);

		//earliest date
		var xMin = new Date(parseInt(d3.min(data,function(d, i){
				return d.fields.datetime;
				})));
		 console.log(xMin);
		//latest date
		var xMax = new Date(parseInt(d3.max(data,function(d, i){
				return d.fields.datetime;
				})));	
		console.log(xMax);

		//x axis (dateTime)
		var x = d3.time.scale.utc()
			// .domain([xMin, xMax])
			.domain(d3.extent(data,function(d){
				return d.fields.datetime;
			}))
			.range([0, width]);

		//y axis (range)
		var y = d3.scale.linear()
			.domain([-20,+20])
			// .domain(d3.extent(data,function(d){
			// 	return d.fields.accelX;
			// }))
			.range([height, 0]);


		//Axis
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom')
			.ticks(3)
			.tickFormat(d3.time.format("%x %X"));
			
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left')
			.ticks(3);


		var lineX = d3.svg.line()
			.x(function(d){
				// console.log(x(new Date(parseInt(d.datetime))));
				return x(new Date(parseInt(d.fields.datetime)));
			})
			.y(function(d){
				return y(d.fields.accelX);
			})
			.interpolate("line");

		var lineY = d3.svg.line()
			.x(function(d){
				// console.log(x(new Date(parseInt(d.datetime))));
				return x(new Date(parseInt(d.fields.datetime)));
			})
			.y(function(d){
				return y(d.fields.accelY);
			})
			.interpolate("line");

		var lineZ = d3.svg.line()
			.x(function(d){
				// console.log(x(new Date(parseInt(d.datetime))));
				return x(new Date(parseInt(d.fields.datetime)));
			})
			.y(function(d){
				return y(d.fields.accelZ);
			})
			.interpolate("line");


		//Drawing			
		var svg = d3.select('#history')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.attr('transform','translate('+margin.left+','+margin.top+')');

			svg.append('g')
			.attr('class', 'y axis')
			.attr('transform','translate('+margin.right+','+margin.top+')')
			.call(yAxis);

   			svg.append("text")
	        .attr("transform", "rotate(-90)")
	        .attr("y", 0)
	        .attr("x",0 - ((height / 2)+ margin.top))
	        .attr("dy", "1em")
	        .style("text-anchor", "middle")
	        .text("G-Force");

			svg.append('g')
			.attr('class', 'x axis')
			.attr('transform','translate('+margin.right+','+(height/2+margin.top)+')')
			.call(xAxis);

			svg.append("text")
			.attr("transform", "translate("+((width+margin.left+margin.right)/2) + " ," + (height+margin.bottom+margin.top) + ")")
			.style("text-anchor", "middle")
			.text("Date & Time");

			//AccelX
			svg.append('path')
			.attr("class", "line")
			.attr("d", lineX(data))
			.attr("stroke", "blue")
			.attr("stroke-width", 1)
			.attr("fill", "none")
			.attr('transform','translate('+margin.right+','+margin.top+')');
			//AccelY
			svg.append('path')
			.attr("class", "line")
			.attr("d", lineY(data))
			.attr("stroke", "green")
			.attr("stroke-width", 1)
			.attr("fill", "none")
			.attr('transform','translate('+margin.right+','+margin.top+')');
			//AccelZ
			svg.append('path')
			.attr("class", "line")
			.attr("d", lineZ(data))
			.attr("stroke", "red")
			.attr("stroke-width", 1)
			.attr("fill", "none")
			.attr('transform','translate('+margin.right+','+margin.top+')');

	} else{
		console.log("accelDisplay JSON incorrect");
		console.log(data);
	}
};