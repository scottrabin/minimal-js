"use strict";

/**
 * Provides a number of array functions (push, pop, etc.) to
 * an implementing class.
 */
define(function(require) {
	var create = require('../main');
	var decor = require('../decor');

	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var is_array = function(item) {
		return (
			Array.isArray(item) ||
			(item && typeof item.instanceOf === 'function' && item.instanceOf(ArrayLike))
		);
	};

	var ArrayLike = create(
		// Arraylike objects are enumerable
		require('./enumerable'),
		{
			// by default, the length of an arraylike object is 0
			length: 0,
			// Copy a large number of Array prototype functions
			// 15.4.4.2 Array.prototype.toString
			toString: Array.prototype.toString,
			// 15.4.4.3 Array.prototype.toLocaleString
			toLocaleString: Array.prototype.toLocaleString,
			/**
			 * 15.4.4.4 Array.prototype.concat
			 * Re-implement this native Array method to correctly return an instance
			 * of the current object.
			 *
			 * @param {...*} items
			 * @returns {instanceof this.constructor}
			 */
			concat: function() {
				var result = new this.constructor();
				var item;
				for (var i = -1, l = arguments.length; i < l; i++) {
					item = (i === -1 ? this : arguments[i]);
					if (is_array(item)) {
						for (var k = 0, len = item.length; k < len; k++) {
							if (item.hasOwnProperty(k)) {
								result.push(item[k]);
							}
						}
					} else {
						result.push(item);
					}
				}
				return result
			},
			// 15.4.4.5 Array.prototype.join
			join: Array.prototype.join,
			// 15.4.4.6 Array.prototype.pop,
			pop: Array.prototype.pop,
			// 15.4.4.7 Array.prototype.push
			push: Array.prototype.push,
			// 15.4.4.8 Array.prototype.reverse
			reverse: Array.prototype.reverse,
			// 15.4.4.9 Array.prototype.shift
			shift: Array.prototype.shift,
			/**
			 * 15.4.4.10 Array.prototype.slice
			 * Re-implement this native Array method to correctly return an instance
			 * of the current object.
			 *
			 * @param {Number=} start
			 * @param {Number=} end
			 * @returns {instanceof this.constructor}
			 */
			slice: function(start, end) {
				var result = new this.constructor();
				var len = +this.length;
				var relativeStart = +start;
				var relativeEnd = (end === undefined ? len : +end);
				var k = (relativeStart < 0
						 ? Math.max(len + relativeStart, 0)
						 : Math.min(relativeStart, len)
						);
				var final = (relativeEnd < 0
							 ? Math.max(len + relativeEnd, 0)
							 : Math.min(relativeEnd, len)
							);
				for (;k < final; k++) {
					if (this.hasOwnProperty(k)) {
						result.push(this[k]);
					}
				}
				return result;
			},
			// 15.4.4.11 Array.prototype.sort
			sort: Array.prototype.sort,
			/**
			 * 15.4.4.12 Array.prototype.splice
			 * Wrap the native implementation to return an instance of the current object
			 *
			 * @param {Number} index
			 * @param {Number} howMany
			 * @param {...*} element
			 * @returns {instanceof this.constructor} of the removed elements
			 */
			splice: function(index, howMany) {
				var result = new this.constructor();
				result.push.apply(result, Array.prototype.splice.apply(this, arguments));
				return result;
			},
			// 15.4.4.13 Array.prototype.unshift
			unshift: Array.prototype.unshift,
			// 15.4.4.14 Array.prototype.indexOf
			indexOf: Array.prototype.indexOf,
			// 15.4.4.15 Array.prototype.lastIndexOf,
			lastIndexOf: Array.prototype.lastIndexOf,
			// 15.4.4.16 Array.prototype.every,
			every: Array.prototype.every,
			// 15.4.4.17 Array.prototype.some
			some: Array.prototype.some,
			// 15.4.4.18 Array.prototype.forEach
			forEach: Array.prototype.forEach,
			// 15.4.4.19 Array.prototype.map
			map: Array.prototype.map,
			/**
			 * 15.4.4.20 Array.prototype.filter
			 * Create a new array with all of the elements from the enumerable object that
			 * pass the test implemented by the provided function.
			 *
			 * @param {Function} callback Function to test each element of the array
			 * @param {*=} thisObject Object to use as context when executing the callback
			 * @returns {Array} of elements that pass the provided test function.
			 */
			filter: function(callback, thisObject) {
				//>>includeStart("minimalStrict", pragmas.minimalStrict);
				if (this == null) {
					throw new TypeError();
				}
				if (typeof callback !== 'function') {
					throw new TypeError();
				}
				//>>includeEnd("minimalStrict");
				var result = new this.constructor();
				if (!thisObject) {
					thisObject = this;
				}
				for (var i = 0, l = this.length; i < l; i++) {
					if (callback.call(thisObject, this[i], i, this)) {
						result.push(this[i]);
					}
				}
				return result;
			},
			// 15.4.4.21 Array.prototype.reduce
			reduce: Array.prototype.reduce,
			// 15.4.4.22 Array.prototype.reduceRight
			reduceRight: Array.prototype.reduceRight,
			// provide better implementations of some enumerable functions
			/**
			 * Create a new array with all of the elements from the enumerable object that
			 * fail the test implemented by the provided function.
			 *
			 * @param {Function} callback Function to test each element of the enumerable object
			 * @param {*=} thisObject Object to use as the context when executing the provided function.
			 * @returns {Array} of elements that fail the provided test function.
			 */
			reject: function(callback, thisObject) {
				return this.filter(decor.negate(callback), thisObject);
			},
			/**
			 * Sort the elements of the object in ascending order computed by the
			 * provided function.
			 *
			 * @param {Function} transform The function used to compute a numeric value to sort by.
			 * @returns {instanceof this.constructor} the sorted array
			 */
			sortBy: function(transform) {
				return this.sort(function(a, b) {
					return transform(a) - transform(b);
				});
			}
		}
	);

	return ArrayLike;
});
