"use strict";

function EventSpy(node, eventName) {
	this.node  = node;
	this.event = eventName;
	this.reset();

	node.addEventListener(eventName, this, false);

	jasmine.getEnv().currentSpec.after(this.destroy.bind(this));
};

EventSpy.prototype.handleEvent = function(event) {
	this.calls.push(event);
	this.callCount++;
};

EventSpy.prototype.reset = function() {
	this.calls = [];
	this.callCount = 0;
};

EventSpy.prototype.destroy = function() {
	this.node.removeEventListener(this.event, this, false);

	this.node  = null;
	this.event = null;
	this.calls = null;
};

EventSpy.prototype.toString = function() {
	return this.event + "@" + this.node.nodeName;
};

window.spyOnEvent = jasmine.createEventSpy = function(node, eventName) {
	return new EventSpy(node, eventName);
};

jasmine.triggerEvent = function(node, eventName, detail) {
	var event = document.createEvent('Events');
	event.initEvent(eventName, true, true);
	event.detail = detail;
	return node.dispatchEvent(event);
};
