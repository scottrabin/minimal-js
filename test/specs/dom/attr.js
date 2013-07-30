"use strict";

define(function(require) {
	// the dom/attr module will install itself
	require('dom/attr');
	var miniDom = require('dom/core');

	describe("dom/attr", function() {
		describe("#attr", function() {
			describe("when only one argument is given", function() {
				beforeEach(function() {
					this.element = miniDom(jasmine.createElement('<div class="class-name" attribute="expando-attr" bare-attribute></div>'));
				});

				it("should act as a getter for the specified attribute on the first element in the DOM.Core instance", function() {
					expect(this.element.attr('attribute')).toBe('expando-attr');
				});

				it("should return `null` if the first element in the DOM.Core instance does not have the attribute", function() {
					expect(this.element.attr('nonexistant')).toBe(null);
				});

				it("should return an empty string if the first element in the DOM.Core instance has the attribute, but the attribute does not have a value", function() {
					expect(this.element.attr('bare-attribute')).toBe('');
				});
			});

			describe("when two arguments are given", function() {
				beforeEach(function() {
					this.element = miniDom([
						jasmine.createElement('<div class="one" attribute="first"></div>'),
						jasmine.createElement('<div class="two" attribute="second"></div>')
					]);
				});

				it("should act as a setter for the attribute specified by the first param and set it to the second param for all elements in the set", function() {
					this.element.attr('setter-attribute', 'value');

					expect(this.element[0].getAttribute('setter-attribute')).toBe('value');
					expect(this.element[1].getAttribute('setter-attribute')).toBe('value');
				});

				it("should remove the attribute if the specified value is `null`", function() {
					this.element.attr('attribute', null);

					expect(this.element[0].hasAttribute('attribute')).toBe(false);
					expect(this.element[1].hasAttribute('attribute')).toBe(false);
				});
			});
		});
	});
});
