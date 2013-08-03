"use strict";

define(function(require) {
	var DOM = require('dom/core').mix(require('dom/attr'));

	describe("dom/attr", function() {
		describe("#attr", function() {
			describe("when only one argument is given", function() {
				beforeEach(function() {
					this.element = DOM(jasmine.createElement('<div class="class-name" attribute="expando-attr" bare-attribute></div>'));
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
					this.element = DOM([
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

				it("should return the original instance", function() {
					expect(this.element.attr('not-important', 'ni')).toBe(this.element);
				});
			});
		});

		describe(".hasClass", function() {
			it("should return `true` if the given element has the given class", function() {
				var element = jasmine.createElement('<p class="static-has-class"></p>');
				expect(DOM.hasClass(element, 'static-has-class')).toBe(true);
			});

			it("should return `false` if the given element does not have the given class", function() {
				var element = jasmine.createElement('<p class="static-has-class"></p>');
				expect(DOM.hasClass(element, 'static-does-not-have-class')).toBe(false);
			});
		});

		describe("#hasClass", function() {
			it("should return `true` if the first element of the set has the given class", function() {
				var element = jasmine.createElement('<p class="has-class"></p>');
				var set = DOM(element);

				expect(set.hasClass('has-class')).toBe(true);
			});

			it("should return `false` if the first element of the set does not have the given class", function() {
				var element = jasmine.createElement('<p class="has-class"></p>');
				var secondElement = jasmine.createElement('<p class="second-element"></p>');
				var set = DOM(element);

				expect(set.hasClass('does-not-have-class')).toBe(false);
				expect(set.hasClass('second-element')).toBe(false);
			});
		});

		describe("#addClass", function() {
			beforeEach(function() {
				this.element1 = jasmine.createElement('<p class="test-element"></p>');
				this.element2 = jasmine.createElement('<p class="second-element"></p>');
				this.set = DOM([this.element1, this.element2]);
			});

			it("should return the original set", function() {
				expect(this.set).toBe(this.set.addClass('test-class'));
			});

			describe("when the given argument is a single valid className", function() {
				it("should add the given className to each element in the set", function() {
					this.set.addClass('test-class');

					expect(this.set[0].className).toContain('test-class');
					expect(this.set[1].className).toContain('test-class');
				});
			});

			describe("when the given argument is a space-separated list of classNames", function() {
				it("should add each of the given classNames to each element in the set", function() {
					this.set.addClass('class-one class-two');

					expect(this.set[0]).toMatchSelector('.class-one');
					expect(this.set[0]).toMatchSelector('.class-two');
					expect(this.set[1]).toMatchSelector('.class-one');
					expect(this.set[1]).toMatchSelector('.class-two');
				});
			});

			describe("when the given argument is an array of classNames", function() {
				it("should add each of the given classNames to each element in the set", function() {
					this.set.addClass(['class-one', 'class-two']);

					expect(this.set[0]).toMatchSelector('.class-one');
					expect(this.set[0]).toMatchSelector('.class-two');
					expect(this.set[1]).toMatchSelector('.class-one');
					expect(this.set[1]).toMatchSelector('.class-two');
				});
			});

			it("it should deal with some degree of bad input", function() {
				this.set.addClass([' class-one   class-two  ', 'class-three ']);

				expect(this.set[0]).toMatchSelector('.class-one');
				expect(this.set[0]).toMatchSelector('.class-two');
				expect(this.set[0]).toMatchSelector('.class-three');
				expect(this.set[1]).toMatchSelector('.class-one');
				expect(this.set[1]).toMatchSelector('.class-two');
				expect(this.set[1]).toMatchSelector('.class-three');
			});
		});

		describe("#removeClass", function() {
			beforeEach(function() {
				this.element1 = jasmine.createElement('<p class="test-element test-class"></p>');
				this.element2 = jasmine.createElement('<p class="second-element test-class"></p>');
				this.set = DOM([this.element1, this.element2]);
			});

			it("should return the original set", function() {
				expect(this.set).toBe(this.set.removeClass('test-class'));
			});

			describe("when the given argument is a single valid className", function() {
				it("should remove the given className from each element in the set", function() {
					this.set.removeClass('test-class');

					expect(this.set[0].className).not.toContain('test-class');
					expect(this.set[1].className).not.toContain('test-class');
				});
			});

			describe("when the given argument is a space-separated list of classNames", function() {
				it("should remove each of the given classNames from each element in the set", function() {
					this.set.removeClass('test-element second-element');

					expect(this.set[0]).not.toMatchSelector('.test-element');
					expect(this.set[1]).not.toMatchSelector('.second-element');
				});
			});

			describe("when the given argument is an array of classNames", function() {
				it("should remove each of the given classNames from each element in the set", function() {
					this.set.removeClass(['test-element', 'second-element']);

					expect(this.set[0]).not.toMatchSelector('.test-element');
					expect(this.set[1]).not.toMatchSelector('.second-element');
				});
			});

			it("it should deal with some degree of bad input", function() {
				this.set.removeClass([' test-element   second-element  ', 'test-class ']);

				expect(this.set[0]).not.toMatchSelector('.test-element');
				expect(this.set[0]).not.toMatchSelector('.test-class');
				expect(this.set[1]).not.toMatchSelector('.second-element');
				expect(this.set[1]).not.toMatchSelector('.test-class');
			});
		});

		describe("#toggleClass", function() {
			beforeEach(function() {
				this.element1 = jasmine.createElement('<p class="test-element test-class"></p>');
				this.element2 = jasmine.createElement('<p class="second-element test-class"></p>');
				this.set = DOM([this.element1, this.element2]);
			});

			it("should return the original set", function() {
				expect(this.set).toBe(this.set.toggleClass('test-class'));
			});

			describe("when the given argument is a single valid className", function() {
				it("should toggle the given className on each element of the set", function() {
					this.set.toggleClass('test-element');

					expect(this.set[0]).not.toMatchSelector('.test-element');
					expect(this.set[1]).toMatchSelector('.test-element');
				});
			});

			describe("when the given argument is a space-separated list of classNames", function() {
				it("should toggle each of the given classNames on each element in the set", function() {
					this.set.toggleClass('test-element toggle-class');

					expect(this.set[0]).not.toMatchSelector('.test-element');
					expect(this.set[0]).toMatchSelector('.toggle-class');
					expect(this.set[1]).toMatchSelector('.test-element');
					expect(this.set[1]).toMatchSelector('.toggle-class');
				});
			});

			describe("when the given argument is an array of classNames", function() {
				it("should toggle each of the given classNames from each element in the set", function() {
					this.set.toggleClass(['test-element', 'toggle-class']);

					expect(this.set[0]).not.toMatchSelector('.test-element');
					expect(this.set[0]).toMatchSelector('.toggle-class');
					expect(this.set[1]).toMatchSelector('.test-element');
					expect(this.set[1]).toMatchSelector('.toggle-class');
				});
			});

			describe("when the second argument is `true`", function() {
				it("should add the given classNames to each element in the set", function() {
					this.set.toggleClass('test-element', true);

					expect(this.set[0]).toMatchSelector('.test-element');
					expect(this.set[1]).toMatchSelector('.test-element');
				});
			});

			describe("when the second argument is `false`", function() {
				it("should remove the given classNames from each element in the set", function() {
					this.set.toggleClass('test-element', false);

					expect(this.set[0]).not.toMatchSelector('.test-element');
					expect(this.set[1]).not.toMatchSelector('.test-element');
				});
			});

			describe("when the second argument is a function", function() {
				it("should call the function once per node per className and add or remove the class depending on the return value", function() {
					this.set.toggleClass('one two', function(className) {
						// add the class if it's .test-element and the className is 'one'
						// or if it's .second-element and the className is 'two'
						return (DOM.hasClass(this, 'test-element') && className === 'one') ||
							(DOM.hasClass(this, 'second-element') && className === 'two');
					});

					expect(this.set[0]).toMatchSelector('.test-element');
					expect(this.set[0]).toMatchSelector('.one');
					expect(this.set[0]).not.toMatchSelector('.two');
					expect(this.set[1]).toMatchSelector('.second-element');
					expect(this.set[1]).not.toMatchSelector('.one');
					expect(this.set[1]).toMatchSelector('.two');
				});
			});

			it("it should deal with some degree of bad input", function() {
				this.set.toggleClass([' test-element   toggle-class  ', 'test-class ']);

				expect(this.set[0]).not.toMatchSelector('.test-element');
				expect(this.set[0]).not.toMatchSelector('.test-class');
				expect(this.set[0]).toMatchSelector('.toggle-class');
				expect(this.set[1]).toMatchSelector('.second-element');
				expect(this.set[1]).not.toMatchSelector('.test-class');
				expect(this.set[1]).toMatchSelector('.toggle-class');
			});
		});
	});
});
