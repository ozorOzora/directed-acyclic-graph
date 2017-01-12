function start(){

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
		.on("tick", ticked);

		for (var i = 0; i < 300; ++i) simulation.tick();

		d3.select(canvas)
			.on("click", click)
			.call(d3.drag()
				.container(canvas)
				.subject(getSubject)
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended));

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

	function update(){
		/*nodes = modelData.nodes;
		links = modelData.links;

		simulation.nodes(nodes).restart();*/

		//for (var i = 0; i < 300; ++i) simulation.tick();
	}

	function ticked() {
		context.clearRect(0, 0, width, height);
		context.save();
		context.translate(width / 2, height / 2);

		context.beginPath();
		links.forEach(drawLink);
		context.lineWidth = 1;
		context.strokeStyle = "#6b75a5";
		context.stroke();

		context.beginPath();
		nodes.forEach(drawNode);
		context.lineWidth = 10;
		context.strokeStyle = "#242d5c";
		context.stroke();
		context.fillStyle = "#ff6666";
		context.fill();

		context.restore();
	}

	function click(){
		var subject = getSubject();
		addChildrenOfParent(subject);
		update();
	}

	function getSubject() {
		return simulation.find(d3.event.x - width / 2, d3.event.y - height / 2);
	}

	function dragstarted() {
		if (!d3.event.active) simulation.alphaTarget(0.3).alpha(0.1).restart();
		d3.event.subject.fx = d3.event.subject.x;
		d3.event.subject.fy = d3.event.subject.y;
	}

	function dragged() {
		d3.event.subject.fx = d3.event.x;
		d3.event.subject.fy = d3.event.y;
	}

	function dragended() {
		if (!d3.event.active) simulation.alphaTarget(0);
		d3.event.subject.fx = null;
		d3.event.subject.fy = null;
	}

	function drawLink(d) {
		context.moveTo(d.source.x, d.source.y);
		context.lineTo(d.target.x, d.target.y);
	}

	function drawNode(d) {
		context.moveTo(d.x + 4, d.y);
		context.arc(d.x, d.y, 4, 0, 2 * Math.PI);

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
