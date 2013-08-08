"use strict";

define(function(require) {
	var createClass = require('../main');
	var PromiseResolver = require('./resolver');
	var is = require('../util/is');

	var __hasOwn = Object.prototype.hasOwnProperty;

	var STATE_FULFILLED = 'fulfilled';
	var STATE_REJECTED  = 'rejected';
	var STATE_PENDING   = 'pending';

	/**
	 * Invoke a callback attached to a promise, either passing the
	 * value directly or through a given function
	 * @private
	 *
	 * @param {PromiseResolver} resolver
	 * @param {String} resolvedState
	 * @param {Function} callback
	 * @param {*} value
	 */
	function invokeCallback(resolver, resolvedState, callback, value) {
		setTimeout(function() {
			if (is.fn(callback)) {
				try {
					value = callback(value);
					resolvedState = STATE_FULFILLED;
				} catch (e) {
					resolver.reject(e);
				}
			}
			if (isPromise(value)) {
				value.then(
					resolver.fulfill.bind(resolver),
					resolver.reject.bind(resolver)
				);
			} else if (resolvedState === STATE_FULFILLED) {
				resolver.fulfill(value);
			} else {
				resolver.reject(value);
			}
		}, 0);
	}

	/**
	 * Determine if a value is a promise or not
	 *
	 * @param {*} maybePromise
	 * @return {Boolean}
	 */
	function isPromise(maybePromise) {
		return !!maybePromise && is.fn(maybePromise.then);
	}

	function Promise(prototype, Static) {
		Static.isPromise = isPromise;

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
				if (state === STATE_PENDING) {
					callbacks.push(
						function(val) {
							invokeCallback(resolver, STATE_FULFILLED, onFulfill, val);
						},
						function(val) {
							invokeCallback(resolver, STATE_REJECTED, onReject, val);
						}
					);
				} else if (state === STATE_FULFILLED) {
					invokeCallback(resolver, STATE_FULFILLED, onFulfill, value);
				} else if (state === STATE_REJECTED) {
					invokeCallback(resolver, STATE_REJECTED, onReject, value);
				}
			});
		};

		prototype.after('initialize', function(callback) {
			this._callbacks = [];

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
