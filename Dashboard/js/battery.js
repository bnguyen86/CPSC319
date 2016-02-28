//battery JSON object into graph
//input: '{"clientID":String, "datetime":Array[], "battery":Array[]}'
//output: battery percentage graph
function batteryDisplay(data){
	var width = 400;
	var height = 400;
	if(isJSON(data)){
		//input & output values
		//clientID: ghi
		// datetime: [ { date: '2010-01-01' },{ date: '2010-02-01' },{ date: '2010-03-01' },{ date: '2010-04-01' } ]
		// battery: [Object, Object, Object, Object, Object, Object]
		var parsed = JSON.parse(data);
		console.log(parsed);
		var clientID = parsed.clientID;
		var rDateTime = parsed.datetime;
		console.log(rDateTime);
		var rBatt = parsed.battery;
		console.log(rBatt);

		//y axis (percentage)
		var y = d3.scale.linear()
			.domain([0,100])
			.range([200,0]);
		
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left')
			.ticks(4);

		//earliest date
		// var xMin = new Date(Date.parse(d3.min(rDateTime,function(d, i){
		var xMin = d3.min(rDateTime,function(d, i){
				return d.date
				});
		console.log(xMin);

		//latest date
		// var xMax = new Date(Date.parse(d3.max(rDateTime,function(d, i){
		var xMax = d3.max(rDateTime,function(d, i){
				return d.date
				});
		console.log(xMax);

		//x axis (percentage)
		var x = d3.scale.linear()
			.domain([0,100])
			.range([0,300]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom');

		var line = d3.svg.line()
			.interpolate("monotone")
			.x(rDateTime,function(d){
				console.log(d.date);
				return x(d.date);
			})
			.y(rBatt,function(d){
				console.log(d.per);
				return y(d.per);
			});
			console.log(line);
			
		var svg = d3.select('#batt_graph')
			.append('svg')
			.attr('width',width)
			.attr('height',height);
			
			svg.append('clipPath')
			.attr('id','clip')
			.append('rect')
			.attr('width', width)
			.attr('height', height);

			svg.append('g')
			.attr('class', 'y axis')
			.attr('transform','translate(50,50)')
			.call(yAxis);

			svg.append('g')
			.attr('class', 'x axis')
			.attr('transform','translate(50,250)')
			.call(xAxis);

			svg.append('path')
			.attr('class', 'line')
			.attr("clip-path", "url(#clip)")
			.attr("d", line);

	} else{
		console.log("batteryDisplay JSON incorrect");
		console.log(data);
	}
};