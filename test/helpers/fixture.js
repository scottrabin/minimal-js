"use strict";

/**
 * Create a fixture and append it to the document body
 * and register it to be cleaned up after the spec finishes
 *
 * @param {String} contents
 * @return {HTMLElement|HTMLCollection} the created node
 */
jasmine.createFixture = function(contents) {
	var elements = jasmine.createElement(contents);
	var currentSpec = jasmine.getEnv().currentSpec;
	var nodes = (elements.length
				 ? Array.prototype.slice.call(elements, 0)
				 : [elements]
				);
	nodes.forEach(function(node) {
		document.body.appendChild(node);
		currentSpec.after(function() {
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		});
	});

	return (nodes.length > 1 ? nodes : nodes[0]);
};

/**
 * Create and return elements from valid markup
 *
 * @param {String} markup
 * @return {DOMElement}
 */
jasmine.createElement = function(markup) {
	var dummyParent = document.createElement('div');
	dummyParent.innerHTML = markup;

	return (dummyParent.children.length > 1 ? dummyParent.children : dummyParent.children[0]);
};
