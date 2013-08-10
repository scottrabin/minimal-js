"use strict";

define(function(require) {
	var DOM = require('dom/core').mix(require('dom/events'));

	describe("dom/events", function() {
		beforeEach(function() {
			this.element1 = jasmine.createFixture('<div class="one"></div>');
			this.element1child = jasmine.createElement('<p class="one child"></p>');
			this.element1grandchild = jasmine.createElement('<span class="one grandchild">text</span>');
			this.element1focuschild = jasmine.createElement('<input type="text" name="test" value="inputTestValue" />');
			this.element2 = jasmine.createFixture('<div class="two"></div>');
			this.element2child = jasmine.createElement('<p class="two child"></p>');
			this.element2grandchild = jasmine.createElement('<span class="two grandchild">text</span>');

			this.element1.appendChild(this.element1child);
			this.element1child.appendChild(this.element1grandchild);
			this.element1.appendChild(this.element1focuschild);
			this.element2.appendChild(this.element2child);
			this.element2child.appendChild(this.element2grandchild);

			this.set = DOM([this.element1, this.element2]);
		});

		describe(".resolveEventDelegate", function() {
			it("should return the element matching the given selector between the two nodes", function() {
				var match = DOM.resolveDelegateSelector(this.element2, this.element2grandchild, '.child');
				expect(match).toBe(this.element2child);

				match = DOM.resolveDelegateSelector(this.element2, this.element2grandchild, '.grandchild');
				expect(match).toBe(this.element2grandchild);
			});
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

			describe("when given an eventName and an object implementing the `EventListener` interface", function() {
				it("should add the object as an event listener to each element in the set", function() {
					var interfaceImplementer = {
						handleEvent: jasmine.createSpy('handleEvent')
					};

					this.set.on('arbitraryEvent', interfaceImplementer);
					jasmine.triggerEvent(this.element1, 'arbitraryEvent');
					jasmine.triggerEvent(this.element2, 'arbitraryEvent');

					expect(interfaceImplementer.handleEvent.callCount).toBe(2);
					expect(interfaceImplementer.handleEvent.calls[0].args[0].target).toBe(this.element1);
					expect(interfaceImplementer.handleEvent.calls[1].args[0].target).toBe(this.element2);
				});
			});

			describe("when given an eventName, a selector, and a callback", function() {
				it("should add the callback as an event listener to each element in the set and call it with the event properties correctly set", function() {
					var spy = jasmine.createSpy('event listener');

					this.set.on('arbitraryEvent', '.child', spy);
					jasmine.triggerEvent(this.element1grandchild, 'arbitraryEvent');

					expect(spy.mostRecentCall.args[0].currentTarget).toBe(this.element1);
					expect(spy.mostRecentCall.args[0].target).toBe(this.element1child);
				});
			});

			describe("when given an eventName, a selector, and an object implementing the `EventListener` interface", function() {
				it("should add the object as an event listener to each element in the set and replace the `target` with the element matching the given selector", function() {
					var interfaceImplementer = {
						handleEvent: jasmine.createSpy('handleEvent')
					};

					this.set.on('arbitraryEvent', '.child', interfaceImplementer);
					jasmine.triggerEvent(this.element1grandchild, 'arbitraryEvent');

					expect(interfaceImplementer.handleEvent.mostRecentCall.args[0].currentTarget).toBe(this.element1);
					expect(interfaceImplementer.handleEvent.mostRecentCall.args[0].target).toBe(this.element1child);
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

			describe("when given an eventName and an object implementing the `EventListener` interface", function() {
				it("should remove the object as an event listener from each element in the set", function() {
					var interfaceImplementer = {
						handleEvent: jasmine.createSpy('handleEvent')
					};

					this.set.on('arbitraryEvent', interfaceImplementer);
					jasmine.triggerEvent(this.element1, 'arbitraryEvent');
					jasmine.triggerEvent(this.element2, 'arbitraryEvent');

					expect(interfaceImplementer.handleEvent.callCount).toBe(2);

					this.set.off('arbitraryEvent', interfaceImplementer);
					jasmine.triggerEvent(this.element1, 'arbitraryEvent');
					jasmine.triggerEvent(this.element2, 'arbitraryEvent');

					expect(interfaceImplementer.handleEvent.callCount).toBe(2);
				});
			});

			describe("when given an eventName, a selector, and a callback", function() {
				it("should remove the callback as an event listener from each element in the set", function() {
					var spy = jasmine.createSpy('event listener');

					this.set.on('arbitraryEvent', '.child', spy);
					jasmine.triggerEvent(this.element1grandchild, 'arbitraryEvent');

					expect(spy.callCount).toBe(1);

					this.set.off('arbitraryEvent', '.child', spy);
					jasmine.triggerEvent(this.element1grandchild, 'arbitraryEvent');

					expect(spy.callCount).toBe(1);
				});
			});

			describe("when given an eventName, a selector, and an object implementing the `EventListener` interface", function() {
				it("should remove the object as an event listener from each element in the set", function() {
					var interfaceImplementer = {
						handleEvent: jasmine.createSpy('handleEvent')
					};

					this.set.on('arbitraryEvent', '.child', interfaceImplementer);
					jasmine.triggerEvent(this.element1grandchild, 'arbitraryEvent');

					expect(interfaceImplementer.handleEvent.callCount).toBe(1);

					this.set.off('arbitraryEvent', '.child', interfaceImplementer);
					jasmine.triggerEvent(this.element1grandchild, 'arbitraryEvent');

					expect(interfaceImplementer.handleEvent.callCount).toBe(1);
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
