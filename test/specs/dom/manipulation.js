"use strict";

define(function(require) {
	var DOM = require('dom/core').mix(require('dom/manipulation'));

	describe("dom/manipulation", function() {
		beforeEach(function() {
			this.parentOne = jasmine.createFixture('<div class="parent"></div>');
			this.childOne  = jasmine.createElement('<div class="child"></div>');
			this.parentOne.appendChild(this.childOne);

			this.parentTwo = jasmine.createFixture('<div class="parent"></div>');
			this.childTwo  = jasmine.createElement('<div class="child"></div>');
			this.parentTwo.appendChild(this.childTwo);
		});

		describe("#prepend", function() {
			it("should return the original set of elements", function() {
				var dummyElement = document.createElement('div');
				var set = DOM([this.parentOne, this.parentTwo]).prepend(dummyElement);

				expect(set[0]).toBe(this.parentOne);
				expect(set[1]).toBe(this.parentTwo);
				expect(set.length).toBe(2);
			});

			describe("when called with an HTMLElement", function() {
				it("should insert a copy of given element as the first child in each element in the set", function() {
					var	prependedElement = jasmine.createElement('<span class="prepend"></span>');
					var set = DOM([this.parentOne, this.parentTwo]).prepend(prependedElement);

					expect(this.parentOne.children[0]).toMatchSelector('span.prepend');
					expect(this.parentOne.children[1]).toBe(this.childOne);
					expect(this.parentOne.children.length).toBe(2);
					expect(this.parentTwo.children[0]).toMatchSelector('span.prepend');
					expect(this.parentTwo.children[1]).toBe(this.childTwo);
					expect(this.parentTwo.children.length).toBe(2);
				});
			});

			describe("when called with a string", function() {
				it("should convert the string into a node and insert a copy into each element in the set as the first node", function() {
					var set = DOM([this.parentOne, this.parentTwo]).prepend('<span class="prepend"></span>');

					expect(this.parentOne.children[0]).toMatchSelector('span.prepend');
					expect(this.parentOne.children[1]).toBe(this.childOne);
					expect(this.parentOne.children.length).toBe(2);
					expect(this.parentTwo.children[0]).toMatchSelector('span.prepend');
					expect(this.parentTwo.children[1]).toBe(this.childTwo);
					expect(this.parentTwo.children.length).toBe(2);
				});
			});
		});

		describe("#append", function() {
			it("should return the original set of elements", function() {
				var dummyElement = document.createElement('div');
				var set = DOM([this.parentOne, this.parentTwo]).append(dummyElement);

				expect(set[0]).toBe(this.parentOne);
				expect(set[1]).toBe(this.parentTwo);
				expect(set.length).toBe(2);
			});

			describe("when called with an HTMLElement", function() {
				it("should insert a copy of given element as the last child in each element in the set", function() {
					var	appendedElement = jasmine.createElement('<span class="append"></span>');
					var set = DOM([this.parentOne, this.parentTwo]).append(appendedElement);

					expect(this.parentOne.children[0]).toBe(this.childOne);
					expect(this.parentOne.children[1]).toMatchSelector('span.append');
					expect(this.parentOne.children.length).toBe(2);
					expect(this.parentTwo.children[0]).toBe(this.childTwo);
					expect(this.parentTwo.children[1]).toMatchSelector('span.append');
					expect(this.parentTwo.children.length).toBe(2);
				});
			});

			describe("when called with a string", function() {
				it("should convert the string into a node and insert a copy into each element in the set as the last node", function() {
					var set = DOM([this.parentOne, this.parentTwo]).append('<span class="append"></span>');

					expect(this.parentOne.children[0]).toBe(this.childOne);
					expect(this.parentOne.children[1]).toMatchSelector('span.append');
					expect(this.parentOne.children.length).toBe(2);
					expect(this.parentTwo.children[0]).toBe(this.childTwo);
					expect(this.parentTwo.children[1]).toMatchSelector('span.append');
					expect(this.parentTwo.children.length).toBe(2);
				});
			});
		});

		describe("#before", function() {
			it("should return the original set of elements", function() {
				var dummyElement = document.createElement('div');
				var set = DOM([this.parentOne, this.parentTwo]).before(dummyElement);

				expect(set[0]).toBe(this.parentOne);
				expect(set[1]).toBe(this.parentTwo);
				expect(set.length).toBe(2);
			});

			describe("when called with an HTMLElement", function() {
				it("should insert a copy of given element as the previous sibling to each element in the set", function() {
					var	beforeElement = jasmine.createElement('<span class="before"></span>');
					var set = DOM([this.parentOne, this.parentTwo]).before(beforeElement);

					expect(this.parentOne.children[0]).toBe(this.childOne);
					expect(this.parentOne.children.length).toBe(1);
					expect(this.parentOne.previousSibling).toMatchSelector('span.before');
					expect(this.parentTwo.children[0]).toBe(this.childTwo);
					expect(this.parentTwo.children.length).toBe(1);
					expect(this.parentTwo.previousSibling).toMatchSelector('span.before');
				});
			});

			describe("when called with a string", function() {
				it("should convert the string into a node and insert a copy before each element in the set", function() {
					var set = DOM([this.parentOne, this.parentTwo]).before('<span class="before"></span>');

					expect(this.parentOne.children[0]).toBe(this.childOne);
					expect(this.parentOne.children.length).toBe(1);
					expect(this.parentOne.previousSibling).toMatchSelector('span.before');
					expect(this.parentTwo.children[0]).toBe(this.childTwo);
					expect(this.parentTwo.children.length).toBe(1);
					expect(this.parentTwo.previousSibling).toMatchSelector('span.before');
				});
			});
		});

		describe("#after", function() {
			it("should return the original set of elements", function() {
				var dummyElement = document.createElement('div');
				var set = DOM([this.parentOne, this.parentTwo]).after(dummyElement);

				expect(set[0]).toBe(this.parentOne);
				expect(set[1]).toBe(this.parentTwo);
				expect(set.length).toBe(2);
			});

			describe("when called with an HTMLElement", function() {
				it("should insert a copy of given element as the next sibling to each element in the set", function() {
					var	afterElement = jasmine.createElement('<span class="after"></span>');
					var set = DOM([this.parentOne, this.parentTwo]).after(afterElement);

					expect(this.parentOne.children[0]).toBe(this.childOne);
					expect(this.parentOne.children.length).toBe(1);
					expect(this.parentOne.nextSibling).toMatchSelector('span.after');
					expect(this.parentTwo.children[0]).toBe(this.childTwo);
					expect(this.parentTwo.children.length).toBe(1);
					expect(this.parentTwo.nextSibling).toMatchSelector('span.after');
				});
			});

			describe("when called with a string", function() {
				it("should convert the string into a node and insert a copy after each element in the set", function() {
					var set = DOM([this.parentOne, this.parentTwo]).after('<span class="after"></span>');

					expect(this.parentOne.children[0]).toBe(this.childOne);
					expect(this.parentOne.children.length).toBe(1);
					expect(this.parentOne.nextSibling).toMatchSelector('span.after');
					expect(this.parentTwo.children[0]).toBe(this.childTwo);
					expect(this.parentTwo.children.length).toBe(1);
					expect(this.parentTwo.nextSibling).toMatchSelector('span.after');
				});
			});
		});

		describe("#replaceWith", function() {
			it("should return the original set of elements", function() {
				var dummyElement = document.createElement('div');
				var set = DOM([this.parentOne, this.parentTwo]).replaceWith(dummyElement);

				expect(set[0]).toBe(this.parentOne);
				expect(set[1]).toBe(this.parentTwo);
				expect(set.length).toBe(2);
			});

			describe("when called with an HTMLElement", function() {
				it("should replace each element in the set with a copy of the given element", function() {
					var replaceWith = jasmine.createElement('<p class="replacement"></p>');
					var originalP1Parent = this.parentOne.parentNode;
					var originalP1Position = Array.prototype.indexOf.call(originalP1Parent.children, this.parentOne);
					var set = DOM([this.parentOne, this.childTwo]).replaceWith(replaceWith);

					expect(this.parentOne).not.toBeInTheDocument();
					expect(this.childTwo).not.toBeInTheDocument();
					expect(originalP1Parent.children[originalP1Position]).toMatchSelector('p.replacement');
					expect(this.parentTwo.children[0]).toMatchSelector('p.replacement');
					expect(this.parentTwo.children.length).toBe(1);
				});
			});

			describe("when called with a string", function() {
				it("should convert the string into a node and replace each element in the set with a copy of the inflated node", function() {
					var originalP1Parent = this.parentOne.parentNode;
					var originalP1Position = Array.prototype.indexOf.call(originalP1Parent.children, this.parentOne);
					var set = DOM([this.parentOne, this.childTwo]).replaceWith('<p class="replacement"></p>');

					expect(this.parentOne).not.toBeInTheDocument();
					expect(this.childTwo).not.toBeInTheDocument();
					expect(originalP1Parent.children[originalP1Position]).toMatchSelector('p.replacement');
					expect(this.parentTwo.children[0]).toMatchSelector('p.replacement');
					expect(this.parentTwo.children.length).toBe(1);
				});
			});
		});

		describe("#html", function() {
			describe("when called with an HTMLElement", function() {
				it("should return the original set of elements", function() {
					var dummyElement = document.createElement('div');
					var set = DOM([this.parentOne, this.parentTwo]).html(dummyElement);

					expect(set[0]).toBe(this.parentOne);
					expect(set[1]).toBe(this.parentTwo);
					expect(set.length).toBe(2);
				});

				it("should replace the contents of each element in the set with a copy of the given HTMLElement", function() {
					var html = jasmine.createElement('<p class="html-contents"></p>');
					var set = DOM([this.parentOne, this.parentTwo]).html(html);

					expect(this.parentOne.children[0]).toMatchSelector('p.html-contents');
					expect(this.parentOne.children.length).toBe(1);
					expect(this.parentTwo.children[0]).toMatchSelector('p.html-contents');
					expect(this.parentTwo.children.length).toBe(1);
				});
			});

			describe("when called with a string", function() {
				it("should replace the contents of each element in the set with an inflated copy of the given markup", function() {
					var set = DOM([this.parentOne, this.parentTwo]).html('<p class="html-contents"></p>');

					expect(this.parentOne.children[0]).toMatchSelector('p.html-contents');
					expect(this.parentOne.children.length).toBe(1);
					expect(this.parentTwo.children[0]).toMatchSelector('p.html-contents');
					expect(this.parentTwo.children.length).toBe(1);
				});
			});
		});

		describe("#text", function() {
			describe("when called with a string", function() {
				it("should return the original set of elements", function() {
					var dummyElement = document.createElement('div');
					var set = DOM([this.parentOne, this.parentTwo]).text(dummyElement);

					expect(set[0]).toBe(this.parentOne);
					expect(set[1]).toBe(this.parentTwo);
					expect(set.length).toBe(2);
				});

				it("should replace the contents of each element in the set with an HTML-entitized version of the given string", function() {
					var set = DOM([this.parentOne, this.parentTwo]).text('<p class="text-contents"></p>');

					expect(this.parentOne.children.length).toBe(0);
					expect(this.parentOne.textContent).toBe('<p class="text-contents"></p>');
					expect(this.parentTwo.children.length).toBe(0);
					expect(this.parentTwo.textContent).toBe('<p class="text-contents"></p>');
				});
			});
		});

		describe("#remove", function() {
			it("should return the original set of elements", function() {
				var set = DOM([this.parentOne, this.parentTwo]).remove();

				expect(set[0]).toBe(this.parentOne);
				expect(set[1]).toBe(this.parentTwo);
				expect(set.length).toBe(2);
			});

			it("should remove the elements in the set from the DOM", function() {
				var set = DOM([this.parentOne, this.childTwo]).remove();

				expect(this.parentOne).not.toBeInTheDocument();
				expect(this.parentTwo).toBeInTheDocument();
				expect(this.childTwo).not.toBeInTheDocument();
			});

			it("should not throw an error if an element in the set has already been removed from its parent", function() {
				var set = DOM([this.parentOne, this.parentTwo]);
				this.parentTwo.parentNode.removeChild(this.parentTwo);

				expect(function() {
					set.remove();
				}).not.toThrow();
			});
		});

		describe("#empty", function() {
			it("should return the original set of elements", function() {
				var set = DOM([this.parentOne, this.parentTwo]).empty();

				expect(set[0]).toBe(this.parentOne);
				expect(set[1]).toBe(this.parentTwo);
				expect(set.length).toBe(2);
			});

			it("should remove all contents from each element in the set", function() {
				var set = DOM([this.parentOne, this.parentTwo]).empty();

				expect(this.parentOne.children.length).toBe(0);
				expect(this.parentTwo.children.length).toBe(0);
			});
		});
	});
});
