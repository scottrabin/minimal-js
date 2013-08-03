"use strict";

beforeEach(function() {
	this.addMatchers({
		toBeInTheDocument: function() {
			return document.documentElement.contains(this.actual);
		},
		toMatchSelector: function(selector) {
			return Array.prototype.indexOf.call(document.querySelectorAll(selector), this.actual) > -1;
		}
	});
});
