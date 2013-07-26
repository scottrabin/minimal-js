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
			//>>includeStart("ministryStrict", pragmas.ministryStrict);
			if (typeof this[methodName] !== 'function') {
				throw new TypeError("Cannot define a `provided` decorated function with non-function method name");
			}
			//>>includeEnd("ministryStrict");
			this[methodName] = decor.provided(this[methodName], decorator);
		}
	};

	var includeMixin = function() {
		var mixinCount = arguments.length;
		var i = 0;
		var mixin;
		for (; i < mixinCount; i++) {
			mixin = arguments[i];
			if (this.includes(mixin)) {
				// do nothing; the mixin is already included in this class
				continue;
			}
			this._mixins.push(mixin);
			if (mixin.hasOwnProperty('_mixins')) {
				// it's a constructed class; inherit individual mixins
				includeMixin.apply(this, mixin._mixins);
			} else if (typeof mixin === 'function') {
				mixin.call(this.prototype);
			} else {
				utils.extend(this.prototype, mixin);
			}
		}
	};

	/**
	 * Determine if a constructed class already includes the specified mixin
	 *
	 * @context ConstructedClass
	 * @param {Function|Object} mixin The mixin to query for inclusion
	 * @returns {Boolean} if the mixin is included in the constructed class
	 */
	var includes = function(mixin) {
		return (this._mixins.indexOf(mixin) > -1);
	}

	function constructClass() {
		// create the new class
		function ConstructedClass(){};

		// attach the mixin inclusion functions
		ConstructedClass.includes = includes;
		ConstructedClass.mix = includeMixin;
		ConstructedClass._mixins = [];

		// create an instanceOf method to determine trait hierarchy
		ConstructedClass.prototype.instanceOf = function(mixin) {
			return ConstructedClass.includes(mixin);
		};

		// give access to the decorator methods
		ConstructedClass.mix(withDecorators);

		// invoke mix over the provided mixins and extract any mixins
		// from the provided mixins if they exist
		Array.prototype.forEach.call(arguments, ConstructedClass.mix, ConstructedClass);

		// return the constructed class
		return ConstructedClass;
	};

	return constructClass;
});
