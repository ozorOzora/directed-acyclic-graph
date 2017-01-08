//this function adds the children of the named node to viewData
function addChildrenOfParent(node){

	var childrenLinks = getChildrenLinks(node.id),
		childrenNodes = getChildrenNodes(childrenLinks);

	viewData.links = viewData.links.concat(childrenLinks);
	viewData.nodes = viewData.nodes.concat(childrenNodes);

	start();

	function getChildrenLinks(id){
		return modelData.links.filter(function(d){return d.source.id == id});
	}

	function getChildrenNodes(childrenLinks){
		var childrenNodes = [];
		childrenLinks.forEach(function(c, i){
			childrenNodes.push(modelData.nodes.filter(function(d){return d.id == c.target.id})[0]);
		})
		return childrenNodes;
	}
}
