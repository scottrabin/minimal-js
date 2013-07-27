"use strict";

define(function(require) {
	var miniDom = require('dom/core');

	describe("dom/core", function() {
		describe("when instantiated", function() {
			describe("when not given a context", function() {
				beforeEach(function() {
					this.fixture = jasmine.createFixture('<div class="no-context"></div>');
				});

				it("should select all specified nodes in the document", function() {
					var test = miniDom('.no-context');

					expect(test[0]).toBe(this.fixture);
					expect(test.length).toBe(1);
				});
			});

			describe("when given a context", function() {
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
					var test = miniDom('.selector', document.getElementById('context-element'));

					expect(test.length).toBe(2);
					expect(test[0].innerHTML).toBe('first grandchild');
					expect(test[1].innerHTML).toBe('second grandchild');
				});
			});
		});
	});
});
