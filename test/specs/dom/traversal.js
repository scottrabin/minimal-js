"use strict";

define(function(require) {
	// the dom/traversal module will install itself
	require('dom/traversal');
	var miniDom = require('dom/core');

	describe("dom/traversal", function() {
		beforeEach(function() {
			this.fixture = jasmine.createFixture('<div class="selector"></div>');
			this.childOne = jasmine.createElement('<span class="child one selector">first child</span>');
			this.childTwo = jasmine.createElement('<span class="child two selector">second child</span>');
			this.contextElement = jasmine.createElement('<p id="context-element" class="child three selector"></p>');
			this.grandchildOne = jasmine.createElement('<span class="grandchild one selector">first grandchild</span>');
			this.grandchildTwo = jasmine.createElement('<a href="http://scottrabin.com" class="grandchild two selector">second grandchild</a>');
			this.grandchildThree = jasmine.createElement('<span class="grandchild one three selector"></span>');
			this.grandchildFour = jasmine.createElement('<span class="grandchild two four selector"></span>');

			this.fixture.appendChild(this.childOne);
			this.fixture.appendChild(this.childTwo);
			this.fixture.appendChild(this.contextElement);
			this.childOne.appendChild(this.grandchildOne);
			this.childOne.appendChild(this.grandchildTwo);
			this.childTwo.appendChild(this.grandchildThree);
			this.childTwo.appendChild(this.grandchildFour);
		});

		describe("#children", function() {
			it("should return the set of elements composed of the children from each element in the existing set", function() {
				var first = miniDom([this.childOne, this.childTwo]);
				var children = first.children();

				expect(children.length).toBe(4);
				expect(children[0]).toBe(this.grandchildOne);
				expect(children[1]).toBe(this.grandchildTwo);
				expect(children[2]).toBe(this.grandchildThree);
				expect(children[3]).toBe(this.grandchildFour);
			});

			it("should not modify the original instance", function() {
				var original = miniDom([this.childOne]);
				original.children();
				expect(original.length).toBe(1);
				expect(original[0]).toBe(this.childOne);
			});
		});

		describe("#closest", function() {
			it("should return the original node if it matches the provided selector", function() {
				var original = miniDom(this.grandchildOne);
				var closest = original.closest('.grandchild');
				expect(closest.length).toBe(1);
				expect(closest[0]).toBe(this.grandchildOne);
			});

			it("should return the nearest ancestor node matching the provided selector for each element in the set", function() {
				var original = miniDom([this.grandchildOne, this.grandchildThree]);
				var closest = original.closest('.child');
				expect(closest.length).toBe(2);
				expect(closest[0]).toBe(this.childOne);
				expect(closest[1]).toBe(this.childTwo);
			});

			it("should not modify the original instance", function() {
				var original = miniDom([this.grandchildOne]);
				original.closest('.child');
				expect(original.length).toBe(1);
				expect(original[0]).toBe(this.grandchildOne);
			});
		});

		describe("#select", function() {
			beforeEach(function() {
				this.descendant = jasmine.createElement('<span class="descendant one"></span>');
				this.grandchildFour.appendChild(this.descendant);
			});

			it("should return a set of all descendant elements from each node in the current set matching the given selector", function() {
				var original = miniDom([this.childOne, this.childTwo]);
				var select = original.select('.one');

				expect(select.length).toBe(3);
				expect(select[0]).toBe(this.grandchildOne);
				expect(select[1]).toBe(this.grandchildThree);
				expect(select[2]).toBe(this.descendant);
			});

			it("should not modify the original instance", function() {
				var original = miniDom([this.childOne]);
				original.select('.grandchild');
				expect(original.length).toBe(1);
				expect(original[0]).toBe(this.childOne);
			});
		});
	});
});
