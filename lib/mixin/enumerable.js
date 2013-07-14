"use strict";

define({
	//>>includeStart("minimalStrict", pragmas.minimalStrict);
	forEach: function(callback, thisObject) {
		throw new Error("Classes including `enumerable` must implement a `forEach` method.");
	},
	//>>includeEnd("minimalStrict");
	/**
	 * Determine if a given element is contained in the enumerable object
	 *
	 * @param {*} item
	 * @return {Boolean} if the item is contained in the enumerable object
	 */
	contains: function(item) {
		var found = false;
		this.forEach(function(value) {
			if (!found) {
				found = (item === value);
			}
			return !found;
		});
		return found;
	},
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
		this.forEach(function(value, key, array) {
			return (result = result && callback.call(this, value, key, array));
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
			return !resultFound;
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
	},
	/**
	 * Return the first value in an enumerable object.
	 *
	 * @returns {*} The first element of an enumerable object.
	 */
	first: function() {
		var result, firstEncountered = false;
		this.forEach(function(value, key, array) {
			if (!firstEncountered) {
				result = value;
				firstEncountered = true;
			}
			return false;
		});
		return result;
	},
	/**
	 * Group elements of an enumerable object into sets defined by the return value of the provided function.
	 *
	 * @param {Function} callback The function to invoke on each element that returns the grouping key.
	 * @param {*=} thisObject Object to use as context when executing callback.
	 *                        Defaults to the enumerable object.
	 * @returns {Object} a hash with each key as the result of the grouping function and values as an array
	 *                   of the elements of the enumerable object that returned the given key.
	 */
	groupBy: function(callback, thisObject) {
		//>>includeStart("minimalStrict", pragmas.minimalStrict);
		if (this == null) {
			throw new TypeError();
		}
		if (typeof callback !== 'function') {
			throw new TypeError();
		}
		//>>includeEnd("minimalStrict");
		var result = {};
		this.forEach(function(value, key, array) {
			var groupingKey = callback.call(this, value, key, array);
			if (!result[groupingKey]) {
				result[groupingKey] = [];
			}
			result[groupingKey].push(value);
		}, thisObject || this);
		return result;
	},
	/**
	 * Find the first key for which the provided test function returns true.
	 *
	 * @param {Function} callback Function to execute on each element of the enumerable object until
	 *                            it returns true.
	 * @param {*=} thisObject Object to use as context when executing callback.
	 * @returns {*} The first element in the enumerable object for which the provided function returns true.
	 */
	indexOf: function(callback, thisObject) {
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
				result = key;
				resultFound = true;
			}
			return !resultFound;
		}, thisObject || this);
		return result;
	},
	/**
	 * Return the last value in an enumerable object.
	 *
	 * @returns {*} The last element of an enumerable object.
	 */
	last: function() {
		var result;
		this.forEach(function(value, key, array) {
			result = value;
		});
		return result;
	},
	/**
	 * Find the last key for which the provided test function returns true.
	 *
	 * @param {Function} callback Function to execute on each element of the enumerable object.
	 * @param {*=} thisObject Object to use as context when executing callback.
	 * @returns {*} The last element in the enumerable object for which the provided function returns true.
	 */
	lastIndexOf: function(callback, thisObject) {
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
				result = key;
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
	 * Determine the number of elements in the enumerable object via enumeration
	 * @return {Number}
	 */
	size: function() {
		var size = 0;
		this.forEach(function() {
			size++;
		});
		return size;
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
	 * Return an array containing everything but the first element of an enumerable object.
	 *
	 * @returns {Array} containing all elements except the first of an enumerable object.
	 */
	tail: function() {
		var result = [], firstEncountered = false;
		this.forEach(function(value, key, array) {
			if (firstEncountered) {
				result.push(value);
			}
			firstEncountered = true;
		});
		return result;
	}
});
