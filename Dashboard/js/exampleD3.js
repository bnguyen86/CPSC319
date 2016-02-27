var numbers = [ 5, 4, 10, 1 ];
var data = [
      { date: '2014-01-01', amount: 10 },
      { date: '2014-02-01', amount: 20 },
      { date: '2014-03-01', amount: 40 },
      { date: '2014-04-01', amount: 80 }
    ];

d3.min(nubers);
//1

d3.max(data, function(d, i){
	return d.amount
	});
//80

d3.extent(numbers);
//[1,10]

// var y = d3.scale.linear()
// 	.domain([0,80]) //$0 to $80
// 	.range([200,0]) //seems backwards because SVG is y-down

var y = d3.scale.linear()
	.domain(d3.extent(data, function(d){
		return d.amount
	}))
	.range([200,0]);

y(0); 	//in: $0
		//out: 200px (botton of graph)
y(80); 	//in: $80
		//out: 0px (top of graph)

var x = d3.scale.linear()
	.domain([
		new Date(Date.parse('2014-01-01')),
		new Date(Date.parse('2014-04-01'))])
	.range([0,300]);
	x(new Date(Date.parse('2014-02-01'))); //~103.38

var xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom')
	.ticks(4);

var svg = d3.select('body')
	.append('svg')
	.attr('width', 300)
	.attr('height', 150);

svg.append('g')
	.attr('class', 'a axis')
	.call(xAxis);