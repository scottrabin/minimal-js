"use strict";

define(function(require) {
	var DOM = require('dom/core');

	describe("dom/core", function() {
		describe("when instantiated", function() {
			describe("when no arguments are given", function() {
				it("should return a new, empty instance", function() {
					var instance = DOM();

					expect(instance.length).toBe(0);
				});
			});

			describe("when the first argument is a DOM.Core instance", function() {
				it("should return that instance", function() {
					var instance = DOM();
					var idempotent = DOM(instance);

					expect(idempotent).toBe(instance);
				});
			});

			describe("when the first argument is a DOM element", function() {
				it("should return an instance of DOM.Core with the element contained", function() {
					var element = jasmine.createElement('<span class="item-1"></span>');
					var instance = DOM(element);

					expect(instance[0]).toBe(element);
					expect(instance.length).toBe(1);
				});
			});

			describe("when the first argument is an array of DOM elements", function() {
				it("should return an instance containing the given DOM elements", function() {
					var element1 = jasmine.createElement('<span class="item-1"></span>');
					var element2 = jasmine.createElement('<p class="item-2"></p>');
					var instance = DOM([element1, element2]);

					expect(instance[0]).toBe(element1);
					expect(instance[1]).toBe(element2);
					expect(instance.length).toBe(2);
				});
			});

			describe("when the first argument is a string selector", function() {
				describe("when not given a context as a second argument", function() {
					beforeEach(function() {
						this.fixture = jasmine.createFixture('<div class="no-context"></div>');
					});

					it("should select all specified nodes in the document", function() {
						var test = DOM('.no-context');

						expect(test[0]).toBe(this.fixture);
						expect(test.length).toBe(1);
					});
				});

				describe("when given a context as a second argument", function() {
					beforeEach(function() {
						this.fixture = jasmine.createFixture('<div class="selector"></div>');
						this.fixture.innerHTML =
							'<span class="child one selector">first child</span>' +
							'<span class="child two selector">second child</span>' +
							'<p id="context-element" class="child three selector">' +
								'<span class="grandchild one selector">first grandchild</span>' +
								'<span class="grandchild two selector">second grandchild</span>' +
							'</p>';
					});

					it("should only select the nodes beneath the specified context element", function() {
						var test = DOM('.selector', document.getElementById('context-element'));

						expect(test.length).toBe(2);
						expect(test[0].innerHTML).toBe('first grandchild');
						expect(test[1].innerHTML).toBe('second grandchild');
					});
				});
			});

			describe("when the first argument is none of the above", function() {
				it("should return an empty instance", function() {
					var withBool = DOM(true);
					var withNull = DOM(null);
					var withObj  = DOM({one: 1, two: true});

					expect(withBool.length).toBe(0);
					expect(withNull.length).toBe(0);
					expect(withObj.length).toBe(0);
				});
			});
		});

		describe(".fragment", function() {
			// TODO
		});
	});
});
