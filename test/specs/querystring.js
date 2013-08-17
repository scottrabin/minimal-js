"use strict";

define(function(require) {
	var querystring = require('querystring');

	var testCases = [
		{
			queryString: 'property=value',
			expected: {
				property: 'value'
			}
		},
		{
			queryString: 'property[]=value',
			expected: {
				property: ['value']
			}
		},
		{
			queryString: 'property[subproperty]=value',
			expected: {
				property: {
					subproperty: 'value'
				}
			}
		},
		{
			queryString: 'property[subproperty][]=value',
			expected: {
				property: {
					subproperty: ['value']
				}
			}
		},
		{
			queryString: 'property[subproperty][one]=value',
			expected: {
				property: {
					subproperty: {
						one: 'value'
					}
				}
			},
		},
		{
			queryString: "multiline=This%20is%0Asome%20text%0Ain%20several%20lines.&some=thing&hidden%20field=has%20a%20space",
			expected: {
				multiline: "This is\nsome text\nin several lines.",
				some: "thing",
				"hidden field": "has a space"
			}
		},
		{
			// something very complicated
			queryString: "x[a]=one&x[b][]=two&x[b][]=three&x[c][d]=four&x[d][e][f]=five",
			expected: {
				x: {
					a: 'one',
					b: ['two', 'three'],
					c: {
						d: 'four'
					},
					d: {
						e: {
							f: 'five'
						}
					}
				}
			}
		},
		{
			// don't re-stringify numeric keys incorrectly
			queryString: "x[0]=zero&x[1]=one&x[3]=three",
			expected: {
				x: [
					'zero',
					'one',
					,
					'three'
				]
			}
		},
		{
			// numeric subkeys with complex values should get parsed as an array
			// and arrays with non-primitive values should get stringified with numeric keys
			queryString: "x[0][one]=uno&x[0][two]=dos&x[1][one]=ein&x[1][two]=zwei",
			expected: {
				x: [
					{
						one: 'uno',
						two: 'dos'
					},
					{
						one: 'ein',
						two: 'zwei'
					}
				]
			}
		},
		{
			// numeric subkeys describing a sparse array should result in a sparse array
			queryString: "x[0][one]=uno&x[0][two]=dos&x[1][one]=ein&x[1][two]=zwei&x[3][one]=I&x[3][two]=II",
			expected: {
				x: [
					{ one: 'uno', two: 'dos' },
					{ one: 'ein', two: 'zwei' },
					,
					{ one: 'I', two: 'II' }
				]
			}
		}
	];

	describe("querystring", function() {
		describe("#append", function() {
			testCases.forEach(function(test) {
				if (~test.queryString.indexOf('&')) {
					return;
				}
				var sp = test.queryString.split('=');
				var name = sp[0];
				var value = sp[1];
				it("should handle `" + name + "`", function() {
					var host = {};
					querystring.append(host, name, value);
					expect(host).toEqual(test.expected);
				});
			});

			it("should handle multiple subproperties appropriately", function() {
				var host = {};
				querystring.append(host, 'property[one]', 'uno');
				querystring.append(host, 'property[two]', 'dos');
				expect(host).toEqual({
					property: {
						one: 'uno',
						two: 'dos'
					}
				});
			});

			it("should handle multiple subproperty array keys appropriately", function() {
				var host = {};
				querystring.append(host, 'property[sub][]', 'one');
				querystring.append(host, 'property[sub][]', 'two');
				expect(host).toEqual({
					property: {
						sub: ['one', 'two']
					}
				});
			});

			it("should handle complex nested arrays", function() {
				var host = {};
				querystring.append(host, 'property[sub][][one]', 'uno');
				querystring.append(host, 'property[sub][][one]', 'uno');
				expect(host).toEqual({
					property: {
						sub: [
							{ one: 'uno' },
							{ one: 'uno' }
						]
					}
				});
			});
		});

		describe("#parse", function() {
			testCases.forEach(function(test) {
				it("should handle `" + test.queryString + "`", function() {
					expect(querystring.parse(test.queryString)).toEqual(test.expected);
				});
			});
		});

		describe("#stringify", function() {
			testCases.forEach(function(test) {
				it("should handle `" + JSON.stringify(test.expected) + "`", function() {
					expect(querystring.stringify(test.expected)).toEqual(test.queryString);
				});
			});
		});
	});
});
