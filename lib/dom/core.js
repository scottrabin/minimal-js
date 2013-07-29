"use strict";

define(function(require) {
	var createClass = require('../main');
	var selectorEngine = require('./selector');

	function DomCore() {
		this.after('initialize', function(selector, context) {
			selectorEngine(selector, context || document.documentElement, this);
		});

		// default value for length
		this.length = 0;
	}

	return createClass(
		require('../mixin/arraylike'),
		DomCore
	);
});
