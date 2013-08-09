"use strict";

/**
 * Cherry-picked version of
 * https://github.com/scottrabin/is-js
 */
define({
	fn: function(fn) {
		return (typeof fn == 'function');
	},
	string: function(str) {
		return (typeof str == 'string' || str instanceof String);
	},
	array: function(arr) {
		// either an array or array-like
		return Array.isArray(arr) || (arr && arr.length && typeof arr.splice == 'function');
	},
	object: function(obj) {
		return (obj === Object(obj));
	},
	element: (typeof HTMLElement != 'undefined'
			  ? function(el) { return (el instanceof HTMLElement); }
			  : function(el) { return (el && el.nodeType === 1); }
			 )
});
