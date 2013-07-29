"use strict";

define(function(require) {
	var create = require('main');
	// don't need to explicitly include the decor mixin since it's
	// included by default

	describe("mixin/decor", function() {
		describe("#before", function() {
			it("should attach the combined method to the constructed class's prototype", function() {
				var callOrder = [];

				var mixin = function(prototype) {
					prototype.beforeMethod = function(){
						callOrder.push('before method');
					};
					prototype.before('beforeMethod', function() {
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

				var mixin = function(prototype) {
					prototype.before('method', function() {
						callOrder.push('decorator');
					});
				};

				var constructedClass = create(mixin);
				var instance = new constructedClass;
				instance.method();

				expect(callOrder).toEqual(['decorator']);
			});
		});

		describe("#after", function() {
			it("should attach the combined method to the constructed class's prototype", function() {
				var callOrder = [];

				var mixin = function(prototype) {
					prototype.afterMethod = function(){
						callOrder.push('after method');
					};
					prototype.after('afterMethod', function() {
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

				var mixin = function(prototype) {
					prototype.after('method', function() {
						callOrder.push('decorator');
					});
				};

				var constructedClass = create(mixin);
				var instance = new constructedClass;
				instance.method();

				expect(callOrder).toEqual(['decorator']);
			});
		});

		describe("#around", function() {
			it("should attach the combined method to the constructed class's prototype", function() {
				var callOrder = [];

				var mixin = function(prototype) {
					prototype.aroundMethod = function(){
						callOrder.push('around method');
					};
					prototype.around('aroundMethod', function(_yield) {
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

				var mixin = function(prototype) {
					prototype.around('method', function(_yield) {
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

		describe("#wrap", function() {
			it("should attach the combined method to the constructed class's prototype", function() {
				var callOrder = [];

				var mixin = function(prototype) {
					prototype.baseMethod = function(){
						callOrder.push('base method');
					};
					prototype.wrap('baseMethod', function(baseMethod) {
						callOrder.push('wrap before');
						baseMethod.call(this);
						callOrder.push('wrap after');
						return true;
					});
				};

				var constructedClass = create(mixin);
				var instance = new constructedClass;
				instance.baseMethod();

				expect(callOrder).toEqual(['wrap before', 'base method', 'wrap after']);
			});

			it("should throw an error if the named method does not exist", function() {
				var mixin = function(prototype) {
					prototype.wrap('method', function() {
						callOrder.push('decorator');
					});
				};

				expect(function() {
					var constructedClass = create(mixin);
				}).toThrow();
			});
		});

		describe("#provided", function() {
			it("should attach the combined method to the constructed class's prototype", function() {
				var callOrder = [];

				var mixin = function(prototype) {
					prototype.providedMethod = function(){
						callOrder.push('provided method');
					};
					prototype.provided('providedMethod', function() {
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
				var mixin = function(prototype) {
					prototype.provided('method', function() {
						callOrder.push('decorator');
					});
				};

				expect(function() {
					var constructedClass = create(mixin);
				}).toThrow();
			});
		});
	});
});
