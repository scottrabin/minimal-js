"use strict";

define(function(require) {
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
	});
});
