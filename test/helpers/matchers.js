"use strict";

beforeEach(function() {
	var hasOwn = Object.prototype.hasOwnProperty;

	this.addMatchers({
		toHaveProperty: function(expected) {
			return hasOwn.call(this.actual, expected);
		},
		toBeInTheDocument: function() {
			return document.documentElement.contains(this.actual);
		},
		toMatchSelector: (
			document.documentElement.matchesSelector ? function(selector) { return this.actual.matchesSelector(selector); } :
			document.documentElement.webkitMatchesSelector ? function(selector) { return this.actual.webkitMatchesSelector(selector); } :
			document.documentElement.mozMatchesSelector ? function(selector) { return this.actual.mozMatchesSelector(selector); } :
			document.documentElement.msMatchesSelector ? function(selector) { return this.actual.msMatchesSelector(selector); } :
			function() {
				throw new Error("No valid matching function exists for `toMatchSelector`");
			}
		),
		toHaveBeenTriggered: function() {
			return this.actual.callCount > 0;
		}
	});
});
