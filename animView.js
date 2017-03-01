class AnimNode{//QUELQUES BROUTILLES DE DESIGN MODIFIE
	constructor(node, view){
		this._view = view;
		this.node = node;
		this.context = view.context;
		this.text = node.name;
		this.txtHeight = 14;
		this.context.font = this.txtHeight +"px Verdana";

		switch (this.node.depth) {
			case 1:
				this.nodeRadius = 10;
				break;
			case 2:
				this.nodeRadius = 7;
				break;
			case 3:
				this.nodeRadius = 3;
				break;
		}

	}

	drawNode(inactive){
		this.context.beginPath();
		this.context.moveTo(this.node.x + this.nodeRadius, this.node.y);
		this.context.arc(this.node.x, this.node.y, this.nodeRadius, 0, 2 * Math.PI);
		this.context.lineWidth = 10;
		this.context.strokeStyle = "#242d5c";
		if(inactive){
			this.context.lineWidth = 1;
			this.context.strokeStyle = "#6773b3";
			this.context.stroke();
		}
		else{
			if(this.node.depth <= 2){
				this.gradient = this.context.createLinearGradient(this.node.x, this.node.y-this.nodeRadius, this.node.x, this.node.y + this.nodeRadius*1.1);
				this.gradient.addColorStop(0.1, "#ff6666");
				this.gradient.addColorStop(1, "#242d5c");
				this.context.fillStyle = this.gradient;
			}
			else{
				this.context.fillStyle = "#ff6666";
			}
			this.context.stroke();
			this.context.fill();
		}

		if(this.node.depth ==1) this.drawText();
	}

	drawText(){
		var txtWidth = this.context.measureText(this.text).width,
			X = this.node.x - txtWidth/2,
			Y = this.node.y;

		this.context.fillStyle = "#242d5c";
		this.context.fillRect(X, Y + this.txtHeight, txtWidth, this.txtHeight + 4);

		this.context.fillStyle = "white";
		this.context.fillText(this.text, X,Y+this.txtHeight*2);
	}
}

class AnimLink{
	constructor(link, view){
		this.link = link;
		this._view = view;
		this.context = view.context;
		this.startX;
		this.startY;
		this.endX;
		this.endY;

		this.amount=0;
		var self = this;

		this.linkAnimated = new Event(this);
	}

	drawLink(){
		this.startX = this.link.source.x,
		this.startY = this.link.source.y,
		this.endX = this.link.target.x,
		this.endY = this.link.target.y;

		this.amount += 0.1;
		if (this.amount >= 1){
			this.amount = 1;
		}

		this.currentX = this.startX + (this.endX - this.startX)*this.amount;
		this.currentY = this.startY + (this.endY - this.startY)*this.amount;

		this.context.beginPath();
		this.context.moveTo(this.startX, this.startY);
		this.context.lineTo(this.currentX, this.currentY);
		this.context.lineWidth = 1;
		this.gradient = this.context.createLinearGradient(this.startX, this.startY, this.endX, this.endY);
		this.gradient.addColorStop(1, "#ff6666");
		this.gradient.addColorStop(0, "#242d5c");
		this.context.strokeStyle = this.gradient;
		this.context.stroke();

	}
}
