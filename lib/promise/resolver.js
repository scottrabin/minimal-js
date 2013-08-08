"use strict";

define(function(require) {
	var createClass = require('../main');
	var is = require('../util/is');

	var startIndex = {
		"fulfilled": 0,
		"rejected":  1
	};

	/**
	 * Iterate through the callbacks and invoke the ones
	 * relevant to the resolved state
	 * @private
	 *
	 */
	function resolve(promise, state, value) {
		if (promise._state !== 'pending') {
			return;
		}

		promise._state = state;
		promise._value = value;
		for (var i = startIndex[state], len = promise._callbacks.length; i < len; i += 2) {
			promise._callbacks[i](value);
		}
		promise._callbacks = null;
	}

	function PromiseResolver(prototype, Static) {
		/**
		 * Fulfill the associated promise with the given value
		 *
		 * @param {*} value
		 */
		prototype.fulfill = function(value) {
			resolve(this._promise, 'fulfilled', value);
		};

		/**
		 * Reject the associated promise for the given reason
		 *
		 * @param {*} reason
		 */
		prototype.reject = function(reason) {
			resolve(this._promise, 'rejected', reason);
		};

		prototype.after('initialize', function(promise) {
			this._promise = promise;
		});
	}

	return createClass(PromiseResolver);
});
