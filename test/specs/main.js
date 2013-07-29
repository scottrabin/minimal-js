"use strict";

define(function(require) {
	var create = require('main');

	describe("main", function() {
		it("should provide a function", function() {
			expect(typeof create).toBe('function');
		});

		describe("when creating a class", function() {
			it("should copy properties from the mixin to the prototype if the mixin is an object", function() {
				var mixin = {
					propertyOne: {},
					propertyTwo: {}
				};
				var constructedClass = create(mixin);

				expect(constructedClass.prototype.propertyOne).toBe(mixin.propertyOne);
				expect(constructedClass.prototype.propertyTwo).toBe(mixin.propertyTwo);
			});

			it("should invoke the function over the prototype if the mixin is a function", function() {
				var propOne = {};
				var propTwo = {};
				var mixin = function(prototype) {
					prototype.propertyOne = propOne;
					prototype.propertyTwo = propTwo;
				};
				var constructedClass = create(mixin);

				expect(constructedClass.prototype.propertyOne).toBe(propOne);
				expect(constructedClass.prototype.propertyTwo).toBe(propTwo);
			});

			it("should provide combinator methods during construction if the mixin is a function", function() {
				var mixin = function(prototype) {
					expect(typeof prototype.before).toBe('function');
					expect(typeof prototype.after).toBe('function');
					expect(typeof prototype.around).toBe('function');
					expect(typeof prototype.provided).toBe('function');
				};
				var constructedClass = create(mixin);
			});

			it("should not include a mixin more than once", function() {
				var mixin = jasmine.createSpy();

				var constructedClass = create(mixin, mixin);
				expect(mixin.callCount).toBe(1);
			});

			it("should extract individual mixins if a given mixin is a constructed class", function() {
				var mixin1 = jasmine.createSpy();
				var mixin2 = jasmine.createSpy();
				var mixin3 = create(mixin1);

				var constructedClass = create(mixin2, mixin3);

				// mixin1 is a part of both mixin3 and constructed class
				expect(mixin1.callCount).toBe(2);
				// mixin2 is only a part of the constructed class
				expect(mixin2.callCount).toBe(1);

				// try to include mixin1 again
				constructedClass.mix(mixin1);

				// it should do nothing
				expect(mixin1.callCount).toBe(2);
			});

			describe("when instantiating the created class", function() {
				describe("when using the constructed function", function() {
					it("should delegate to the ConstructedClass.create method when called directly", function() {
						var ConstructedClass = create({});
						spyOn(ConstructedClass, 'create');

						var instance = ConstructedClass();

						expect(ConstructedClass.create).toHaveBeenCalled();
					});

					it("should run the `initialize` method of the created class", function() {
						var initializeSpy = jasmine.createSpy('initialize');
						var ConstructedClass = create(function(prototype) {
							prototype.after('initialize', initializeSpy);
						});

						var instance = ConstructedClass();

						expect(initializeSpy).toHaveBeenCalled();
					});

					it("should run the `initialize` method with the given parameters", function() {
						var ConstructedClass = create(function(prototype) {
							prototype.after('initialize', jasmine.createSpy('initialize'));
						});

						var instance = ConstructedClass();
						expect(instance.initialize).toHaveBeenCalledWith();
						var instance2 = ConstructedClass('one');
						expect(instance2.initialize).toHaveBeenCalledWith('one');
						var instance3 = ConstructedClass(1, true);
						expect(instance3.initialize).toHaveBeenCalledWith(1, true);
						var instance4 = ConstructedClass(3, 'four', 'one');
						expect(instance4.initialize).toHaveBeenCalledWith(3, 'four', 'one');
						var instance5 = ConstructedClass(true, false, null, undefined);
						expect(instance5.initialize).toHaveBeenCalledWith(true, false, null, undefined);
					});
				});

				describe("when using ConstructedClass.create", function() {
					it("should run the `initialize` method of the created class", function() {
						var initializeSpy = jasmine.createSpy('initialize');
						var ConstructedClass = create(function(prototype) {
							prototype.after('initialize', initializeSpy);
						});

						var instance = ConstructedClass.create();

						expect(initializeSpy).toHaveBeenCalled();
					});

					it("should run the `initialize` method with the given parameters", function() {
						var ConstructedClass = create(function(prototype) {
							prototype.after('initialize', jasmine.createSpy('initialize'));
						});

						var instance = ConstructedClass.create();
						expect(instance.initialize).toHaveBeenCalledWith();
						var instance2 = ConstructedClass.create('one');
						expect(instance2.initialize).toHaveBeenCalledWith('one');
						var instance3 = ConstructedClass.create(1, true);
						expect(instance3.initialize).toHaveBeenCalledWith(1, true);
						var instance4 = ConstructedClass.create(3, 'four', 'one');
						expect(instance4.initialize).toHaveBeenCalledWith(3, 'four', 'one');
						var instance5 = ConstructedClass.create(true, false, null, undefined);
						expect(instance5.initialize).toHaveBeenCalledWith(true, false, null, undefined);
					});
				});
			});

			describe("resulting class", function() {
				it("#instanceOf", function() {
					// TODO
				});
			});
		});
	});
});
