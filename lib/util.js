"use strict";

define(function(require, exports) {
	exports.noop = function() {};
	exports.ident = function(i) { return i; };

	exports.extend = function(target, hash) {
		for (var prop in hash) {
			if (hash.hasOwnProperty(prop)) {
				target[prop] = hash[prop];
			};
		}
		return target;
	};

	/**
	 * Create a namespace on a host object and return the new namespace
	 *
	 * @param {Object} host
	 * @param {String...}
	 * @return {Object}
	 */
	exports.namespace = function(host) {
		Array.prototype.slice.call(arguments, 1).forEach(function(ns) {
			if (!host[ns]) {
				host[ns] = {};
			}
			host = host[ns];
		});
		return host;
	};
});
