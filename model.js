// modelData will contain the whole list of nodes and links that our graph should have access to.
// viewData corresponds to the currently displayed nodes and links on the graph.
var modelData,
	viewData;

//loads our hierarchy-like data, then executes the callback function
d3.json("data.json", function(error, data) {
	if (error) throw error;

	var nodes = flatten(data),
		links = setLinks(nodes);

	var initialNode = getNodeByName("création", nodes);

	modelData = {"nodes":nodes,"links":links},
	viewData = {"nodes":[ initialNode ], "links":[]};

	addChildrenOfParent(initialNode);

});

// returns every node in the hierarchy structure as a flat list
function flatten(root){
	var nodes = [], i = 0;

	function recurse(node){
		if(node.children) node.children.forEach(recurse);
		node.id = i;
		++i;
		nodes.push(node);
	}
	recurse(root);
	return nodes;
}

// iterates through our list of nodes and return a list of links representing the relationship between parents and children nodes
function setLinks(nodes){
	var links = [], i = 0;

	nodes.forEach(function(node){
		if(node.children){
			node.children.forEach(function(d, n){
					 links.push({"id": i ,"source": node, "target": node.children[n]});
					 ++i;
			});
		}
		else if(node.altParents){
			node.altParents.forEach(function(name){
				links.push({"id": i ,"source": getNodeByName(name, nodes), "target": node});
				++i;
			});
		}
	});

	return links;
}

function getNodeByName(name, nodes){
	return nodes.filter(function(d){ return d.name == name })[0];
}
