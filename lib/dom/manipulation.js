"use strict";

define(function(require) {
	var DOM = require('./core');

	var NODE_TYPE_ELEMENT_NODE = 1;
	//var NODE_TYPE_ATTRIBUTE_NODE = 2; // deprecated
	var NODE_TYPE_TEXT_NODE = 3;
	//var NODE_TYPE_CDATA_SECTION_NODE = 4; // deprecated
	//var NODE_TYPE_ENTITY_REFERENCE_NODE = 5; // deprecated
	//var NODE_TYPE_ENTITY_NODE = 6; // deprecated
	//var NODE_TYPE_PROCESSING_INSTRUCTION_NODE = 7;
	//var NODE_TYPE_COMMENT_NODE = 8;
	//var NODE_TYPE_DOCUMENT_NODE = 9;
	//var NODE_TYPE_DOCUMENT_TYPE_NODE = 10;
	var NODE_TYPE_DOCUMENT_FRAGMENT_NODE = 11;
	//var NODE_TYPE_NOTATION_NODE = 12; // deprecated

	return function DOM_Manipulation(prototype, Static) {
		/**
		 * Apply a callback function to each element in a set
		 * with the given elements or markup string
		 *
		 * @param {DOM.Core} domSet
		 * @param {String|HTMLElement|DocumentFragment} els
		 * @param {Function<HTMLElement, HTMLElement>} callback
		 * @return {DOM.Core} domSet
		 */
		Static.manipulate = function(domSet, els, callback) {
			if (typeof els == 'string') {
				els = Static.fragment(els);
			}
			if (els.nodeType == NODE_TYPE_ELEMENT_NODE ||
				els.nodeType == NODE_TYPE_TEXT_NODE ||
				els.nodeType == NODE_TYPE_DOCUMENT_FRAGMENT_NODE) {
				for (var i = 0, len = domSet.length; i < len; i++) {
					callback(domSet[i], els.cloneNode(true));
				}
			}
			return domSet;
		};

		/**
		 * Insert the given elements or markup as the first element(s)
		 * to each element in the set
		 *
		 * @param {String|HTMLElement|DocumentFragment} els
		 * @return this
		 */
		prototype.prepend = function(els) {
			return Static.manipulate(this, els, function(node, newContent) {
				node.insertBefore(newContent, node.firstChild);
			});
		};

		/**
		 * Append the given elements or markup as the last element(s)
		 * to each element in the set
		 *
		 * @param {String|HTMLElement|DocumentFragment} els
		 * @return this
		 */
		prototype.append = function(els) {
			return Static.manipulate(this, els, function(node, newContent) {
				node.appendChild(newContent);
			});
		};

		/**
		 * Insert the given elements or markup as the previous sibling
		 * to each element in the set
		 *
		 * @param {String|HTMLElement|DocumentFragment} els
		 * @return this
		 */
		prototype.before = function(els) {
			return Static.manipulate(this, els, function(node, newContent) {
				var parentNode = node.parentNode;
				if (parentNode) {
					parentNode.insertBefore(newContent, node);
				}
			});
		};

		/**
		 * Insert the given elements or markup as the next sibling
		 * to each element in the set
		 *
		 * @param {String|HTMLElement|DocumentFragment} els
		 * @return this
		 */
		prototype.after = function(els) {
			return Static.manipulate(this, els, function(node, newContent) {
				var parentNode = node.parentNode;
				if (parentNode) {
					parentNode.insertBefore(newContent, node.nextSibling);
				}
			});
		};

		/**
		 * Replace each element in the current set with the given elements
		 * or markup
		 *
		 *
		 * @param {String|HTMLElement|DocumentFragment} els
		 * @return this
		 */
		prototype.replaceWith = function(els) {
			return Static.manipulate(this, els, function(node, newContent) {
				var parentNode = node.parentNode;
				if (parentNode) {
					parentNode.insertBefore(newContent, node);
					parentNode.removeChild(node);
				}
			});
		};

		/**
		 * Replace the contents of each element in the set with the given
		 * elements or markup
		 *
		 * @param {String|HTMLElement|DocumentFragment} els
		 * @return this
		 */
		prototype.html = function(els) {
			return Static.manipulate(this, els, function(node, newContent) {
				// wipe the node contents clean
				node.textContent = '';
				// insert the new content as the only child(ren)
				node.appendChild(newContent);
			});
		};

		/**
		 * Replace the contents of each element in the set with the given
		 * string inserted as text and properly HTML-escaped
		 *
		 * @param {String} contents
		 * @return this
		 */
		prototype.text = function(contents) {
			return this.forEach(function(node) {
				node.textContent = contents;
			});
		};

		/**
		 * Remove each element in the set from the document
		 *
		 * @return this
		 */
		prototype.remove = function() {
			return this.forEach(function(node) {
				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}
			});
		};

		/**
		 * Remove all children from each node in the set
		 *
		 * @return this
		 */
		prototype.empty = function(els) {
			return this.forEach(function(node) {
				node.textContent = '';
			});
		};
	};
});
