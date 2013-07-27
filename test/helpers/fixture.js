"use strict";

/**
 * Create a fixture and append it to the document body
 * and register it to be cleaned up after the spec finishes
 *
 * @param {String} contents
 * @return {HTMLElement|HTMLCollection} the created node
 */
jasmine.createFixture = function(contents) {
	var dummyParent = document.createElement('div');
	dummyParent.innerHTML = contents;

	var currentSpec = jasmine.getEnv().currentSpec;
	var nodes = Array.prototype.slice.call(dummyParent.children, 0);
	nodes.forEach(function(node) {
		document.body.appendChild(node);
		currentSpec.after(function() {
			node.parentNode.removeChild(node);
		});
	});

	return (nodes.length > 1 ? nodes : nodes[0]);
};
