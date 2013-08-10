"use strict";

define(function(require) {
	var EventProxy = require('dom/events/proxy');
	var nativeEvents = require('dom/events/native');

	describe("dom/events/proxy", function() {
		beforeEach(function() {
			this.source = {
				bubbles: true,
				cancelable: true,
				currentTarget: jasmine.createElement('div'),
				detail: {},
				// eventPhase: null,
				target: jasmine.createElement('span'),
				timeStamp: new Date().getTime(),
				type: 'eventType',
				preventDefault: jasmine.createSpy('preventDefault'),
				stopPropagation: jasmine.createSpy('stopPropagation')
			};
			this.proxy = EventProxy(this.source);
		});

		it("should copy properties from the source object", function() {
			expect(this.proxy.bubbles).toBe(true);
			expect(this.proxy.cancelable).toBe(true);
			expect(this.proxy.currentTarget).toBe(this.source.currentTarget);
			expect(this.proxy.detail).toBe(this.source.detail);
			expect(this.proxy.target).toBe(this.source.target);
			expect(this.proxy.timeStamp).toBe(this.source.timeStamp);
			expect(this.proxy.type).toBe(this.source.type);
		});

		describe("#preventDefault", function() {
			it("should call `preventDefault` on the source object", function() {
				this.proxy.preventDefault();

				expect(this.source.preventDefault).toHaveBeenCalled();
			});

			it("should set the `defaultPrevented` property to `true`", function() {
				this.proxy.preventDefault();

				expect(this.proxy.defaultPrevented).toBe(true);
			});
		});

		describe("#stopPropagation", function() {
			it("should call `stopPropagation` on the source object", function() {
				this.proxy.stopPropagation();

				expect(this.source.stopPropagation).toHaveBeenCalled();
			});
		});

		describe("when the proxied event is a custom event replacement for a native event", function() {
			beforeEach(function() {
				this.source = {
					bubbles: true,
					cancelable: true,
					currentTarget: jasmine.createElement('div'),
					detail: {},
					// eventPhase: null,
					target: jasmine.createElement('span'),
					timeStamp: new Date().getTime(),
					type: nativeEvents.toDispatchType('click'),
					preventDefault: jasmine.createSpy('preventDefault'),
					stopPropagation: jasmine.createSpy('stopPropagation')
				};
				this.proxy = EventProxy(this.source);
			});

			it("should translate the proxied event name into the original event name", function() {
				expect(this.source.type).not.toBe('click');
				expect(this.proxy.type).toBe('click');
			});
		});
	});
});
