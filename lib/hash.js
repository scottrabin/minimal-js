"use strict";

define(function(require) {
	var createClass = require('./main');

	function Hash(prototype) {
		/**
		 * Iterate over each of the keys in the internal hash
		 *
		 * @param {Function} callback
		 * @param {*=} thisObject
		 */
		prototype.forEach = function(callback, thisObject) {
			for (var prop in this._object) {
				if (this._object.hasOwnProperty(prop)) {
					callback.call(thisObject || this, this._object[prop], prop, this._object);
				}
			}
		};

		prototype.after('initialize', function(obj) {
			this._object = obj || {};
		});
	}

	return createClass(
		require('./mixin/enumerable'),
		Hash
	);
});
