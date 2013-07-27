"use strict";

define(function(require) {
	var select = require('dom/selector');

	describe("dom/selector", function() {
		beforeEach(function() {
			this.fixture = jasmine.createFixture('<div class="selector"></div>');
			this.childOne = jasmine.createElement('<span class="child one selector">first child</span>');
			this.childTwo = jasmine.createElement('<span class="child two selector">second child</span>');
			this.contextElement = jasmine.createElement('<p id="context-element" class="child three selector"></p>');
			this.grandchildOne = jasmine.createElement('<span class="grandchild one selector">first grandchild</span>');
			this.grandchildTwo = jasmine.createElement('<a href="http://scottrabin.com" class="grandchild two selector">second grandchild</a>');

			this.fixture.appendChild(this.childOne);
			this.fixture.appendChild(this.childTwo);
			this.fixture.appendChild(this.contextElement);
			this.contextElement.appendChild(this.grandchildOne);
			this.contextElement.appendChild(this.grandchildTwo);
		});

		describe("[Callable]", function() {
			it("should select all elements beneath the context element and insert it into the given output array", function() {
				var fullResult = [];
				select('.one', document.documentElement, fullResult);
				expect(fullResult).toEqual([this.childOne, this.grandchildOne]);

				var contextResult = ['already populated'];
				select('.one', this.contextElement, contextResult);
				expect(contextResult).toEqual(['already populated', this.grandchildOne]);
			});
		});

		describe(".matchesSelector", function() {
			it("should return `true` when the selector matches the element", function() {
				expect(select.matchesSelector(this.childOne, '.one')).toBe(true);
				expect(select.matchesSelector(this.contextElement, '#context-element')).toBe(true);
				expect(select.matchesSelector(this.grandchildTwo, 'a')).toBe(true);
				expect(select.matchesSelector(this.contextElement, 'p.child.three')).toBe(true);
			});

			it("should correctly match complex selectors", function() {
				expect(select.matchesSelector(this.grandchildTwo, '.child.three a[href]')).toBe(true);
			});

			it("should return `false` when the selector does not match", function() {
				expect(select.matchesSelector(this.childTwo, '.one')).toBe(false);
				expect(select.matchesSelector(this.grandchildOne, '.two')).toBe(false);
			});
		});

		describe(".matches", function() {
			it("should return only the list of elements matching the given selector", function() {
				var initialResults = select('.selector');
				expect(initialResults).toEqual([this.fixture, this.childOne, this.childTwo, this.contextElement, this.grandchildOne, this.grandchildTwo]);

				expect(select.matches('.two', initialResults)).toEqual([this.childTwo, this.grandchildTwo]);
			});
		});
	});
});
