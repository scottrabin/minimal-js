"use strict";

// Many thanks to Reginald Braithwaite for his excellent series on
// method decorators and combinators
// https://github.com/raganwald/homoiconic/blob/master/2012/08/method-decorators-and-combinators-in-coffeescript.md
define(function(require, exports) {
	var ArrayProto_slice = Array.prototype.slice;

	/**
	 * Execute a decoration method before a given "base" method
	 * with the same context and arguments.
	 *
	 * @param {Function} base The base method
	 * @param {Function} decoration The decoration method to invoke
	 *                   prior to the base method
	 * @returns {*} The return value of the base method, unaffected by
	 *              the decoration method
	 */
	exports.before = function(base, decoration) {
		// validate arguments
		//>>includeStart("ministryStrict", pragmas.ministryStrict);
		if (typeof base !== 'function') {
			throw new TypeError("decor.before expected function as first argument, got " + base);
		}
		if (typeof decoration !== 'function') {
			throw new TypeError("decor.before expected function as second argument, got " + decoration);
		}
		//>>includeEnd("ministryStrict");
		return function() {
			decoration.apply(this, arguments);
			return base.apply(this, arguments);
		};
	};

	/**
	 * Execute a decoration method after a given "base" method
	 * with the same context and arguments.
	 *
	 * @param {Function} base The base method
	 * @param {Function} decoration The decoration method to invoke
	 *                   after the base method
	 * @returns {*} The return value of the base method, unaffected by
	 *              the decoration method
	 */
	exports.after = function(base, decoration) {
		// validate arguments
		//>>includeStart("ministryStrict", pragmas.ministryStrict);
		if (typeof base !== 'function') {
			throw new TypeError("decor.after expected function as first argument, got " + base);
		}
		if (typeof decoration !== 'function') {
			throw new TypeError("decor.after expected function as second argument, got " + decoration);
		}
		//>>includeEnd("ministryStrict");
		return function() {
			var baseValue = base.apply(this, arguments);
			decoration.apply(this, arguments);
			return baseValue;
		};
	};

	/**
	 * Execute a decoration method around a given "base" method
	 * with the same context and arguments and inject a "yield"
	 * method to invoke the base method.
	 *
	 * @param {Function} base The base method
	 * @param {Function} decoration The decoration method to invoke
	 *                   after the base method
	 * @returns {*} The return value of the decoration method
	 */
	exports.around = function(base, decoration) {
		// validate arguments
		//>>includeStart("ministryStrict", pragmas.ministryStrict);
		if (typeof base !== 'function') {
			throw new TypeError("decor.around expected function as first argument, got " + base);
		}
		if (typeof decoration !== 'function') {
			throw new TypeError("decor.around expected function as second argument, got " + decoration);
		}
		//>>includeEnd("ministryStrict");
		return function() {
			var context = this;
			var args = ArrayProto_slice.call(arguments, 0);
			var boundMethod = function() {
				base.apply(context, args);
			};
			return decoration.apply(this, [boundMethod].concat(args));
		};
	};

	/**
	 * Execute a decoration method and inject the original "wrapped" function
	 * to allow the decorator to modify the calling context and arguments.
	 *
	 * @param {Function} base The base method to wrap
	 * @param {Function} decoration The wrapping method
	 * @returns {Function}
	 */
	exports.wrap = function(base, decoration) {
		//>>includeStart("ministryStrict", pragmas.ministryStrict);
		if (typeof base !== 'function') {
			throw new TypeError("decor.wrap expected function as first argument, got " + base);
		}
		if (typeof decoration !== 'function') {
			throw new TypeError("decor.wrap expected function as second argument, got " + decoration);
		}
		//>>includeEnd("ministryStrict");
		return function() {
			return decoration.apply(this, [base].concat(Array.prototype.slice.call(arguments, 0)));
		};
	};

	/**
	 * Execute a decoration method and conditionally a given "base" method
	 * with the same context and arguments if the decoration method
	 * returns a truthy value.
	 *
	 * @param {Function} base The base method
	 * @param {Function} decoration The decoration method whose return value
	 *                   will be used to conditionally invoke the base method
	 * @returns {*} The return value of the base method if the decoration
	 *              method returns a truthy value, `undefined` otherwise
	 */
	exports.provided = function(base, decoration) {
		// validate arguments
		//>>includeStart("ministryStrict", pragmas.ministryStrict);
		if (typeof base !== 'function') {
			throw new TypeError("decor.provided expected function as first argument, got " + base);
		}
		if (typeof decoration !== 'function') {
			throw new TypeError("decor.provided expected function as second argument, got " + decoration);
		}
		//>>includeEnd("ministryStrict");
		return function() {
			if (decoration.apply(this, arguments)) {
				return base.apply(this, arguments);
			}
		};
	};

	/**
	 * Execute a given method and return the negated result.
	 *
	 * @param {Function} base The base method
	 * @returns {Function} the negated base function
	 */
	exports.negate = function(base) {
		// validate argument
		//>>includeStart("ministryStrict", pragmas.ministryStrict);
		if (typeof base !== 'function') {
			throw new TypeError("decor.negate expected function as argument, got " + base);
		}
		//>>includeEnd("ministryStrict");
		return function() {
			return !base.apply(this, arguments);
		};
	};
});
