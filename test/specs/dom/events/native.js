"use strict";

define(function(require) {
	var DOM = require('dom/core').mix(require('dom/events'));
	var nativeEvents = require('dom/events/native');

	describe("dom/events/native", function() {
		describe(".toDispatchType", function() {
			it("should leave custom event names as is", function() {
				expect(nativeEvents.toDispatchType('custom_event_name')).toBe('custom_event_name');
			});

			it("should convert event names of native events to a modified version", function() {
				var originalName = 'change';
				expect(nativeEvents.toDispatchType(originalName)).not.toBe(originalName);
			});

			it("should be idempotent", function() {
				var originalName = 'change';
				var modifiedName = nativeEvents.toDispatchType(originalName);
				expect(nativeEvents.toDispatchType(modifiedName)).toBe(modifiedName);
			});
		});

		describe(".toOriginalType", function() {
			it("should leave custom event names as is", function() {
				expect(nativeEvents.toOriginalType('custom_event_name')).toBe('custom_event_name');
			});

			it("should convert modified event names back to the original name", function() {
				var originalName = 'change';
				var modifiedName = nativeEvents.toDispatchType(originalName);
				expect(modifiedName).not.toBe(originalName);
				expect(nativeEvents.toOriginalType(modifiedName)).toBe(originalName);
			});
		});

		describe("DOM.Events hooks", function() {
			beforeEach(function() {
				this.element1 = jasmine.createFixture('<div class="one"></div>');
				this.element1focuschild = jasmine.createElement('<input type="text" name="test" value="inputTestValue" />');
				this.element2 = jasmine.createFixture('<div class="two"></div>');
				this.element2child = jasmine.createElement('<p class="two child"></p>');

				this.element1.appendChild(this.element1focuschild);
				this.element2.appendChild(this.element2child);

				this.set = DOM([this.element1, this.element2]);

				this.configuredEventName = 'configuredEvent_' + this.id;
			});

			describe(".configureEvent", function() {
				it("should add the given event to the set of configured events", function() {
					expect(nativeEvents.events[this.configuredEventName]).not.toBeDefined();

					nativeEvents.configureEvent(this.configuredEventName, {});

					expect(nativeEvents.events[this.configuredEventName]).toBeDefined();
				});

				it("should default the type to 'Event'", function() {
					nativeEvents.configureEvent(this.configuredEventName, {});

					expect(nativeEvents.events[this.configuredEventName].type).toBe('Event');
				});
			});

			describe("#setup", function() {
				it("should only be invoked when a listener is bound to the event", function() {
					var spy = jasmine.createSpy('setup');

					nativeEvents.configureEvent(this.configuredEventName, {
						setup: spy
					});

					expect(spy).not.toHaveBeenCalled();

					this.set.on(this.configuredEventName, function(){});

					expect(spy).toHaveBeenCalled();
				});

				it("should only be invoked once", function() {
					var spy = jasmine.createSpy('setup');

					nativeEvents.configureEvent(this.configuredEventName, {
						setup: spy
					});

					this.set.on(this.configuredEventName, function(){});
					expect(spy.callCount).toBe(1);
					this.set.on(this.configuredEventName, function(){});
					expect(spy.callCount).toBe(1);
				});
			});

			describe("#data", function() {
				it("should provide the value of `detail` for the event when the event is triggered", function() {
					var eventDataSpy = jasmine.createSpy('eventData').andReturn('ok');
					var listenerSpy = jasmine.createSpy('event listener');

					nativeEvents.configureEvent(this.configuredEventName, {
						data: eventDataSpy
					});

					this.set.on(this.configuredEventName, listenerSpy);
					jasmine.triggerEvent(this.set[0], this.configuredEventName);

					expect(eventDataSpy).toHaveBeenCalled();
					expect(listenerSpy.mostRecentCall.args[0].detail).toBe('ok');
				});
			});

			describe("when binding an event listener to a native event", function() {
				it("should bind the event listener to a modified event name", function() {
					var spy = jasmine.createSpy('event listener');
					this.set.on('click', spy);

					jasmine.triggerEvent(this.set[0], 'click');
					expect(spy).toHaveBeenCalled();
					expect(spy.mostRecentCall.args[0]._event.type).toBe(nativeEvents.toDispatchType('click'));
				});

				it("should call the event spy with an event proxy using the original event name", function() {
					var spy = jasmine.createSpy('event listener');
					this.set.on('click', spy);

					jasmine.triggerEvent(this.set[0], nativeEvents.toDispatchType('click'));
					expect(spy.mostRecentCall.args[0].type).toBe('click');
				});

				it("should call preventDefault on the native event if the bound listener calls preventDefault", function() {
					this.set.on('click', function(evt) {
						evt.preventDefault();
					});

					var eventPrevented = jasmine.triggerEvent(this.set[0], 'click');
					expect(eventPrevented).toBe(false);
				});

				describe("when the native event does not normally bubble", function() {
					// TODO
					// it("should bubble DOMNodeRemovedFromDocument", function() {
					// });

					// TODO
					// it("should bubble DOMNodeInsertedIntoDocument", function() {
					// });

					// TODO
					// it("should bubble load", function() {
					// });

					// TODO
					// it("should bubble unload", function() {
					// });

					it("should bubble focus", function() {
						var spy = jasmine.createSpy('focus spy');
						this.set.on('focus', spy);

						this.element1focuschild.focus();

						waitsFor(function() {
							return document.activeElement === this.element1focuschild;
						}, 'focus child to gain focus', 100);

						runs(function() {
							expect(spy).toHaveBeenCalled();
						});
					});

					it("should bubble blur", function() {
						var spy = jasmine.createSpy('blur spy');
						this.set.on('blur', spy);

						runs(function() {
							this.element1focuschild.focus();
						});

						waitsFor(function() {
							return document.activeElement === this.element1focuschild;
						}, 'focus child to gain focus', 100);

						runs(function() {
							this.element1focuschild.blur();
						});

						waitsFor(function() {
							return document.activeElement !== this.element1focuschild;
						}, 'focus child to lose focus', 100);

						runs(function() {
							expect(spy).toHaveBeenCalled();
						});
					});
				});
			});

			describe("when removing an event listener bound to a native event", function() {
				it("should remove the event listener bound to a modified event name", function() {
					var spy = jasmine.createSpy('event listener');
					this.set.on('click', spy);

					jasmine.triggerEvent(this.set[0], nativeEvents.toDispatchType('click'));
					expect(spy.callCount).toBe(1);

					this.set.off('click', spy);
					jasmine.triggerEvent(this.set[0], nativeEvents.toDispatchType('click'));
					expect(spy.callCount).toBe(1);
				});
			});
		});
	});
});
