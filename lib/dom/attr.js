"use strict";

define(function(require) {
	var is = require('../util/is');
	var decor = require('../decor');

	/**
	 * Transform a string or array representation of possibly multiple classNames
	 * into an array of valid classNames
	 *
	 * @param {String|Array<String>} className
	 * @return {Array<String>}
	 */
	function getClassList(className) {
		if (is.array(className)) {
			className = className.join(' ');
		}
		return className.match(/\S+/g);
	}

	var addClass, removeClass, hasClass;
	if ('classList' in document.documentElement) {
		addClass = function(className) {
			this.classList.add(className);
		};
		removeClass = function(className) {
			this.classList.remove(className);
		};
		hasClass = function(className) {
			return this.classList.contains(className);
		};
	} else {
		addClass = function(className) {
			var classList = getClassList(this.className);
			if (classList.indexOf(className) === -1) {
				this.className = classList.concat(className).join(' ');
			}
		};
		removeClass = function(className) {
			var classList = getClassList(this.className);
			var index = classList.indexOf(className);
			if (index > -1) {
				classList.splice(index, 1);
				this.className = classList.join(' ');
			}
		};
		hasClass = function(className) {
			var classList = getClassList(this.className);
			return classList.indexOf(className) > -1;
		};
	}

	/**
	 * Helper method to use the context array as a list of valid
	 * class names to add to the given node
	 * @private
	 *
	 * @context {Array<String>} the list of classes
	 * @param {HTMLElement} node
	 */
	function addClasses(node) {
		this.forEach(addClass, node);
	}

	/**
	 * Helper method to use the context array as a list of valid
	 * class names to remove from the given node
	 * @private
	 *
	 * @context {Array<String>} the list of classes
	 * @param {HTMLElement} node
	 */
	function removeClasses(node) {
		this.forEach(removeClass, node);
	}

	return function(prototype, Static) {
		/**
		 * If called as a setter, set the attribute on each element in the set
		 * to the specified attribute.
		 * If called as a getter, get the value of the attribute for the first
		 * element in the set.
		 *
		 * @param {String} attributeName
		 * @param {String=} value If present, set the attribute to this value;
		 *                        if absent, return the value of the attribute
		 * @return {this|String}
		 */
		prototype.attr = function(attributeName, value) {
			if (arguments.length == 1) {
				// getter
				return (this.length > 0 && this[0].hasAttribute(attributeName)
						? this[0].getAttribute(attributeName)
						: null
					   );
			} else {
				// setter
				return this.forEach(value === null
							 ? function(element) { element.removeAttribute(attributeName); }
							 : function(element) { element.setAttribute(attributeName, value); }
							);
			}
		};

		/**
		 * Check if a given element has a given class
		 *
		 * @param {HTMLElement} node
		 * @param {String} className
		 * @return {Boolean}
		 */
		Static.hasClass = function(node, className) {
			return hasClass.call(node, className);
		};

		/**
		 * Check if the first element in the set has a given class name
		 *
		 * @param {String} className
		 * @return {Boolean}
		 */
		prototype.hasClass = function(className) {
			return (this.length > 0) && hasClass.call(this[0], className);
		};

		/**
		 * Add a set of classNames to each element in the set
		 *
		 * @param {String|Array<String>} className
		 * @return this
		 */
		prototype.addClass = function(className) {
			// use the function signature from the addClasses method
			// to pull class names off the context and add them to the
			// given node
			return this.forEach(addClasses, getClassList(className));
		};

		/**
		 * Remove a set of classNames from each element in the set
		 *
		 * @param {String|Array<String>} className
		 * @return this
		 */
		prototype.removeClass = function(className) {
			// use the function signature from the removeClasses method
			// to pull class names off the context and remove them from the
			// given node
			return this.forEach(removeClasses, getClassList(className));
		};

		/**
		 * Toggle a set of classes on each element of a set
		 *
		 * @param {String|Array<String>} className
		 * @param {Boolean=} force If set, the specified classnames will either
		 *                   be added or removed from each element in the set.
		 *                   If omitted, the specified classes will be added or
		 *                   removed based on their current status.
		 * @return this
		 */
		prototype.toggleClass = function(className, force) {
			if (arguments.length === 2 && !is.fn(force)) {
				return (force ? this.addClass(className) : this.removeClass(className));
			}
			var testFn = (force || decor.negate(hasClass));
			// iterate over each of the elements in the set
			return this.forEach(function(node) {
				// `this` is now the set of valid class names
				this.forEach(function(cn) {
					// `this` is now the node
					if (testFn.call(this, cn)) {
						addClass.call(this, cn);
					} else {
						removeClass.call(this, cn);
					}
				}, node);
			}, getClassList(className));
		};
	};
});
