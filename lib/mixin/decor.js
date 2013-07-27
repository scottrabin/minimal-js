"use strict";

define(function(require) {
	var decor = require('../decor');
	var utils = require('../util');

	return {
		before: function(methodName, decorator) {
			this[methodName] = (typeof this[methodName] === 'function'
								? decor.before(this[methodName], decorator)
								: decorator
							   );
		},
		after: function(methodName, decorator) {
			this[methodName] = (typeof this[methodName] === 'function'
								? decor.after(this[methodName], decorator)
								: decorator
							   );
		},
		around: function(methodName, decorator) {
			this[methodName] = decor.around(
				(typeof this[methodName] === 'function' ? this[methodName] : utils.noop),
				decorator
			);
		},
		provided: function(methodName, decorator) {
			//>>includeStart("ministryStrict", pragmas.ministryStrict);
			if (typeof this[methodName] !== 'function') {
				throw new TypeError("Cannot define a `provided` decorated function with non-function method name");
			}
			//>>includeEnd("ministryStrict");
			this[methodName] = decor.provided(this[methodName], decorator);
		}
	};
});
