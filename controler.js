class Controler{
	constructor(model, view, handleClick){
		this._model = model;
		this._view = view;
		this.hoverSubject;
		this.clickSubject;
		this.handleClick = handleClick;

		d3.select(this._view.canvas)
			.on("click", this.click.bind(this))
			.on("mousemove", this.mousemove.bind(this));
	}

//SIMPLIFICATION DU CONTROLER, QUI MAINTENANT NE SERT QUE DE LISTENER
	mousemove(){
		if ( this.getSubject() != this.hoverSubject && typeof this.getSubject()=="object" ){
			this.hoverSubject = this.getSubject();
			this._model.hoverRelations(this.hoverSubject);
		}
		else if(this.getSubject() == null){
			this.hoverSubject = "none";
			this._model.exploredNode = null;
			// this._model.restoreDefault();
		}
	}

	click(){
		if(this.clickSubject == this.getSubject()){
			this.clickSubject = [];
			this._model.restoreDefault();
		}
		else if(this.clickSubject!=this.getSubject() && ( this._model.defaultNodes.indexOf(this.getSubject())!=-1 || this._model.selectedNodes.indexOf(this.getSubject())!=-1 )){
			this.clickSubject = this.getSubject();
			this._model.selectRelations(this.clickSubject);
		}
	}

	getSubject(){
		return this._view.simulation.find(d3.mouse(this._view.canvas)[0] - this._view.width/2, d3.mouse(this._view.canvas)[1]- this._view.height/2, 30);
	}
}
