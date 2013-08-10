"use strict";

define(function(require, exports) {
	var NATIVE_EVENT_PREFIX = '_ministry_';

	var nativeEvents = {
		abort: "Event",
		// Requires Gecko 6
		//afterprint: "Event",
		animationend: "AnimationEvent",
		animationiteration: "AnimationEvent",
		animationstart: "AnimationEvent",
		audioprocess: "AudioProcessingEvent",
		// Requires Gecko 6
		//beforeprint: "Event",
		beforeunload: "BeforeUnloadEvent",
		beginEvent: "TimeEvent",
		blocked: " ",
		blur: "FocusEvent",
		cached: "Event",
		canplay: "Event",
		canplaythrough: "Event",
		change: "Event",
		chargingchange: "Event",
		chargingtimechange: "Event",
		checking: "Event",
		click: "MouseEvent",
		close: "Event",
		// Unimplemented
		//compassneedscalibration: "SensorEvent",
		complete: "OfflineAudioCompletionEvent",
		// Requires Gecko 9
		//compositionend: "CompositionEvent",
		// Requires Gecko 9
		//compositionstart: "CompositionEvent",
		// Requires Gecko 9
		//compositionupdate: "CompositionEvent",
		contextmenu: "MouseEvent",
		copy: "ClipboardEvent",
		cut: "ClipboardEvent",
		dblclick: "MouseEvent",
		devicelight: "DeviceLightEvent",
		devicemotion: "DeviceMotionEvent",
		deviceorientation: "DeviceOrientationEvent",
		deviceproximity: "DeviceProximityEvent",
		dischargingtimechange: "Event",
		// Deprecated
		DOMActivate: "UIEvent",
		// Deprecated
		DOMAttributeNameChanged: "MutationNameEvent",
		// Deprecated
		DOMAttrModified: "MutationEvent",
		// Deprecated
		DOMCharacterDataModified: "MutationEvent",
		DOMContentLoaded: "Event",
		// Deprecated
		DOMElementNameChanged: "MutationNameEvent",
		// Deprecated, Unimplemented
		//DOMFocusIn: "FocusEvent",
		// Deprecated, Unimplemented
		//DOMFocusOut: "FocusEvent",
		// Deprecated
		DOMNodeInserted: "MutationEvent",
		// Deprecated
		DOMNodeInsertedIntoDocument: "MutationEvent",
		// Deprecated
		DOMNodeRemoved: "MutationEvent",
		// Deprecated
		DOMNodeRemovedFromDocument: "MutationEvent",
		// Deprecated
		DOMSubtreeModified: "MutationEvent",
		downloading: "Event",
		drag: "DragEvent",
		dragend: "DragEvent",
		dragenter: "DragEvent",
		dragleave: "DragEvent",
		dragover: "DragEvent",
		dragstart: "DragEvent",
		drop: "DragEvent",
		durationchange: "Event",
		emptied: "Event",
		ended: "Event",
		endEvent: "TimeEvent",
		error: "Event",
		focus: "FocusEvent",
		// Unimplemented (see https://bugzilla.mozilla.org/show_bug.cgi?id=687787)
		//focusin: "FocusEvent",
		// Unimplemented (see https://bugzilla.mozilla.org/show_bug.cgi?id=687787)
		//focusout: "FocusEvent",
		// Requires Gecko 9
		//fullscreenchange: "Event",
		// Requires Gecko 9
		//fullscreenerror: "Event",
		gamepadconnected: "GamepadEvent",
		gamepaddisconnected: "GamepadEvent",
		hashchange: "HashChangeEvent",
		input: "Event",
		invalid: "Event",
		keydown: "KeyboardEvent",
		keypress: "KeyboardEvent",
		keyup: "KeyboardEvent",
		levelchange: "Event",
		load: "ProgressEvent",
		loadeddata: "Event",
		loadedmetadata: "Event",
		loadend: "ProgressEvent",
		loadstart: "ProgressEvent",
		message: "MessageEvent",
		mousedown: "MouseEvent",
		mouseenter: "MouseEvent",
		mouseleave: "MouseEvent",
		mousemove: "MouseEvent",
		mouseout: "MouseEvent",
		mouseover: "MouseEvent",
		mouseup: "MouseEvent",
		noupdate: "Event",
		obsolete: "Event",
		offline: "Event",
		online: "Event",
		open: "Event",
		orientationchange: "Event",
		pagehide: "PageTransitionEvent",
		pageshow: "PageTransitionEvent",
		paste: "ClipboardEvent",
		pause: "Event",
		pointerlockchange: "Event",
		pointerlockerror: "Event",
		play: "Event",
		playing: "Event",
		popstate: "PopStateEvent",
		progress: "ProgressEvent",
		ratechange: "Event",
		readystatechange: "Event",
		repeatEvent: "TimeEvent",
		reset: "Event",
		resize: "UIEvent",
		scroll: "UIEvent",
		seeked: "Event",
		seeking: "Event",
		select: "UIEvent",
		show: "MouseEvent",
		stalled: "Event",
		storage: "StorageEvent",
		submit: "Event",
		success: "Event",
		suspend: "Event",
		SVGAbort: "SVGEvent",
		SVGError: "SVGEvent",
		SVGLoad: "SVGEvent",
		SVGResize: "SVGEvent",
		SVGScroll: "SVGEvent",
		SVGUnload: "SVGEvent",
		SVGZoom: "SVGZoomEvent",
		timeout: "ProgressEvent",
		timeupdate: "Event",
		touchcancel: "TouchEvent",
		touchend: "TouchEvent",
		touchenter: "TouchEvent",
		touchleave: "TouchEvent",
		touchmove: "TouchEvent",
		touchstart: "TouchEvent",
		transitionend: "TransitionEvent",
		unload: "UIEvent",
		updateready: "Event",
		upgradeneeded: " ",
		userproximity: "SensorEvent",
		versionchange: " ",
		visibilitychange: "Event",
		volumechange: "Event",
		waiting: "Event",
		// Requires Gecko 17
		//wheel: "WheelEvent"
	};

	/**
	 * Helper function to translate an event name from the specified name
	 * to the name used for event dispatch
	 * @private
	 *
	 * @param {String} eventName
	 * @return {String}
	 */
	function getDispatchEventName(eventName) {
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
	function getOriginalEventName(eventName) {
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
	function isNativeEvent(eventName) {
		return (eventName in nativeEvents);
	}

	exports.toDispatchType = getDispatchEventName;
	exports.toOriginalType = getOriginalEventName;
	exports.isNativeEvent  = isNativeEvent;
});
