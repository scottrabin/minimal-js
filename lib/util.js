"use strict";

define(function(require, exports) {
	exports.noop = function() {};

	exports.extend = function(target, hash) {
		for (var prop in hash) {
			if (hash.hasOwnProperty(prop)) {
				target[prop] = hash[prop];
			};
		}
		return target;
	};
});
