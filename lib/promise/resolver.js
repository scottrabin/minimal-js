"use strict";

define(function(require) {
	var createClass = require('../main');
	var is = require('../util/is');

	/**
	 * Iterate through the callbacks and invoke the ones
	 * relevant to the resolved state
	 * @private
	 *
	 * @param {Promise} promise
	 * @param {String} state
	 * @param {*} value
	 */
	function resolve(promise, state, value) {
		if (promise._state !== 'pending') {
			return;
		}

		promise._state = state;
		promise._value = value;
		var callbacks = promise._callbacks[state];
		for (var i = 0, len = callbacks.length; i < len; i++) {
			callbacks[i](value);
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

		/**
		 * Spec-described function that attempts to fulfill the resolver's
		 * associated promise with a given value, deferring the resolution
		 * of the promise if the given value is itself a promise.
		 *
		 * @param {*} value
		 */
		prototype.resolve = function(value) {
			var then = null;

			if (is.object(value)) {
				try {
					then = value.then;
				} catch (e) {
					this.reject(e);
					return;
				}
				if (is.fn(then)) {
					var fulfillCallback = this.fulfill.bind(this);
					var rejectCallback  = this.reject.bind(this);
					try {
						then.call(value, fulfillCallback, rejectCallback);
					} catch (e) {
						this.reject(e);
					}
					return;
				}
			}
			this.fulfill(value);
		};

		prototype.after('initialize', function(promise) {
			this._promise = promise;
		});
	}

	return createClass(PromiseResolver);
});
