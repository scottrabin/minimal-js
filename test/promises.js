var requirejs = require('requirejs');
var promisesAplusTests = require("promises-aplus-tests");

requirejs.config({
	baseUrl: './lib',
	nodeRequire: require
});

requirejs(['promise'], function(Promise) {
	var adapter = {
		fulfilled: function(value) {
			return Promise.of(value);
		},
		rejected: function(reason) {
			return Promise.reject(reason);
		},
		pending: function() {
			var interface = {};
			interface.promise = Promise(function(resolver) {
				interface.fulfill = function(val) {
					resolver.fulfill(val);
				};
				interface.reject  = function(val) {
					resolver.reject(val);
				};
			});
			return interface;
		}
	};

	promisesAplusTests(adapter, function (err) {
		// All done; output is in the console. Or check `err` for number of failures.
		if (err) {
			console.error(err);
		}
	});
});
