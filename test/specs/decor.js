"use strict";

define(function(require) {
	var decor = require('decor');

	describe("decor", function() {
		describe("#before", function() {
			it("should be a function", function() {
				expect(typeof decor.before).toBe('function');
			});

			it("should return a function when given valid arguments", function() {
				expect(typeof decor.before(function(){}, function(){})).toBe('function');
			});

			it("should throw an error if the first argument is not a function", function() {
				expect(function() {
					decor.before('irrelevant', function(){});
				}).toThrow();
			});

			it("should throw an error if the second argument is not a function", function() {
				expect(function() {
					decor.before(function(){}, 'irrelevant');
				}).toThrow();
			});

			it("should execute the decorator method before the base method", function() {
				var callOrder = [];
				var baseMethod = function() {
					callOrder.push('base');
				};
				var beforeMethod = function() {
					callOrder.push('before');
				};
				var decoratedMethod = decor.before(baseMethod, beforeMethod);
				decoratedMethod();

				expect(callOrder).toEqual(['before', 'base']);
			});

			it("should return the return value of the base method", function() {
				var baseMethod = function() {
					return 'base';
				};
				var beforeMethod = function() {
					return 'before';
				};
				var decoratedMethod = decor.before(baseMethod, beforeMethod);
				expect(decoratedMethod()).toBe('base');
			});

			it("should call both the base method and the decorator method with the same arguments and context", function() {
				var context = {
					baseMethod: jasmine.createSpy(),
					beforeMethod: jasmine.createSpy()
				};
				context.decoratedMethod = decor.before(context.baseMethod, context.beforeMethod);

				context.decoratedMethod('one', true, 3);

				expect(context.baseMethod).toHaveBeenCalledWith('one', true, 3);
				expect(context.beforeMethod).toHaveBeenCalledWith('one', true, 3);
			});
		});

		describe("#after", function() {
			it("should be a function", function() {
				expect(typeof decor.after).toBe('function');
			});

			it("should return a function when given valid arguments", function() {
				expect(typeof decor.after(function(){}, function(){})).toBe('function');
			});

			it("should throw an error if the first argument is not a function", function() {
				expect(function() {
					decor.after('irrelevant', function(){});
				}).toThrow();
			});

			it("should throw an error if the second argument is not a function", function() {
				expect(function() {
					decor.after(function(){}, 'irrelevant');
				}).toThrow();
			});

			it("should execute the decorator method after the base method", function() {
				var callOrder = [];
				var baseMethod = function() {
					callOrder.push('base');
				};
				var afterMethod = function() {
					callOrder.push('after');
				};
				var decoratedMethod = decor.after(baseMethod, afterMethod);
				decoratedMethod();

				expect(callOrder).toEqual(['base', 'after']);
			});

			it("should return the return value of the base method", function() {
				var baseMethod = function() {
					return 'base';
				};
				var afterMethod = function() {
					return 'after';
				};
				var decoratedMethod = decor.after(baseMethod, afterMethod);
				expect(decoratedMethod()).toBe('base');
			});

			it("should call both the base method and the decorator method with the same arguments and context", function() {
				var context = {
					baseMethod: jasmine.createSpy(),
					afterMethod: jasmine.createSpy()
				};
				context.decoratedMethod = decor.after(context.baseMethod, context.afterMethod);

				context.decoratedMethod('one', true, 3);

				expect(context.baseMethod).toHaveBeenCalledWith('one', true, 3);
				expect(context.afterMethod).toHaveBeenCalledWith('one', true, 3);
			});
		});

		describe("#around", function() {
			it("should be a function", function() {
				expect(typeof decor.around).toBe('function');
			});

			it("should return a function when given valid arguments", function() {
				expect(typeof decor.around(function(){}, function(){})).toBe('function');
			});

			it("should throw an error if the first argument is not a function", function() {
				expect(function() {
					decor.around('irrelevant', function(){});
				}).toThrow();
			});

			it("should throw an error if the second argument is not a function", function() {
				expect(function() {
					decor.around(function(){}, 'irrelevant');
				}).toThrow();
			});

			it("should execute the decorator method around the base method", function() {
				var callOrder = [];
				var baseMethod = function() {
					callOrder.push('base');
				};
				var aroundMethod = function(_yield) {
					callOrder.push('around prior');
					_yield();
					callOrder.push('around after');
				};
				var decoratedMethod = decor.around(baseMethod, aroundMethod);
				decoratedMethod();

				expect(callOrder).toEqual(['around prior', 'base', 'around after']);
			});

			it("should return the return value of the decoration method", function() {
				var baseMethod = function() {
					return 'base';
				};
				var aroundMethod = function(_yield) {
					_yield();
					return 'around';
				};
				var decoratedMethod = decor.around(baseMethod, aroundMethod);
				expect(decoratedMethod()).toBe('around');
			});

			it("should call both the base method and the decorator method with the same arguments and context", function() {
				var context = {
					baseMethod: jasmine.createSpy(),
					aroundMethod: jasmine.createSpy().andCallFake(function(_yield) {
						_yield();
					})
				};
				context.decoratedMethod = decor.around(context.baseMethod, context.aroundMethod);

				context.decoratedMethod('one', true, 3);

				expect(context.baseMethod).toHaveBeenCalledWith('one', true, 3);
				expect(context.aroundMethod.mostRecentCall.args.slice(1)).toEqual(['one', true, 3]);
			});
		});

		describe("#wrap", function() {
			it("should be a function", function() {
				expect(typeof decor.wrap).toBe('function');
			});

			it("should return a function when given valid arguments", function() {
				expect(typeof decor.wrap(function(){}, function(){})).toBe('function');
			});

			it("should throw an error if the first argument is not a function", function() {
				expect(function() {
					decor.wrap('irrelevant', function(){});
				}).toThrow();
			});

			it("should throw an error if the second argument is not a function", function() {
				expect(function() {
					decor.wrap(function(){}, 'irrelevant');
				}).toThrow();
			});

			it("should execute the decorator method with the base method injected as the first parameter", function() {
				var wrapper = jasmine.createSpy('wrapper method');
				var base    = jasmine.createSpy('base method');
				var decorated = decor.wrap(base, wrapper);

				var context = {};
				decorated.call(context, 'one', true, 3);

				expect(wrapper).toHaveBeenCalledWith(base, 'one', true, 3);
				expect(base).not.toHaveBeenCalled();
			});
		});

		describe("#provided", function() {
			it("should be a function", function() {
				expect(typeof decor.provided).toBe('function');
			});

			it("should return a function when given valid arguments", function() {
				expect(typeof decor.provided(function(){}, function(){})).toBe('function');
			});

			it("should throw an error if the first argument is not a function", function() {
				expect(function() {
					decor.provided('irrelevant', function(){});
				}).toThrow();
			});

			it("should throw an error if the second argument is not a function", function() {
				expect(function() {
					decor.provided(function(){}, 'irrelevant');
				}).toThrow();
			});

			it("should execute the base method if the decorator method returns a truthy value", function() {
				var baseMethod = jasmine.createSpy();
				var providedMethod = function() {
					return true;
				};
				var decoratedMethod = decor.provided(baseMethod, providedMethod);
				decoratedMethod();

				expect(baseMethod).toHaveBeenCalled();
			});

			it("should not execute the base method if the decorator method returns a falsy value", function() {
				var baseMethod = jasmine.createSpy();
				var providedMethod = function() {
					return false;
				};
				var decoratedMethod = decor.provided(baseMethod, providedMethod);
				decoratedMethod();

				expect(baseMethod).not.toHaveBeenCalled();
			});

			it("should call both the base method and the decorator method with the same arguments and context", function() {
				var context = {
					baseMethod: jasmine.createSpy(),
					providedMethod: jasmine.createSpy().andReturn(true)
				};
				context.decoratedMethod = decor.provided(context.baseMethod, context.providedMethod);

				context.decoratedMethod('one', true, 3);

				expect(context.baseMethod).toHaveBeenCalledWith('one', true, 3);
				expect(context.providedMethod).toHaveBeenCalledWith('one', true, 3);
			});
		});

		describe("#negate", function() {
			it("should be a function", function() {
				expect(typeof decor.negate).toBe('function');
			});

			it("should return a function when given valid arguments", function() {
				expect(typeof decor.negate(function(){})).toBe('function');
			});

			it("should execute the base method and return the boolean negated value", function() {
				var trueFunction = jasmine.createSpy().andReturn(true);
				var falseFunction = jasmine.createSpy().andReturn(false);

				expect(decor.negate(trueFunction)('one', true, 3)).toBe(false);
				expect(decor.negate(falseFunction)(1, 'two', true)).toBe(true);

				expect(trueFunction).toHaveBeenCalledWith('one', true, 3);
				expect(falseFunction).toHaveBeenCalledWith(1, 'two', true);
			});
		});
	});
});
