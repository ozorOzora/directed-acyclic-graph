// modelData will contain the whole list of nodes and links that our graph should have access to.
// viewData corresponds to the currently displayed nodes and links on the graph.

//loads our hierarchy-like data, then executes the callback function
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
console.log("hi");
$.ajax({
	url: "http://127.0.0.1/wordpressGraph/wp-json/wp/v2/graph-data",
	method: 'GET',
	crossDomain: true,
	beforeSend: function ( xhr ) {
	  xhr.setRequestHeader( 'Authorization', 'Basic ' + Base64.encode( 'root:RFHASA%bsjmPhVCkMKo9R^X*' ) );
	},
	success: function( data, txtStatus, xhr ) {
		console.log("hi");
	  parse(data);
	}
});

function parse(data){

	console.log(data);
	var nodes = flatten(data.data),
		links = setLinks(nodes);

	var initialNode = getNodeByName("création", nodes);

	var modelData = {"nodes":nodes,"links":links},
		viewData = {"nodes":[ initialNode ], "links":[]};

	setTimeout(function(){
		let model = new Model(modelData);
		let view = new View(model);
		let controler = new Controler(model, view);

		view.start();
	},100);

};

// returns every node in the hierarchy structure as a flat list
function flatten(root){
	var nodes = [], i = 0;

	function recurse(node, depth){ // last argument keeps track of the level of depth, in the hierarchy, at which the node is located.
		if (typeof depth == 'number')
        depth++;
    	else depth = 1;

		node.depth = depth;

		if(node.children)
			node.children.forEach( node => recurse(node, depth) );

		node.id = i;
		++i;

		if(depth==1){
			node.fixed = true;
			node.fx = 0;
			node.fy = 0;
		}
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
