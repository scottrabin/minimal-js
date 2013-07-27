"use strict";

define(function(require) {
	var create = require('main');
	// don't need to explicitly include the decor mixin since it's
	// included by default

	describe("mixin/decor", function() {
		describe("#before", function() {
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

		describe("#after", function() {
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

		describe("#around", function() {
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

		describe("#provided", function() {
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
});
