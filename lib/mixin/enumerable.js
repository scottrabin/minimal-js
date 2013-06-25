"use strict";

define({
	//>>includeStart("minimalStrict", pragmas.minimalStrict);
	forEach: function(callback, thisObject) {
		throw new Error("Classes including `enumerable` must implement a `forEach` method.");
	},
	//>>includeEnd("minimalStrict");
	/**
	 * Tests whether all elements in the enumerable object pass the
	 * test implemented by the provided function.
	 *
	 * @param {Function} callback Function to test for each element
	 * @param {*=} thisObject Object to use as context when executing callback.
	 *                       Defaults to the enumerable object.
	 * @returns {Boolean} if every element in the object returns a truthy value for
	 *                    the provided test
	 */
	every: function(callback, thisObject) {
		//>>includeStart("minimalStrict", pragmas.minimalStrict);
		if (this == null) {
			throw new TypeError();
		}
		if (typeof callback !== 'function') {
			throw new TypeError();
		}
		//>>includeEnd("minimalStrict");
		var result = true;
		if (!thisObject) {
			thisObject = this;
		}
		this.forEach(function(value, key, array) {
			return (result = result && callback.call(thisObject, value, key, array));
		});
		return result;
	},
	/**
	 * Tests whether some element in the enumerable object passes the
	 * test implemented by the provided function.
	 *
	 * @param {Function} callback Function to test for each element
	 * @param {*=} thisObject Object to use as context when executing callback.
	 *                       Defaults to the enumerable object.
	 * @returns {Boolean} if any element in the object returns a truthy value for
	 *                    the provided test
	 */
	some: function(callback, thisObject) {
		//>>includeStart("minimalStrict", pragmas.minimalStrict);
		if (this == null) {
			throw new TypeError();
		}
		if (typeof callback !== 'function') {
			throw new TypeError();
		}
		//>>includeEnd("minimalStrict");
		var result = false;
		this.forEach(function(value, key, array) {
			return !(result = result || callback.call(this, value, key, array));
		}, thisObject || this);
		return result;
	},
	/**
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
		var result = [];
		this.forEach(function(value, key, array) {
			if (callback.call(this, value, key, array)) {
				result.push(value);
			}
		}, thisObject || this);
		return result;
	},
	/**
	 * Create a new array with all of the elements from the enumerable object that
	 * fail the test implemented by the provided function.
	 *
	 * @param {Function} callback Function to test each element of the enumerable object
	 * @param {*=} thisObject Object to use as the context when executing the provided function.
	 * @returns {Array} of elements that fail the provided test function.
	 */
	reject: function(callback, thisObject) {
		//>>includeStart("minimalStrict", pragmas.minimalStrict);
		if (this == null) {
			throw new TypeError();
		}
		if (typeof callback !== 'function') {
			throw new TypeError();
		}
		//>>includeEnd("minimalStrict");
		var result = [];
		this.forEach(function(value, key, array) {
			if (!callback.call(this, value, key, array)) {
				result.push(value);
			}
		}, thisObject || this);
		return result;
	},
	/**
	 * Create a new array with the results of calling a provided function on each
	 * of the values in the enumerable object.
	 *
	 * @param {Function} callback Function that produces the value for the new array
	 *                            from an element of the current one.
	 * @param {*=} thisObject Object to use as context when executing the callback.
	 * @returns {Array} of elements resulting from executing the callback on each element
	 *                  of the enumerable object.
	 */
	map: function(callback, thisObject) {
		//>>includeStart("minimalStrict", pragmas.minimalStrict);
		if (this == null) {
			throw new TypeError();
		}
		if (typeof callback !== 'function') {
			throw new TypeError();
		}
		//>>includeEnd("minimalStrict");
		var result = [];
		this.forEach(function(value, key, array) {
			result.push(callback.call(this, value, key, array));
		}, thisObject || this);
		return result;
	},
	/**
	 * Apply a function against an accumulator and each value of the enumerable object
	 * (from left to right) to reduce it to a single value.
	 *
	 * @param {Function} callback Function to execute on each value in the array.
	 * @param {*=} initialValue Object to use as the value of `previousValue` for the
	 *                          first invocation of the provided callback.
	 * @returns {*} The result of executing the callback over each element of the
	 *              enumerable object.
	 */
	reduce: function(callback, initialValue) {
		//>>includeStart("minimalStrict", pragmas.minimalStrict);
		if (this == null) {
			throw new TypeError();
		}
		if (typeof callback !== 'function') {
			throw new TypeError();
		}
		//>>includeEnd("minimalStrict");
		var result = initialValue;
		this.forEach(function(value, key, array) {
			result = callback.call(this, result, value, key, array);
		}, this);
		return result;
	},
	/**
	 * Apply a function against an accumulator and each value of the enumerable object
	 * (from right to left) to reduce it to a single value.
	 *
	 * @param {Function} callback Function to execute on each value in the array.
	 * @param {*=} initialValue Object to use as the value of `previousValue` for the
	 *                          first invocation of the provided callback.
	 * @returns {*} The result of executing the callback over each element of the
	 *              enumerable object.
	 */
	reduceRight: function(callback, initialValue) {
		throw new Error("enumerable.reduceRight not yet implemented");
	},
	/**
	 * Return the first value of the enumerable object for which the provided function returns
	 * a truthy value.
	 *
	 * @param {Function} callback Function to execute on each element of the enumerable object until
	 *                            it returns true.
	 * @param {*=} thisObject Object to use as context when executing callback.
	 * @returns {*} The first element in the enumerable object for which the provided function returns true.
	 */
	find: function(callback, thisObject) {
		//>>includeStart("minimalStrict", pragmas.minimalStrict);
		if (this == null) {
			throw new TypeError();
		}
		if (typeof callback !== 'function') {
			throw new TypeError();
		}
		//>>includeEnd("minimalStrict");
		var result, resultFound = false;
		this.forEach(function(value, key, array) {
			if (!resultFound && callback.call(this, value, key, array)) {
				resultFound = true;
				result = value;
			}
		}, thisObject || this);
		return result;
	},
	/**
	 * Return the last value of the enumerable object for which the provided function returns
	 * a truthy value.
	 *
	 * @param {Function} callback Function to execute on each element of the enumerable object.
	 * @param {*=} thisObject Object to use as context when executing callback.
	 * @returns {*} The last element in the enumerable object for which the provided function returns true.
	 */
	findLast: function(callback, thisObject) {
		//>>includeStart("minimalStrict", pragmas.minimalStrict);
		if (this == null) {
			throw new TypeError();
		}
		if (typeof callback !== 'function') {
			throw new TypeError();
		}
		//>>includeEnd("minimalStrict");
		var result;
		this.forEach(function(value, key, array) {
			if (callback.call(this, value, key, array)) {
				result = value;
			}
		}, thisObject || this);
		return result;
	}
});
