class Model{
	constructor(modelData){
		this.nodes = modelData.nodes;
		this.links = modelData.links;

		this.nodesAdded = new Event(this);
		this.linksAdded = new Event(this);

		this.defaultNodes = this.nodes.filter( d => d.depth<=2 );
		this.selectedNodes = this.defaultNodes;
		this.exploredNode; //Ajout d'une exploredNode
		this.newNodes = [];

		this.enabledNodes=[];

		this.selectedLinks = [];
		this.newLinks = [];

		console.log(this.nodes);
		console.log(this.links);
	}

	setByDepth(depth, value1, value2, value3){
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

	//selectRelations et hoverRelations gèrent respectivement nodes et liens liées aux interactions de selections(clique) et hover
	selectRelations(subject){
		switch(subject.depth){
			case 2:
				this.selectedNodes = this.newNodes;
				this.selectedLinks = this.links.filter( d => d.target.id == subject.id || d.source.id == subject.id);
				this.enabledNodes = this.nodes.filter(d => this.selectedLinks.indexOf(d.id)!=-1 );
				break;
			case 3:
				this.selectNodes(subject);
				this.selectedLinks = this.recurseLinks(subject);
				break;
		}

		this.linksAdded.notify();
		this.nodesAdded.notify();
	}

	hoverRelations(subject){
		this.newNodes=[];
		switch(subject.depth){
			case 2:
				this.newLinks = this.recurseLinks(subject);
				this.showNodes(subject);
				this.exploredNode = subject;
				break;
			case 3:
				if(this.enabledNodes.indexOf(subject)!=-1 ){
					console.log("FUCKING PASSED");
					this.selectedLinks = this.recurseLinks(subject);
					this.selectLinkedNodes();
					break;
				}

			}
		this.linksAdded.notify();
		this.nodesAdded.notify();
	}

	selectLinkedNodes(){
		this.selectedNodes = [];
		this.selectedLinks.forEach( (d, index) => {
			this.selectedNodes[index]=d.target;
			if(d.target.depth==2) this.showNodes(d.target);
		});
	}

	showNodes(subject){
		var theseLinks = this.links.filter( d => d.target.id == subject.id || d.source.id == subject.id);
		theseLinks.forEach( c => {
			this.newNodes.push(this.nodes.filter( d => c.source.id==d.id )[0]);
			this.newNodes.push(this.nodes.filter( d => c.target.id==d.id )[0]);
		});
	}

	selectNodes(subject){
		console.log("selectNodes");
		this.selectedNodes = [];

		var theseLinks = this.links.filter( d => d.target.id == subject.id || d.source.id == subject.id);

		theseLinks.forEach( c => {
			this.selectedNodes.push(this.nodes.filter( d => c.source.id==d.id )[0]);
			this.selectedNodes.push(this.nodes.filter( d => c.target.id==d.id )[0]);
		});
	}

	recurseLinks(subject){
		var recursedLinks=[];
		var self = this;

		function recurse(subject){
			var parentLinks = self.links.filter( d=>{ return d.target.id == subject.id } );
			parentLinks.forEach( (d) =>{
				recurse(d.source);
				recursedLinks.push(d);
			});
		}
		recurse(subject);
		return recursedLinks;
	}

	restoreDefault(){
		this.selectedNodes = this.defaultNodes;
		this.newNodes = [];

		this.selectedLinks = [];
		this.newLinks = [];

		this.linksAdded.notify();
		this.nodesAdded.notify();
	}


}
