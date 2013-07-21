"use strict";

define(function(require) {
	var create = require('main');
	var Arraylike = require('mixin/arraylike');

	var ConstructedClass = create(Arraylike);

	describe("mixin/arraylike", function() {
		beforeEach(function() {
			this.instance = new ConstructedClass();
		});

		describe("#toString", function() {
			// TODO
		});

		describe("#toLocaleString", function() {
			// TODO
		});

		describe("#concat", function() {
			it("should return the an instance of the constructed class with the concatenated elements", function() {
				this.instance.push('one', 'two', 'three');
				var newInstance = this.instance.concat([1, 2, 3]);

				expect(newInstance instanceof ConstructedClass).toBe(true);
				expect(newInstance[0]).toBe('one');
				expect(newInstance[1]).toBe('two');
				expect(newInstance[2]).toBe('three');
				expect(newInstance[3]).toBe(1);
				expect(newInstance[4]).toBe(2);
				expect(newInstance[5]).toBe(3);
				expect(newInstance.length).toBe(6);
			});

			it("should not affect the elements of the original object", function() {
				this.instance.push('one', 'two', 'three');
				var newInstance = this.instance.concat([1, 2, 3]);

				expect(this.instance[0]).toBe('one');
				expect(this.instance[1]).toBe('two');
				expect(this.instance[2]).toBe('three');
				expect(this.instance.length).toBe(3);
			});

			it("should correctly concatenate other arraylike objects", function() {
				this.instance.push('one', 'two', 'three');
				var otherInstance = new ConstructedClass();
				otherInstance.push(1, 2, 3);
				var newInstance = this.instance.concat(otherInstance);

				expect(newInstance instanceof ConstructedClass).toBe(true);
				expect(newInstance[0]).toBe('one');
				expect(newInstance[1]).toBe('two');
				expect(newInstance[2]).toBe('three');
				expect(newInstance[3]).toBe(1);
				expect(newInstance[4]).toBe(2);
				expect(newInstance[5]).toBe(3);
				expect(newInstance.length).toBe(6);
			});
			// TODO
		});

		describe("#join", function() {
			// TODO
		});

		describe("#pop", function() {
			it("should return the last element of the array", function() {
				this.instance.push('one', 'two', 'three');
				expect(this.instance.length).toBe(3);
				expect(this.instance.pop()).toBe('three');
				expect(this.instance.length).toBe(2);
				expect(this.instance.hasOwnProperty(2)).toBe(false);
			});

			it("should return undefined and leave length at 0 when called on an 'empty' object", function() {
				expect(this.instance.length).toBe(0);
				expect(this.instance.pop()).toBeUndefined();
				expect(this.instance.length).toBe(0);
			});
		});

		describe("#push", function() {
			it("should correctly assign arguments to the object when it is empty", function() {
				this.instance.push('one', 2, true);

				expect(this.instance[0]).toBe('one');
				expect(this.instance[1]).toBe(2);
				expect(this.instance[2]).toBe(true);
			});

			it("should correctly assign arguments to the object when it already contains values", function() {
				this.instance.push('one', 2, true);

				expect(this.instance[0]).toBe('one');
				expect(this.instance[1]).toBe(2);
				expect(this.instance[2]).toBe(true);
				expect(this.instance.length).toBe(3);

				this.instance.push(3, 'four', 5);
				expect(this.instance[0]).toBe('one');
				expect(this.instance[1]).toBe(2);
				expect(this.instance[2]).toBe(true);
				expect(this.instance[3]).toBe(3);
				expect(this.instance[4]).toBe('four');
				expect(this.instance[5]).toBe(5);
				expect(this.instance.length).toBe(6);
			});
		});

		describe("#reverse", function() {
			beforeEach(function() {
				this.instance.push('one', 'two', 'three');
			});

			it("should return the an instance of the constructed class with the element order reversed", function() {
				var instance = this.instance.reverse();

				expect(instance instanceof ConstructedClass).toBe(true);
				expect(instance[0]).toBe('three');
				expect(instance[1]).toBe('two');
				expect(instance[2]).toBe('one');
				expect(instance.length).toBe(3);
			});

			it("should mutate the original object", function() {
				this.instance.reverse();

				expect(this.instance[0]).toBe('three');
				expect(this.instance[1]).toBe('two');
				expect(this.instance[2]).toBe('one');
				expect(this.instance.length).toBe(3);
			});
		});

		describe("#shift", function() {
			// TODO
		});

		describe("#slice", function() {
			beforeEach(function() {
				this.instance.push('one', 'two', 'three');
			});

			it("should return an instance of the constructed class with the elements starting at the given index", function() {
				var instance = this.instance.slice(1);

				expect(instance instanceof ConstructedClass).toBe(true);
				expect(instance[0]).toBe('two');
				expect(instance[1]).toBe('three');
				expect(instance.length).toBe(2);
			});

			it("should not mutate the original object", function() {
				var instance = this.instance.slice(1);

				expect(this.instance[0]).toBe('one');
				expect(this.instance[1]).toBe('two');
				expect(this.instance[2]).toBe('three');
				expect(this.instance.length).toBe(3);
			});
		});

		describe("#sort", function() {
			beforeEach(function() {
				this.instance.push(5, 6, 3, 1, 4, 8);
			});

			it("should sort the elements of the arraylike object in place", function() {
				this.instance.sort();

				expect(this.instance[0]).toBe(1);
				expect(this.instance[1]).toBe(3);
				expect(this.instance[2]).toBe(4);
				expect(this.instance[3]).toBe(5);
				expect(this.instance[4]).toBe(6);
				expect(this.instance[5]).toBe(8);
			});

			it("should accept a function of two parameters and sort according to the provided function", function() {
				this.instance.sort(function(a, b) {
					// sort by even-ness then by size
					return ((a % 2 === 0 ? 10 : 1) * a) - ((b % 2 === 0 ? 10 : 1) * b);
				});

				expect(this.instance[0]).toBe(1);
				expect(this.instance[1]).toBe(3);
				expect(this.instance[2]).toBe(5);
				expect(this.instance[3]).toBe(4);
				expect(this.instance[4]).toBe(6);
				expect(this.instance[5]).toBe(8);
			});
		});

		describe("#splice", function() {
			beforeEach(function() {
				this.instance.push(5, 6, 3, 1, 4, 8);
			});

			it("should return the an instance of the constructed class with the removed elements", function() {
				var removedElements = this.instance.splice(1, 2);

				expect(removedElements instanceof ConstructedClass).toBe(true);
				expect(removedElements[0]).toBe(6);
				expect(removedElements[1]).toBe(3);
				expect(removedElements.length).toBe(2);
			});

			it("should mutate the original object", function() {
				var removedElements = this.instance.splice(1, 2);

				expect(this.instance[0]).toBe(5);
				expect(this.instance[1]).toBe(1);
				expect(this.instance[2]).toBe(4);
				expect(this.instance[3]).toBe(8);
				expect(this.instance.length).toBe(4);
			});
		});

		describe("#unshift", function() {
			// TODO
		});

		describe("#indexOf", function() {
			// TODO
		});

		describe("#lastIndexOf", function() {
			// TODO
		});

		describe("#every", function() {
			// TODO
		});

		describe("#some", function() {
			// TODO
		});

		describe("#forEach", function() {
			// TODO
		});

		describe("#map", function() {
			// TODO
		});

		describe("#filter", function() {
			beforeEach(function() {
				this.instance.push(5, 6, 3, 1, 4, 8);
			});

			it("should return the an instance of the constructed class with the elements passing the provided test", function() {
				var filteredObject = this.instance.filter(function(val) {
					return val % 2 === 0;
				});

				expect(filteredObject instanceof ConstructedClass).toBe(true);
				expect(filteredObject[0]).toBe(6);
				expect(filteredObject[1]).toBe(4);
				expect(filteredObject[2]).toBe(8);
				expect(filteredObject.length).toBe(3);
			});

			it("should not mutate the original object", function() {
				var filteredObject = this.instance.filter(function(val) {
					return val % 2 === 0;
				});

				expect(this.instance[0]).toBe(5);
				expect(this.instance[1]).toBe(6);
				expect(this.instance[2]).toBe(3);
				expect(this.instance[3]).toBe(1);
				expect(this.instance[4]).toBe(4);
				expect(this.instance[5]).toBe(8);
				expect(this.instance.length).toBe(6);
			});
		});

		describe("#reduce", function() {
			// TODO
		});

		describe("#reduceRight", function() {
			// TODO
		});

		describe("#sortBy", function() {
			beforeEach(function() {
				this.instance.push(
					{a: true, b: 1},
					{a: true, b: 8},
					{a: true, b: 9},
					{a: false, b: 2},
					{a: false, b: 7},
					{a: false, b: 13}
				);
			});

			it("should return the object with elements sorted by the provided transform function", function() {
				this.instance.sortBy(function(item) {
					return (item.a ? 10 : 0) + item.b;
				});

				expect(this.instance[0]).toEqual({a: false, b: 2});
				expect(this.instance[1]).toEqual({a: false, b: 7});
				expect(this.instance[2]).toEqual({a: true,  b: 1});
				expect(this.instance[3]).toEqual({a: false, b: 13});
				expect(this.instance[4]).toEqual({a: true,  b: 8});
				expect(this.instance[5]).toEqual({a: true,  b: 9});
			});
		});
	});
});
