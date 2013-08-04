"use strict";

define(function(require) {
	var DOM = require('dom/core').mix(require('dom/events'));

	describe("dom/events", function() {
		beforeEach(function() {
			this.element1 = jasmine.createFixture('<div class="one"></div>');
			this.element1child = jasmine.createElement('<span class="one-child">text</span>');
			this.element2 = jasmine.createFixture('<div class="two"></div>');
			this.element2child = jasmine.createElement('<span class="two-child">contents</span>');

			this.element1.appendChild(this.element1child);
			this.element2.appendChild(this.element2child);

			this.set = DOM([this.element1, this.element2]);
		});

		describe("#on", function() {
			it("should return the original object", function() {
				expect(this.set).toBe(this.set.on('anything', function(){}));
			});

			describe("when given an eventName and callback", function() {
				it("should add the callback as an event listener on each element in the set", function() {
					var callbackSpy = jasmine.createSpy('arbitraryEventCallback');
					this.set.on('arbitraryEvent', callbackSpy);
					jasmine.triggerEvent(this.element1, 'arbitraryEvent');
					jasmine.triggerEvent(this.element2, 'arbitraryEvent');

					expect(callbackSpy.callCount).toBe(2);
					expect(callbackSpy.calls[0].args[0].target).toBe(this.element1);
					expect(callbackSpy.calls[1].args[0].target).toBe(this.element2);
				});
			});
		});

		describe("#off", function() {
			it("should return the original object", function() {
				expect(this.set).toBe(this.set.off('anything', function(){}));
			});

			describe("when given an eventName and callback", function() {
				it("should remove the callback as an event listener from each element in the set", function() {
					var callbackSpy = jasmine.createSpy('arbitraryEventCallback');

					this.set.on('arbitraryEvent', callbackSpy);
					jasmine.triggerEvent(this.element1, 'arbitraryEvent');
					jasmine.triggerEvent(this.element2, 'arbitraryEvent');

					expect(callbackSpy.callCount).toBe(2);

					this.set.off('arbitraryEvent', callbackSpy);
					jasmine.triggerEvent(this.element1, 'arbitraryEvent');
					jasmine.triggerEvent(this.element2, 'arbitraryEvent');

					expect(callbackSpy.callCount).toBe(2);
				});
			});
		});

		describe("#trigger", function() {
			it("should return the original object", function() {
				expect(this.set).toBe(this.set.trigger('anything'));
			});

			describe("when called with an event type", function() {
				it("should trigger an event from each of the elements in the set", function() {
					var eventSpy = spyOnEvent(document, 'arbitraryEvent');

					this.set.trigger('arbitraryEvent');

					expect(eventSpy.callCount).toBe(2);
					expect(eventSpy.calls[0].target).toBe(this.element1);
					expect(eventSpy.calls[1].target).toBe(this.element2);
				});
			});
		});
	});
});
