"use strict";

define(function(require) {
	var selectorEngine = require('./selector');
	var domUtils = require('./util');

	return {
		/**
		 * Transform the set of elements into a set containing the
		 * nearest ancestor element matching the provided selector or function
		 *
		 * @param {String|Function} selector
		 * @return {DOM.Core}
		 */
		closest: function(selector) {
			var matcher = domUtils.matcher(selector);
			return this.reduce(function(result, node) {
				do {
					if (matcher(node)) {
						result.push(node);
						break;
					}
				} while (node = node.parentNode);
				return result;
			}, this.constructor.create());
		},
		children: function() {
			return this.reduce(function(result, node) {
				for (var i = 0, len = node.children.length; i < len; i++) {
					result.push(node.children[i]);
				}
				return result;
			}, this.constructor.create());
		},
		select: function(selector) {
			var matcher = domUtils.matcher(selector);
			return this.reduce(function(result, node) {
				return selectorEngine(selector, node, result);
			}, this.constructor.create());
		}
	};
});
