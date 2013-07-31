"use strict";

define(function(require, exports) {
	var selectorEngine = require('./selector');
	var is = require('../util/is');
	/**
	 * Generate a matcher function to test nodes against
	 * a given function or a selector
	 *
	 * @param {Function|String} selector
	 * @return {Function(HTMLElement)}
	 */
	exports.matcher = function(selector) {
		return (is.fn(selector)
			   ? selector
			   : function(node) {
				   return selectorEngine.matchesSelector(node, selector);
			   });
	};
});
