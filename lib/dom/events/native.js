"use strict";

define(function(require, exports) {
	var NATIVE_EVENT_PREFIX = '_ministry_';
	var util = require('../../util');

	/**
	 * Helper function to translate an event name from the specified name
	 * to the name used for event dispatch
	 * @private
	 *
	 * @param {String} eventName
	 * @return {String}
	 */
	exports.toDispatchType = function(eventName) {
		return (isNativeEvent(eventName)
				? NATIVE_EVENT_PREFIX + eventName
				: eventName);
	}

	/**
	 * Helper function to translate a dispatched event name into the
	 * original type bound/triggered
	 * @private
	 *
	 * @param {String} eventName
	 * @return {String}
	 */
	exports.toOriginalType = function(eventName) {
		return (eventName.indexOf(NATIVE_EVENT_PREFIX) === 0
				? eventName.substr(NATIVE_EVENT_PREFIX.length)
				: eventName);
	}

	/**
	 * Determine if an event name corresponds to a native event
	 *
	 * @param {String} eventName
	 * @return {Boolean}
	 */
	var isNativeEvent = exports.isNativeEvent = function(eventName) {
		return (eventName in nativeEvents);
	}

	/**
	 * Configure a new event to translate into a special event
	 *
	 * @param {String} eventName
	 * @param {Object} config
	 */
	exports.configureEvent = function(eventName, config) {
		if (!nativeEvents[eventName]) {
			nativeEvents[eventName] = { type: "Event" };
		}
		if (config) {
			util.extend(nativeEvents[eventName], config);
		}
	}

	var nativeEvents = exports.events = {
		abort: { type: "Event" },
		// Requires Gecko 6
		//afterprint: { type: "Event" },
		animationend: { type: "AnimationEvent" },
		animationiteration: { type: "AnimationEvent" },
		animationstart: { type: "AnimationEvent" },
		audioprocess: { type: "AudioProcessingEvent" },
		// Requires Gecko 6
		//beforeprint: { type: "Event" },
		beforeunload: { type: "BeforeUnloadEvent" },
		beginEvent: { type: "TimeEvent" },
		//blocked: { type: " " },
		blur: { type: "FocusEvent" },
		cached: { type: "Event" },
		canplay: { type: "Event" },
		canplaythrough: { type: "Event" },
		change: { type: "Event",
			setup: function() {
				document.addEventListener('focus', function(evt) {
					if ('value' in evt.target) {
						evt.target.oldValue = evt.target.value;
					}
				}, true);
			},
			data: function(evt) {
				return {
					oldValue: evt.target.oldValue,
					newValue: evt.target.value
				};
			}
		},
		chargingchange: { type: "Event" },
		chargingtimechange: { type: "Event" },
		checking: { type: "Event" },
		click: { type: "MouseEvent" },
		close: { type: "Event" },
		// Unimplemented
		//compassneedscalibration: { type: "SensorEvent" },
		complete: { type: "OfflineAudioCompletionEvent" },
		// Requires Gecko 9
		//compositionend: { type: "CompositionEvent" },
		// Requires Gecko 9
		//compositionstart: { type: "CompositionEvent" },
		// Requires Gecko 9
		//compositionupdate: { type: "CompositionEvent" },
		contextmenu: { type: "MouseEvent" },
		copy: { type: "ClipboardEvent" },
		cut: { type: "ClipboardEvent" },
		dblclick: { type: "MouseEvent" },
		devicelight: { type: "DeviceLightEvent" },
		devicemotion: { type: "DeviceMotionEvent" },
		deviceorientation: { type: "DeviceOrientationEvent" },
		deviceproximity: { type: "DeviceProximityEvent" },
		dischargingtimechange: { type: "Event" },
		// Deprecated
		DOMActivate: { type: "UIEvent" },
		// Deprecated
		DOMAttributeNameChanged: { type: "MutationNameEvent" },
		// Deprecated
		DOMAttrModified: { type: "MutationEvent" },
		// Deprecated
		DOMCharacterDataModified: { type: "MutationEvent" },
		DOMContentLoaded: { type: "Event" },
		// Deprecated
		DOMElementNameChanged: { type: "MutationNameEvent" },
		// Deprecated, Unimplemented
		//DOMFocusIn: { type: "FocusEvent" },
		// Deprecated, Unimplemented
		//DOMFocusOut: { type: "FocusEvent" },
		// Deprecated
		DOMNodeInserted: { type: "MutationEvent" },
		// Deprecated
		DOMNodeInsertedIntoDocument: { type: "MutationEvent" },
		// Deprecated
		DOMNodeRemoved: { type: "MutationEvent" },
		// Deprecated
		DOMNodeRemovedFromDocument: { type: "MutationEvent" },
		// Deprecated
		DOMSubtreeModified: { type: "MutationEvent" },
		downloading: { type: "Event" },
		drag: { type: "DragEvent" },
		dragend: { type: "DragEvent" },
		dragenter: { type: "DragEvent" },
		dragleave: { type: "DragEvent" },
		dragover: { type: "DragEvent" },
		dragstart: { type: "DragEvent" },
		drop: { type: "DragEvent" },
		durationchange: { type: "Event" },
		emptied: { type: "Event" },
		ended: { type: "Event" },
		endEvent: { type: "TimeEvent" },
		error: { type: "Event" },
		focus: { type: "FocusEvent" },
		// Unimplemented (see https://bugzilla.mozilla.org/show_bug.cgi?id=687787)
		//focusin: { type: "FocusEvent" },
		// Unimplemented (see https://bugzilla.mozilla.org/show_bug.cgi?id=687787)
		//focusout: { type: "FocusEvent" },
		// Requires Gecko 9
		//fullscreenchange: { type: "Event" },
		// Requires Gecko 9
		//fullscreenerror: { type: "Event" },
		gamepadconnected: { type: "GamepadEvent" },
		gamepaddisconnected: { type: "GamepadEvent" },
		hashchange: { type: "HashChangeEvent" },
		input: { type: "Event" },
		invalid: { type: "Event" },
		keydown: { type: "KeyboardEvent" },
		keypress: { type: "KeyboardEvent" },
		keyup: { type: "KeyboardEvent" },
		levelchange: { type: "Event" },
		load: { type: "ProgressEvent" },
		loadeddata: { type: "Event" },
		loadedmetadata: { type: "Event" },
		loadend: { type: "ProgressEvent" },
		loadstart: { type: "ProgressEvent" },
		message: { type: "MessageEvent" },
		mousedown: { type: "MouseEvent" },
		mouseenter: { type: "MouseEvent" },
		mouseleave: { type: "MouseEvent" },
		mousemove: { type: "MouseEvent" },
		mouseout: { type: "MouseEvent" },
		mouseover: { type: "MouseEvent" },
		mouseup: { type: "MouseEvent" },
		noupdate: { type: "Event" },
		obsolete: { type: "Event" },
		offline: { type: "Event" },
		online: { type: "Event" },
		open: { type: "Event" },
		orientationchange: { type: "Event" },
		pagehide: { type: "PageTransitionEvent" },
		pageshow: { type: "PageTransitionEvent" },
		paste: { type: "ClipboardEvent" },
		pause: { type: "Event" },
		pointerlockchange: { type: "Event" },
		pointerlockerror: { type: "Event" },
		play: { type: "Event" },
		playing: { type: "Event" },
		popstate: { type: "PopStateEvent" },
		progress: { type: "ProgressEvent" },
		ratechange: { type: "Event" },
		readystatechange: { type: "Event" },
		repeatEvent: { type: "TimeEvent" },
		reset: { type: "Event" },
		resize: { type: "UIEvent" },
		scroll: { type: "UIEvent" },
		seeked: { type: "Event" },
		seeking: { type: "Event" },
		select: { type: "UIEvent" },
		show: { type: "MouseEvent" },
		stalled: { type: "Event" },
		storage: { type: "StorageEvent" },
		submit: { type: "Event" },
		success: { type: "Event" },
		suspend: { type: "Event" },
		SVGAbort: { type: "SVGEvent" },
		SVGError: { type: "SVGEvent" },
		SVGLoad: { type: "SVGEvent" },
		SVGResize: { type: "SVGEvent" },
		SVGScroll: { type: "SVGEvent" },
		SVGUnload: { type: "SVGEvent" },
		SVGZoom: { type: "SVGZoomEvent" },
		timeout: { type: "ProgressEvent" },
		timeupdate: { type: "Event" },
		touchcancel: { type: "TouchEvent" },
		touchend: { type: "TouchEvent" },
		touchenter: { type: "TouchEvent" },
		touchleave: { type: "TouchEvent" },
		touchmove: { type: "TouchEvent" },
		touchstart: { type: "TouchEvent" },
		transitionend: { type: "TransitionEvent" },
		unload: { type: "UIEvent" },
		updateready: { type: "Event" },
		upgradeneeded: " ",
		userproximity: { type: "SensorEvent" },
		versionchange: " ",
		visibilitychange: { type: "Event" },
		volumechange: { type: "Event" },
		waiting: { type: "Event" },
		// Requires Gecko 17
		//wheel: { type: "WheelEvent" }
	};
});
