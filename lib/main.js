"use strict";

define(function(require) {
	var decor = require('./decor');
	var utils = require('./util');

	var withDecorators = {
		before: function(methodName, decorator) {
			this[methodName] = (typeof this[methodName] === 'function'
								? decor.before(this[methodName], decorator)
								: decorator
							   );
		},
		after: function(methodName, decorator) {
			this[methodName] = (typeof this[methodName] === 'function'
								? decor.after(this[methodName], decorator)
								: decorator
							   );
		},
		around: function(methodName, decorator) {
			this[methodName] = decor.around(
				(typeof this[methodName] === 'function' ? this[methodName] : utils.noop),
				decorator
			);
		},
		provided: function(methodName, decorator) {
			//>>includeStart("minimalStrict", pragmas.minimalStrict);
			if (typeof this[methodName] !== 'function') {
				throw new TypeError("Cannot define a `provided` decorated function with non-function method name");
			}
			//>>includeEnd("minimalStrict");
			this[methodName] = decor.provided(this[methodName], decorator);
		}
	};

	var includeMixin = function() {
		var mixinCount = arguments.length;
		var i = 0;
		var mixin;
		for(; i < mixinCount; i++) {
			mixin = arguments[i];
			if (typeof mixin === 'function') {
				mixin.call(this.prototype);
			} else {
				utils.extend(this.prototype, mixin);
			}
		}
	};

	function constructClass() {
		// create the new class
		function ConstructedClass(){};

		// attach the mixin inclusion function
		ConstructedClass.mix = includeMixin;

		// give access to the decorator methods
		ConstructedClass.mix(withDecorators);

		// invoke mix over the provided mixins
		ConstructedClass.mix.apply(ConstructedClass, arguments);

		// return the constructed class
		return ConstructedClass;
	};

	return constructClass;
});
