"use strict";

define(function(require) {
	var Hash = require('hash');

	describe("Hash", function() {
		it("should iterate over properties attached directly to the internal object", function() {
			var obj = {
				one: 1,
				two: 2
			};

			var spy = jasmine.createSpy('Hash#forEach');
			Hash.create(obj).forEach(spy);

			expect(spy.calls[0].args).toEqual([1, 'one', obj]);
			expect(spy.calls[1].args).toEqual([2, 'two', obj]);
		});

		it("should not iterate over prototype properties of the internal object", function() {
			function Fake(){}
			Fake.prototype.badProperty = 'not ok';
			var instance = new Fake();
			instance.expando = 'ok';

			var spy = jasmine.createSpy('Hash#forEach');
			Hash.create(instance).forEach(spy);

			expect(spy.callCount).toBe(1);
			expect(spy.mostRecentCall.args).toEqual(['ok', 'expando', instance]);
		});

		it("should use the second parameter as the value of `this` if given", function() {
			var obj = { one: 1 };
			var context = {};
			var spy = jasmine.createSpy('Hash#forEach');
			Hash.create(obj).forEach(spy, context);

			expect(spy.mostRecentCall.object).toBe(context);
		});
	});
});
