"use strict";

define(function(require) {
	var createClass = require('../main');
	var selectorEngine = require('./selector');
	var is = require('../util/is');

	function DomCore(prototype, Constructor) {
		/**
		 * Return a new instance if the first argument is not already an instance
		 *
		 * @param {String|DOMElement|Array=} selector
		 * @param {DOMElement=} context
		 * @return {DOM.Core}
		 */
		Constructor.create = function(selector, context) {
			return (selector instanceof Constructor
					? selector
					: new Constructor(selector, context)
				   );
		};

		/**
		 * Create a DOM fragment from a string
		 * TODO - More robust implementation
		 *
		 * @param {String} markup
		 * @return {DocumentFragment}
		 */
		Constructor.fragment = function(markup) {
			var div = document.createElement('div');
			var fragment = document.createDocumentFragment();
			div.innerHTML = markup;
			for (var i = 0, len = div.children.length; i < len; i++) {
				fragment.appendChild(div.children[i]);
			}
			return fragment;
		};

		/**
		 * Initialize the instance by either importing the initial value objects or
		 * querying the dom using the provided selector.
		 *
		 * @param {String|DOMElement|Array=} selector Initial value to populate
		 *        this instance.
		 *        If absent, an empty instance will be returned
		 *        If a string, that string will be used to query the document
		 *        If a DOMElement, a wrapper for that element will be returned
		 *        If an array, the elements will be added to the instance
		 * @param {DOMElement=} context An optional context to scope string selectors to
		 */
		prototype.after('initialize', function(selector, context) {
			var type = (typeof selector);
			if (!selector) {
				// nothing given; exit early
				return;
			} else if (is.string(selector)) {
				// string given; use as a selector
				selectorEngine(selector, context || document.documentElement, this);
			} else if (is.array(selector)) {
				// array given; import the elements
				for (var i = 0, len = selector.length; i < len; i++) {
					this.push(selector[i]);
				}
			} else if (is.element(selector)) {
				// DOM element
				this.push(selector);
			}
		});

		// default value for length
		prototype.length = 0;
	}

	return createClass(
		require('../mixin/arraylike'),
		DomCore
	);
});
