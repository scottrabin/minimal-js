"use strict";

define(function(require) {
	require('./core').mix({
		attr: function(attributeName, value) {
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
		}
	});
});
