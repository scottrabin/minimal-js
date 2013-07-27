"use strict";

/**
 * This file relies heavily on non-standard extensions for
 * optimal performance. If better performance is required,
 * e.g. for use in IE (where performance is known to be
 * suboptimal), map this path to a more cross-browser
 * compatible selector engine like Sizzle.js, for which this
 * file is API compatible.
 */
define(function() {
	var documentElement = document.documentElement;
	var indexOf = Array.prototype.indexOf;
	var reduce = Array.prototype.reduce;

	/**
	 * The primary selector "engine" responsible
	 * for finding the elements in a given subtree
	 * and writing them into the "out" array-like object.
	 *
	 * @param {String} selector
	 * @param {DOMElement|DOMDocument} context
	 * @param {Object|Array} out
	 */
	function select(selector, context, out) {
		if (!context) {
			context = documentElement;
		}
		if (!out) {
			out = [];
		}
		var matches = context.querySelectorAll(selector);
		for (var i = 0, len = matches.length; i < len; i++) {
			out.push(matches[i]);
		}
		return out;
	}

	/**
	 * Determine if the given node matches the given selector
	 *
	 * @param {DOMElement} element
	 * @param {String} selector
	 * @return {Boolean}
	 */
	select.matchesSelector = (
		documentElement.matchesSelector ? function(element, selector) { return element.matchesSelector(selector); } :
		documentElement.webkitMatchesSelector ? function(element, selector) { return element.webkitMatchesSelector(selector); } :
		documentElement.mozMatchesSelector ? function(element, selector) { return element.mozMatchesSelector(selector); } :
		documentElement.msMatchesSelector ? function(element, selector) { return element.msMatchesSelector(selector); } :
		function(element, selector) {
			return indexOf.call(document.documentElement.querySelectorAll(selector), this) > -1;
		}
	);

	/**
	 * Filter a set of elements against a given selector
	 *
	 * @param {String} selector
	 * @param {Object|Array} elements
	 * @return {Array}
	 */
	select.matches = function(selector, elements) {
		return reduce.call(elements, function(result, element) {
			if (select.matchesSelector(element, selector)) {
				result.push(element);
			}
			return result;
		}, []);
	};

	return select;
});
