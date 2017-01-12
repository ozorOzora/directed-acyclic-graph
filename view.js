function start(){
	var subject;
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;



	var nodes = modelData.nodes,
		links = modelData.links;

	console.log(nodes);
	console.log(links);

	var canvas = document.querySelector("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width,
		height = canvas.height;

	var simulation = d3.forceSimulation(nodes)
		.force("charge", d3.forceManyBody().strength(function(d){return setByDepth( d.depth, -600, -40, -40)}))
		.force("link", d3.forceLink(links).distance(function(d){return setByDepth( d.source.depth, 100, 30, 30)}).strength(1))
		.force("x", d3.forceX())
    	.force("y", d3.forceY())
		.force("collision", d3.forceCollide(30) )
		.on("tick", drawNodesOnly);

	for (var i = 0; i < 300; ++i) simulation.tick();

	d3.select(canvas)
		.on("click", click)
		.on("mousemove", mousemove);

	context.translate(width / 2, height / 2);

	function setByDepth(depth, value1, value2, value3){
		switch(depth){
			case 1:
				return value1;
				break;
			case 2:
				return value2;
				break;
			case 3:
				return value3;
				break;
		}
	}

	function click(){
		var subject = getSubject();
	}

	function mousemove(){
		if (typeof getSubject() == 'object' && getSubject() != subject){
			clearCanvas();
			subject = getSubject();
			drawConnections(subject);
			drawNodesOnly();
		}
		else if( getSubject() == null ){
			clearCanvas();
			drawNodesOnly();
		}
	}

	function getSubject() {
		return simulation.find(d3.event.x - width/2, d3.event.y - height/2, 30);
	}

	function clearCanvas(){
		context.clearRect(-width/2, -height/2, width, height);
	}

	function drawNodesOnly(){
		context.beginPath();
		nodes.forEach(drawNode);
		context.lineWidth = 10;
		context.strokeStyle = "#242d5c";
		context.stroke();
		context.fillStyle = "#ff6666";
		context.fill();
	}

	function getRelatedNodes(links){
		var relatedNodes = [];
		links.forEach(function(c){
			relatedNodes.push(nodes.filter(function(d){return c.source.id == d.id})[0]);
			relatedNodes.push(nodes.filter(function(d){return c.target.id == d.id})[0]);
		})
		relatedNodes.sort(function(a,b) {return a.index-b.index;} ); // trie le tableau en fonction des index de nodes.
		relatedNodes = relatedNodes.filter(function(d, i, self){return !i || d != self[i - 1]});
		return relatedNodes;
	}

	function drawConnections(subject){
		var subjectLinks = links.filter(function(d){return d.source.id == subject.id || d.target.id == subject.id});

		subjectLinks.forEach(drawLink);
		context.lineWidth = 1;
		context.strokeStyle = "#6b75a5";
		context.stroke();

		var relatedNodes = getRelatedNodes(subjectLinks);
		relatedNodes.forEach(drawNodeText);
	}

	function drawLink(d) {
		context.moveTo(d.source.x, d.source.y);
		context.lineTo(d.target.x, d.target.y);
	}

	function drawNode(d) {
		context.moveTo(d.x + 4, d.y);
		context.arc(d.x, d.y, 4, 0, 2 * Math.PI);
	}

	function drawNodeText(d){
		var text = d.name, txtHeight = 14;
		context.font = txtHeight + "px Verdana";
		var txtWidth = context.measureText(text).width,
			txtHeight = 14,
			X = d.x - txtWidth/2,
			Y = d.y +25;

		context.fillStyle = "#242d5c";
		context.fillRect(X, Y-txtHeight, txtWidth, txtHeight+5);

		context.fillStyle = "#ff6666";
		context.fillText(text, d.x-txtWidth/2, d.y+25);
	}

}
