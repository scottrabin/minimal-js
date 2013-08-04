"use strict";

define(function() {
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
				node.addEventListener(eventName, callback, false);
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
				node.removeEventListener(eventName, callback, false);
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
