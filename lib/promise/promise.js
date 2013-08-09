"use strict";

define(function(require) {
	var createClass = require('../main');
	var PromiseResolver = require('./resolver');
	var is = require('../util/is');

	var STATE_FULFILLED = 'fulfilled';
	var STATE_REJECTED  = 'rejected';
	var STATE_PENDING   = 'pending';

	/**
	 * Create a callback function suitable for use when
	 * generating a secondary promise via `promise.then`
	 * @private
	 *
	 * @param {PromiseResolver} resolver
	 * @param {Function} resolverFunction (either resolver.fulfill or resolver.reject)
	 * @param {Function} callback
	 * @return {Function}
	 */
	function getResolutionFunction(resolver, resolverFunction, callback) {
		if (is.fn(callback)) {
			return function(arg) {
				try {
					var value = callback.call(resolver._promise, arg);
				} catch (e) {
					resolver.reject(e);
				}
				resolver.resolve(value);
			};
		} else {
			return resolverFunction.bind(resolver);
		}
	}

	function Promise(prototype, Static) {
		/**
		 * Determine if a value is a promise or not
		 *
		 * @param {*} maybePromise
		 * @return {Boolean}
		 */
		Static.isPromise = function(maybePromise) {
			return !!maybePromise && is.fn(maybePromise.then);
		}

		/**
		 * Create and return a new promise fulfilled with the given value
		 *
		 * @param {*} value
		 * @return {Promise}
		 */
		Static.of = function(value) {
			return this.create(function(resolver) {
				resolver.fulfill(value);
			});
		};

		/**
		 * Create and return a new promise rejected with the given reason
		 *
		 * @param {*} value
		 * @return {Promise}
		 */
		Static.reject = function(reason) {
			return this.create(function(resolver) {
				resolver.reject(reason);
			});
		};

		prototype._state = STATE_PENDING;
		prototype._callbacks = null;

		/**
		 *
		 * @param {Function} onFulfill
		 * @param {Function} onReject
		 * @return {Promise}
		 */
		prototype.then = function(onFulfill, onReject) {
			var callbacks = this._callbacks;
			var state = this._state;
			var value = this._value;
			return this.constructor.create(function(resolver) {
				var fulfillWrapper = getResolutionFunction(resolver, resolver.fulfill, onFulfill);
				var rejectWrapper  = getResolutionFunction(resolver, resolver.reject, onReject);
				if (state === STATE_PENDING) {
					callbacks[STATE_FULFILLED].push(fulfillWrapper);
					callbacks[STATE_REJECTED].push(rejectWrapper);
				} else if (state === STATE_FULFILLED) {
					setTimeout(fulfillWrapper.bind(null, value), 0);
				} else if (state === STATE_REJECTED) {
					setTimeout(rejectWrapper.bind(null, value), 0);
				}
			});
		};

		prototype.after('initialize', function(callback) {
			this._callbacks = {};
			this._callbacks[STATE_FULFILLED] = [];
			this._callbacks[STATE_REJECTED]  = [];

			var resolver = PromiseResolver.create(this);

			try {
				callback(resolver);
			} catch (e) {
				resolver.reject(e);
			}
		});
	}

	return createClass(Promise);
});
