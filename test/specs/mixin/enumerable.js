"use strict";

define(function(require) {
	var create = require('main');
	var Enumerable = require('mixin/enumerable');

	var MissingClass = create(Enumerable);
	var ConstructedClass = create(Enumerable, {
		forEach: function(callback, thisObject) {
			this.forEachReturnValue = [
				callback.call(thisObject || this, 'zero', 0, this),
				callback.call(thisObject || this, 'one', 1, this),
				callback.call(thisObject || this, 'two', 2, this),
				callback.call(thisObject || this, 'three', 3, this),
				callback.call(thisObject || this, 'four', 4, this),
				callback.call(thisObject || this, 'five', 5, this),
			];
		}
	});

	describe("mixin/enumerable", function() {
		beforeEach(function() {
			this.badInstance = new MissingClass();
			this.instance = new ConstructedClass();
		});
		describe("#forEach", function() {
			it("should throw an error when trying to invoke `forEach` when not defined", function() {
				expect(function() {
					this.badInstance.forEach(function(){});
				}).toThrow();
			});
		});

		describe("#every", function() {
			it("should throw an error when trying to invoke `every` when `forEach` is not defined", function() {
				expect(function() {
					this.badInstance.every(function(){});
				}).toThrow();
			});

			it("should return true if the function evaluates to true for all elements in the array", function() {
				expect(this.instance.every(function() { return true; })).toBe(true);
			});

			it("should return false if the function evaluates to false for any invocation", function() {
				expect(this.instance.every(function(value, key, array) {
					return key > 0;
				})).toBe(false);
			});

			it("should accept an optional second parameter to use as `this` in the provided function", function() {
				var defaultSpy = jasmine.createSpy('default');
				var providedSpy = jasmine.createSpy('provided');
				var context = {};

				this.instance.every(defaultSpy);
				this.instance.every(providedSpy, context);

				expect(defaultSpy.mostRecentCall.object).toBe(this.instance);
				expect(providedSpy.mostRecentCall.object).toBe(context);
			});

			it("should return `false` when the first non-matching element is encountered", function() {
				this.instance.every(function(value, key) { return key < 2; });

				expect(this.instance.forEachReturnValue).toEqual([true, true, false, false, false, false]);
			});

			it("should not invoke the callback after the first non-matching element is encountered", function() {
				var spy = jasmine.createSpy('everyFn').andCallFake(function(val, key) {
					return key < 1;
				});

				this.instance.every(spy);

				expect(spy.callCount).toBe(2);
			});
		});

		describe("#filter", function() {
			it("should throw an error when trying to invoke `filter` when `forEach` is not defined", function() {
				expect(function() {
					this.badInstance.filter(function(){});
				}).toThrow();
			});

			it("should return a new array comprising the elements for which the provided function returns true", function() {
				expect(this.instance.filter(function(value, key, array) {
					return key % 2 === 0;
				})).toEqual(['zero', 'two', 'four']);
			});

			it("should accept an optional second parameter to use as `this` in the provided function", function() {
				var defaultSpy = jasmine.createSpy('default');
				var providedSpy = jasmine.createSpy('provided');
				var context = {};

				this.instance.filter(defaultSpy);
				this.instance.filter(providedSpy, context);

				expect(defaultSpy.mostRecentCall.object).toBe(this.instance);
				expect(providedSpy.mostRecentCall.object).toBe(context);
			});
		});

		describe("#find", function() {
			it("should throw an error when trying to invoke `find` when `forEach` is not defined", function() {
				expect(function() {
					this.badInstance.find(function(){});
				}).toThrow();
			});

			it("should return the first value of the enumerable object for which the provided function returns true", function() {
				expect(this.instance.find(function(value, key, array) {
					return key % 2 === 1;
				})).toBe('one');
			});

			it("should accept an optional second parameter to use as `this` in the provided function", function() {
				var defaultSpy = jasmine.createSpy('default');
				var providedSpy = jasmine.createSpy('provided');
				var context = {};

				this.instance.find(defaultSpy);
				this.instance.find(providedSpy, context);

				expect(defaultSpy.mostRecentCall.object).toBe(this.instance);
				expect(providedSpy.mostRecentCall.object).toBe(context);
			});

			it("should return `false` from the iterator when the first matching element is encountered", function() {
				this.instance.find(function(value, key) { return key > 2; });

				expect(this.instance.forEachReturnValue).toEqual([true, true, true, false, false, false]);
			});

			it("should not invoke the callback after the first non-matching element is encountered", function() {
				var spy = jasmine.createSpy('findFn').andCallFake(function(val, key) {
					return key > 1;
				});

				this.instance.find(spy);

				expect(spy.callCount).toBe(3);
			});
		});

		describe("#findLast", function() {
			it("should throw an error when trying to invoke `findLast` when `forEach` is not defined", function() {
				expect(function() {
					this.badInstance.findLast(function(){});
				}).toThrow();
			});

			it("should return the last value of the enumerable object for which the provided function returns true", function() {
				expect(this.instance.findLast(function(value, key, array) {
					return key % 2 === 1;
				})).toBe('five');
			});

			it("should accept an optional second parameter to use as `this` in the provided function", function() {
				var defaultSpy = jasmine.createSpy('default');
				var providedSpy = jasmine.createSpy('provided');
				var context = {};

				this.instance.findLast(defaultSpy);
				this.instance.findLast(providedSpy, context);

				expect(defaultSpy.mostRecentCall.object).toBe(this.instance);
				expect(providedSpy.mostRecentCall.object).toBe(context);
			});
		});

		describe("#first", function() {
			it("should throw an error when trying to invoke `first` when `forEach` is not defined", function() {
				expect(function() {
					this.badInstance.first(function(){});
				}).toThrow();
			});

			it("should return the first element of an enumerable object", function() {
				expect(this.instance.first()).toBe('zero');
			});

			it("should return `false` from the iterator", function() {
				this.instance.first();

				expect(this.instance.forEachReturnValue).toEqual([false, false, false, false, false, false]);
			});
		});

		describe("#groupBy", function() {
			it("should throw an error when trying to invoke `groupBy` when `forEach` is not defined", function() {
				expect(function() {
					this.badInstance.groupBy(function(){});
				}).toThrow();
			});

			it("should return a hash with keys as function return value and values as an array of values that returned that key", function() {
				expect(this.instance.groupBy(function(value, key, array) {
					return (key % 2 === 0 ? 'even' : 'odd');
				})).toEqual({
					"even": ["zero", "two", "four"],
					"odd":  ["one", "three", "five"]
				})
			});

			it("should accept an optional second parameter to use as `this` in the provided function", function() {
				var defaultSpy = jasmine.createSpy('default');
				var providedSpy = jasmine.createSpy('provided');
				var context = {};

				this.instance.groupBy(defaultSpy);
				this.instance.groupBy(providedSpy, context);

				expect(defaultSpy.mostRecentCall.object).toBe(this.instance);
				expect(providedSpy.mostRecentCall.object).toBe(context);
			});
		});

		describe("#indexOf", function() {
			it("should throw an error when trying to invoke `indexOf` when `forEach` is not defined", function() {
				expect(function() {
					this.badInstance.indexOf(function(){});
				}).toThrow();
			});

			it("should return the first key of the enumerable object for which the provided function returns true", function() {
				expect(this.instance.indexOf(function(value, key, array) {
					return key % 2 === 1;
				})).toBe(1);
			});

			it("should accept an optional second parameter to use as `this` in the provided function", function() {
				var defaultSpy = jasmine.createSpy('default');
				var providedSpy = jasmine.createSpy('provided');
				var context = {};

				this.instance.indexOf(defaultSpy);
				this.instance.indexOf(providedSpy, context);

				expect(defaultSpy.mostRecentCall.object).toBe(this.instance);
				expect(providedSpy.mostRecentCall.object).toBe(context);
			});

			it("should return `false` from the iterator when the first matching element is encountered", function() {
				this.instance.indexOf(function(value, key) { return key > 2; });

				expect(this.instance.forEachReturnValue).toEqual([true, true, true, false, false, false]);
			});

			it("should not invoke the callback after the first non-matching element is encountered", function() {
				var spy = jasmine.createSpy('indexOfFn').andCallFake(function(val, key) {
					return key > 1;
				});

				this.instance.indexOf(spy);

				expect(spy.callCount).toBe(3);
			});
		});

		describe("#last", function() {
			it("should throw an error when trying to invoke `last` when `forEach` is not defined", function() {
				expect(function() {
					this.badInstance.last(function(){});
				}).toThrow();
			});

			it("should return the last element of an enumerable object", function() {
				expect(this.instance.last()).toBe('five');
			});
		});

		describe("#lastIndexOf", function() {
			it("should throw an error when trying to invoke `lastIndexOf` when `forEach` is not defined", function() {
				expect(function() {
					this.badInstance.lastIndexOf(function(){});
				}).toThrow();
			});

			it("should return the last key the enumerable object for which the provided function returns true", function() {
				expect(this.instance.lastIndexOf(function(value, key, array) {
					return key % 2 === 1;
				})).toBe(5);
			});

			it("should accept an optional second parameter to use as `this` in the provided function", function() {
				var defaultSpy = jasmine.createSpy('default');
				var providedSpy = jasmine.createSpy('provided');
				var context = {};

				this.instance.lastIndexOf(defaultSpy);
				this.instance.lastIndexOf(providedSpy, context);

				expect(defaultSpy.mostRecentCall.object).toBe(this.instance);
				expect(providedSpy.mostRecentCall.object).toBe(context);
			});
		});

		describe("#map", function() {
			it("should throw an error when trying to invoke `map` when `forEach` is not defined", function() {
				expect(function() {
					this.badInstance.map(function(){});
				}).toThrow();
			});

			it("should return a new array comprising the values returned by invoking the provided function on each element of the object", function() {
				expect(this.instance.map(function(value, key, array) {
					return value.toUpperCase();
				})).toEqual(['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE']);
			});

			it("should accept an optional second parameter to use as `this` in the provided function", function() {
				var defaultSpy = jasmine.createSpy('default');
				var providedSpy = jasmine.createSpy('provided');
				var context = {};

				this.instance.map(defaultSpy);
				this.instance.map(providedSpy, context);

				expect(defaultSpy.mostRecentCall.object).toBe(this.instance);
				expect(providedSpy.mostRecentCall.object).toBe(context);
			});
		});

		describe("#reduce", function() {
			it("should throw an error when trying to invoke `reduce` when `forEach` is not defined", function() {
				expect(function() {
					this.badInstance.reduce(function(){});
				}).toThrow();
			});

			it("should return the result of applying the provided function in a left-to-right direction", function() {
				expect(this.instance.reduce(function(previousValue, nextValue) {
					return previousValue + nextValue;
				}, '')).toBe('zeroonetwothreefourfive');
			});
		});

		describe("#reduceRight", function() {
			// TODO: reduceRight
		});

		describe("#reject", function() {
			it("should throw an error when trying to invoke `reject` when `forEach` is not defined", function() {
				expect(function() {
					this.badInstance.reject(function(){});
				}).toThrow();
			});

			it("should return a new array comprising the elements for which the provided function returns false", function() {
				expect(this.instance.reject(function(value, key, array) {
					return key % 2 === 0;
				})).toEqual(['one', 'three', 'five']);
			});

			it("should accept an optional second parameter to use as `this` in the provided function", function() {
				var defaultSpy = jasmine.createSpy('default');
				var providedSpy = jasmine.createSpy('provided');
				var context = {};

				this.instance.reject(defaultSpy);
				this.instance.reject(providedSpy, context);

				expect(defaultSpy.mostRecentCall.object).toBe(this.instance);
				expect(providedSpy.mostRecentCall.object).toBe(context);
			});
		});

		describe("#size", function() {
			it("should throw an error when trying to invoke `size` when `forEach` is not defined", function() {
				expect(function() {
					this.badInstance.size(function(){});
				}).toThrow();
			});

			it("should return the number of items in an enumerable object", function() {
				expect(this.instance.size()).toBe(6);
			});
		});

		describe("#some", function() {
			it("should throw an error when trying to invoke `some` when `forEach` is not defined", function() {
				expect(function() {
					this.badInstance.some(function(){});
				}).toThrow();
			});

			it("should return true if the function evaluates to true for any element in the array", function() {
				expect(this.instance.some(function(value, key, array) {
					return key === 0;
				})).toBe(true);
			});

			it("should return false if the function evaluates to false for every invocation", function() {
				expect(this.instance.some(function(value, key, array) {
					return false;
				})).toBe(false);
			});

			it("should accept an optional second parameter to use as `this` in the provided function", function() {
				var defaultSpy = jasmine.createSpy('default');
				var providedSpy = jasmine.createSpy('provided');
				var context = {};

				this.instance.some(defaultSpy);
				this.instance.some(providedSpy, context);

				expect(defaultSpy.mostRecentCall.object).toBe(this.instance);
				expect(providedSpy.mostRecentCall.object).toBe(context);
			});

			it("should return `false` from the iterator when the first matching element is encountered", function() {
				this.instance.some(function(value, key) { return key > 2; });

				expect(this.instance.forEachReturnValue).toEqual([true, true, true, false, false, false]);
			});

			it("should not invoke the callback after the first non-matching element is encountered", function() {
				var spy = jasmine.createSpy('someFn').andCallFake(function(val, key) {
					return key > 1;
				});

				this.instance.some(spy);

				expect(spy.callCount).toBe(3);
			});
		});

		describe("#tail", function() {
			it("should throw an error when trying to invoke `tail` when `forEach` is not defined", function() {
				expect(function() {
					this.badInstance.tail(function(){});
				}).toThrow();
			});

			it("should return an array of all elements except the first of a given enumerable object", function() {
				expect(this.instance.tail()).toEqual(['one', 'two', 'three', 'four', 'five']);
			});
		});
	});
});
