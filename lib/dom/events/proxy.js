"use strict";

define(function(require) {
	var createClass = require('../../main');
	var nativeEvents = require('./native');

	function EventProxy(prototype, Static) {
		// default values for specific properties
		prototype.bubbles = null;
		prototype.cancelable = null;
		prototype.currentTarget = null;
		prototype.defaultPrevented = false;
		prototype.detail = null;
		// prototype.eventPhase = null;
		prototype.target = null;
		prototype.timeStamp = null;
		prototype.type = null;
		// private properties
		prototype._event = null;

		// interface compatibility only
		/*
		prototype.initEvent = function(type, bubbles, cancelable) {
		};
		*/

		prototype.preventDefault = function() {
			this.defaultPrevented = true;
			this._event.preventDefault();
		};

		// TODO - decide how to support this method
		/*
		prototype.stopImmediatePropagation = function() {
		};
		*/

		prototype.stopPropagation = function() {
			this.propagationStopped = true;
			this._event.stopPropagation();
		};

		prototype.after('initialize', function(evt) {
			this._event = evt;

			this.bubbles = evt.bubbles;
			this.cancelable = evt.cancelable;
			this.currentTarget = evt.currentTarget;
			this.detail = evt.detail;
			// this.eventPhase = null;
			this.target = evt.target;
			this.timeStamp = evt.timeStamp;
			this.type = nativeEvents.toOriginalType(evt.type);
		});
	}

	return createClass(EventProxy);
});
