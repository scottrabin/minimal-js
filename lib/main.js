"use strict";

define(function(require) {
	var utils = require('./util');
	var withDecorators = require('./mixin/decor');

	/**
	 * Include a variable number of mixins into the ConstructedClass context
	 */
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
				mixin(this.prototype, this);
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
		function ConstructedClass(){
			// enforce use as a constructor
			if ( !(this instanceof ConstructedClass) ) {
				return ConstructedClass.create.apply(null, arguments);
			}
			// invoke initialize function, if one exists
			if (this.initialize) {
				this.initialize.apply(this, arguments);
			}
			// due to the variable-arguments solution in the default `ConstructedClass`
			// implementation, we need to return the created object from this function
			return this;
		};

		// overrideable instantiator
		ConstructedClass.create = function() {
			return ConstructedClass.apply(Object.create(ConstructedClass.prototype), arguments);
		};

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
