"use strict";

define(function(require) {
	var is = require('../util/is');
	var util = require('../util');
	var selectorEngine = require('./selector');
	var nativeEvents = require('./events/native');
	var EventProxy = require('./events/proxy');

	var PROP_EVENT_PROXY = 'domevents_proxyfn';

	// Store the native events that have had proxy functions
	// bound for them
	var proxied_native_events = {};

	/**
	 * Create a function wrapper for a given callback
	 * to allow modifying callback arguments and proxying
	 * the event object with modifiable properties
	 * @private
	 *
	 * @param {Function|Object} callback
	 * @param {String=} selector
	 * @return {Function}
	 */
	function getFunctionCallback(callback, selector) {
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
			if (selector) {
				ns[PROP_EVENT_PROXY][selector] = function(evt) {
					var delegateTarget = resolveDelegateSelector(evt.currentTarget, evt.target, selector);
					if (delegateTarget !== null) {
						var proxy = EventProxy(evt);
						proxy.target = delegateTarget;
						cb.call(context, proxy);
					}
				};
			}
		}

		return (selector ? ns[PROP_EVENT_PROXY][selector] : ns[PROP_EVENT_PROXY]);
	}

	/**
	 * Resolve a selector to an element between two elements
	 *
	 * @param {HTMLElement} context
	 * @param {HTMLElement} target
	 * @param {String} selector
	 * @return {HTMLElement|null}
	 */
	function resolveDelegateSelector(context, target, selector) {
		var delegateTarget = target;
		do {
			if (selectorEngine.matchesSelector(delegateTarget, selector)) {
				return delegateTarget;
			}
		} while ((delegateTarget = delegateTarget.parentNode) && (delegateTarget !== context));
		return null;
	}

	/**
	 * Trigger a custom event from a node with the given data
	 *
	 * @param {HTMLElement} node
	 * @param {String} eventName
	 * @param {*} data
	 * @return {Boolean} if the event was prevented
	 */
	function trigger(node, eventName, data) {
		var eventObject = document.createEvent('Events');
		eventObject.initEvent(nativeEvents.toDispatchType(eventName), true, true);
		eventObject.detail = data;
		return node.dispatchEvent(eventObject);
	}

	/**
	 * Trigger a proxy event in place of a native event
	 *
	 * @param {Event} evt
	 */
	function proxyNativeEvent(evt) {
		var target = evt.target;
		var dispatchType = nativeEvents.toDispatchType(evt.type);
		var eventDataFn = nativeEvents.events[evt.type].data;
		var eventData = (is.fn(eventDataFn) ? eventDataFn(evt) : undefined);

		if ( !trigger(target, dispatchType, eventData) ) {
			evt.preventDefault();
		}
	}

	return function DOMEvents(prototype, Static) {
		Static.resolveDelegateSelector = resolveDelegateSelector;

		/**
		 * Attach an event listener to each element in the set.
		 * If the second argument is a string, use it as a delegate
		 * selector
		 *
		 * @param {String} eventName
		 * @param {String=} selector
		 * @param {Function} callback
		 * @return this
		 */
		prototype.on = function(eventName, selector, callback) {
			// normalize arguments
			if (!is.string(selector)) {
				callback = selector;
				selector = null;
			}
			// if it's a native event and it's not being proxied, proxy it
			if (nativeEvents.isNativeEvent(eventName) && !proxied_native_events[eventName]) {
				proxied_native_events[eventName] = true;
				document.addEventListener(eventName, proxyNativeEvent, true);
				if (is.fn(nativeEvents.events[eventName].setup)) {
					nativeEvents.events[eventName].setup();
				}
			}
			return this.forEach(function(node) {
				node.addEventListener(
					nativeEvents.toDispatchType(eventName),
					getFunctionCallback(callback, selector),
					false
				);
			});
		};

		/**
		 * Remove an event listener from each element in the set
		 * If the second argument is a string, remove the delegated
		 * event listener
		 *
		 * @param {String} eventName
		 * @param {String=} selector
		 * @param {Function} callback
		 * @return this
		 */
		prototype.off = function(eventName, selector, callback) {
			// normalize arguments
			if (!is.string(selector)) {
				callback = selector;
				selector = null;
			}
			return this.forEach(function(node) {
				node.removeEventListener(
					nativeEvents.toDispatchType(eventName),
					getFunctionCallback(callback, selector),
					false
				);
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
				trigger(node, eventName);
			});
		};
	};
});
