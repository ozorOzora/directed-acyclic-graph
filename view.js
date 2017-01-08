function start(){

	var nodes = viewData.nodes,
		links = viewData.links;

	var canvas = document.querySelector("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width,
		height = canvas.height;

	var simulation = d3.forceSimulation(nodes)
		.force("charge", d3.forceManyBody().strength(-200))
		.force("link", d3.forceLink(links).distance(30).strength(0.1))
		.force("x", d3.forceX())
		.force("y", d3.forceY())
		.alphaDecay(0.03)
		.alpha(1)
		.on("tick", ticked);

		d3.select(canvas)
			.on("click", click)
			.call(d3.drag()
				.container(canvas)
				.subject(getSubject)
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended));

	function update(){
		nodes = viewData.nodes;
		links = viewData.links;
		console.log(simulation);

		simulation.nodes(nodes).restart()
			.alpha(1);
	}

	function ticked() {
		context.clearRect(0, 0, width, height);
		context.save();
		context.translate(width / 2, height / 2);

		context.beginPath();
		links.forEach(drawLink);
		context.lineWidth = 2;
		context.strokeStyle = "#6b75a5";
		context.stroke();

		context.beginPath();
		nodes.forEach(drawNode);
		context.fillStyle = "#ff6666";
		context.fill();
		context.lineWidth = 3;
		context.strokeStyle = "#242d5c";
		context.stroke();

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
		context.moveTo(d.x + 5, d.y);
		context.arc(d.x, d.y, 5, 0, 2 * Math.PI);

		var text = d.name, txtHeight = 14;
		context.font = txtHeight + "px Verdana";
		var txtWidth = context.measureText(text).width,
			txtHeight = 14,
			X = d.x - txtWidth/2,
			Y = d.y +25;

		context.fillStyle = "#242d5c";
		context.fillRect(X, Y-txtHeight+5, txtWidth, txtHeight-5);

		context.fillStyle = "#a3aacc";
		context.fillText(text, d.x-txtWidth/2, d.y+25);
	}

}
