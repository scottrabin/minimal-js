"use strict";

define(function(require, exports) {
	var is = require('./util/is');

	/**
	 * Tokenize a form field input name into an array of namespaces
	 * @private
	 *
	 * @param {String} name
	 * @return {String}
	 */
	function tokenizeName(name) {
		return name.split('[').map(function(key) {
			return key.replace(/\]$/, '');
		});
	}

	/**
	 * Convert a string from a URI-safe encoded value
	 *
	 * @param {String} encodedString
	 * @return {String}
	 */
	function decodeComponent(encodedString) {
		return (encodedString
				? decodeURIComponent(encodedString.toString().replace(/\+/g, ' '))
				: ''
			   );
	}

	/**
	 * Append a name/value pair to a form data host object
	 *
	 * @param {Object} host
	 * @param {String} name
	 * @param {String} value
	 */
	exports.append = function(host, name, value) {
		var namespaces = tokenizeName(name);
		var len = namespaces.length;

		var key, arrNext = false, ns = host;
		for (var i = 0; i < len; i++) {
			// if the key is '', then use the array index instead
			key = (arrNext ? ns.length : namespaces[i]);
			arrNext = (namespaces[i+1] === '');
			ns[key] = (i < len - 1
					   // if not at the last index, create the namespace (if necessary)
					   ? (ns[key] || (arrNext ? [] : {}))
					   // set the value
					   : value);

			ns = ns[key];
		}
		return host;
	}

	var REGEX_QUERY_STRING_SPLIT = /^.+(?:\[.*\])*=/;
	/**
	 * Parse a full query string into an object representation of the data
	 *
	 * @param {String} queryString
	 * @return {Object}
	 */
	exports.parse = function(queryString) {
		return queryString.split('&').reduce(function(data, pair) {
			var splitPos = REGEX_QUERY_STRING_SPLIT.exec(pair)[0].length;
			return exports.append(
				data,
				decodeComponent(pair.substr(0, splitPos - 1)),
				decodeComponent(pair.substr(splitPos))
			);
		}, {});
	};

	/**
	 * Convert an object into a property formatted query string
	 *
	 * @param {Object} queryKey object to serialize
	 * @param {String=} prefix if the object is a sub-key of another property,
	 *                         this should be set to that property
	 * @return {String}
	 */
	exports.stringify = function(queryKey, prefix) {
		if (!prefix) {
			prefix = '';
		}
		var name, value;
		var result = [];
		for (var key in queryKey) {
			if (!queryKey.hasOwnProperty(key)) {
				continue;
			}
			name = (prefix
					? prefix + '[' + encodeURIComponent(key) + ']'
					: encodeURIComponent(key)
				   );
			value = queryKey[key];
			if (is.array(value)) {
				// if value contains any objects, include the array index in the querystring
				if (value.every(is.object)) {
					var arrObject = value.reduce(function(memo, v, k) {
						memo[k] = v;
						return memo;
					}, {});
					result.push(exports.stringify(arrObject, name));
				} else {
					result.push.apply(result, value.map(function(v) {
						return name + '[]=' + encodeURIComponent(v);
					}));
				}
			} else if (is.object(value)) {
				result.push(exports.stringify(value, name));
			} else {
				result.push(name + '=' + encodeURIComponent(value));
			}
		}
		return result.join('&');
	};
});
