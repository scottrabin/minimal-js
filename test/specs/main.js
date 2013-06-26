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
				var mixin = function() {
					this.propertyOne = propOne;
					this.propertyTwo = propTwo;
				};
				var constructedClass = create(mixin);

				expect(constructedClass.prototype.propertyOne).toBe(propOne);
				expect(constructedClass.prototype.propertyTwo).toBe(propTwo);
			});

			it("should provide combinator methods during construction if the mixin is a function", function() {
				var mixin = function() {
					expect(typeof this.before).toBe('function');
					expect(typeof this.after).toBe('function');
					expect(typeof this.around).toBe('function');
					expect(typeof this.provided).toBe('function');
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

			describe("combinators", function() {
				describe("before", function() {
					it("should attach the combined method to the constructed class's prototype", function() {
						var callOrder = [];

						var mixin = function() {
							this.beforeMethod = function(){
								callOrder.push('before method');
							};
							this.before('beforeMethod', function() {
								callOrder.push('before decorator');
							});
						};

						var constructedClass = create(mixin);
						var instance = new constructedClass;
						instance.beforeMethod();

						expect(callOrder).toEqual(['before decorator', 'before method']);
					});

					it("should return the decorator function if the named method does not exist", function() {
						var callOrder = [];

						var mixin = function() {
							this.before('method', function() {
								callOrder.push('decorator');
							});
						};

						var constructedClass = create(mixin);
						var instance = new constructedClass;
						instance.method();

						expect(callOrder).toEqual(['decorator']);
					});
				});

				describe("after", function() {
					it("should attach the combined method to the constructed class's prototype", function() {
						var callOrder = [];

						var mixin = function() {
							this.afterMethod = function(){
								callOrder.push('after method');
							};
							this.after('afterMethod', function() {
								callOrder.push('after decorator');
							});
						};

						var constructedClass = create(mixin);
						var instance = new constructedClass;
						instance.afterMethod();

						expect(callOrder).toEqual(['after method', 'after decorator']);
					});

					it("should return the decorator function if the named method does not exist", function() {
						var callOrder = [];

						var mixin = function() {
							this.after('method', function() {
								callOrder.push('decorator');
							});
						};

						var constructedClass = create(mixin);
						var instance = new constructedClass;
						instance.method();

						expect(callOrder).toEqual(['decorator']);
					});
				});

				describe("around", function() {
					it("should attach the combined method to the constructed class's prototype", function() {
						var callOrder = [];

						var mixin = function() {
							this.aroundMethod = function(){
								callOrder.push('around method');
							};
							this.around('aroundMethod', function(_yield) {
								callOrder.push('around decorator before');
								_yield();
								callOrder.push('around decorator after');
							});
						};

						var constructedClass = create(mixin);
						var instance = new constructedClass;
						instance.aroundMethod();

						expect(callOrder).toEqual(['around decorator before', 'around method', 'around decorator after']);
					});

					it("should return the decorator function if the named method does not exist", function() {
						var callOrder = [];

						var mixin = function() {
							this.around('method', function(_yield) {
								callOrder.push('decorator before');
								_yield();
								callOrder.push('decorator after');
							});
						};

						var constructedClass = create(mixin);
						var instance = new constructedClass;
						instance.method();

						expect(callOrder).toEqual(['decorator before', 'decorator after']);
					});
				});

				describe("provided", function() {
					it("should attach the combined method to the constructed class's prototype", function() {
						var callOrder = [];

						var mixin = function() {
							this.providedMethod = function(){
								callOrder.push('provided method');
							};
							this.provided('providedMethod', function() {
								callOrder.push('provided decorator');
								return true;
							});
						};

						var constructedClass = create(mixin);
						var instance = new constructedClass;
						instance.providedMethod();

						expect(callOrder).toEqual(['provided decorator', 'provided method']);
					});

					it("should throw an error if the named method does not exist", function() {
						var mixin = function() {
							this.provided('method', function() {
								callOrder.push('decorator');
							});
						};

						expect(function() {
							var constructedClass = create(mixin);
						}).toThrow();
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
