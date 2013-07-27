"use strict";

define(function(require) {
	var createClass = require('../main');

	function DomCore() {
		this.after('initialize', function(selector, context) {
			// set context, if provided
			if (context) {
				this.context = context;
			}

			// query for all nodes matching the given selector
			var nodes = this.context.querySelectorAll(selector);
			// copy the nodes into this item to be "arraylike"
			for (var i = 0, len = nodes.length; i < len; i++) {
				this[i] = nodes[i];
			}
			this.length = nodes.length;
		});

		// default value for context
		this.context = document.documentElement;

		// default value for length
		this.length = 0;
	}

	return createClass(
		require('../mixin/arraylike'),
		DomCore
	);
});
