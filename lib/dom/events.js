"use strict";

define(function(require) {
	var is = require('../util/is');
	var util = require('../util');
	var EventProxy = require('./events/proxy');

	var PROP_EVENT_PROXY = 'domevents_proxyfn';

	/**
	 * Create a function wrapper for a given callback
	 * to allow modifying callback arguments and proxying
	 * the event object with modifiable properties
	 */
	function getFunctionCallback(callback) {
		var ns = util.namespace(callback, '_ministry');

		if (!ns[PROP_EVENT_PROXY]) {
			var cb, context;
			if (is.fn(callback.handleEvent)) {
				cb = callback.handleEvent;
				context = callback;
			} else {
				cb = callback;
				context = null;
			}
			ns[PROP_EVENT_PROXY] = function(evt) {
				cb.call(context, EventProxy(evt));
			};
		}

		return ns[PROP_EVENT_PROXY];
	}

	return function DOMEvents(prototype, Static) {
		/**
		 * Attach an event listener to each element in the set
		 *
		 * @param {String} eventName
		 * @param {Function} callback
		 * @return this
		 */
		prototype.on = function(eventName, callback) {
			return this.forEach(function(node) {
				node.addEventListener(eventName, getFunctionCallback(callback), false);
			});
		};

		/**
		 * Remove an event listener from each element in the set
		 *
		 * @param {String} eventName
		 * @param {Function} callback
		 * @return this
		 */
		prototype.off = function(eventName, callback) {
			return this.forEach(function(node) {
				node.removeEventListener(eventName, getFunctionCallback(callback), false);
			});
		};

		/**
		 * Trigger an event from each element in the set
		 *
		 * @param {String} eventName
		 * @return this
		 */
		prototype.trigger = function(eventName) {
			return this.forEach(function(node) {
				var eventObject = document.createEvent('Events');
				eventObject.initEvent(eventName, true, true);
				node.dispatchEvent(eventObject);
			});
		};
	};
});
