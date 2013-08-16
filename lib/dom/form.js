"use strict";

define(function(require) {
	var querystring = require('../querystring');

	function DomForm(prototype, Static) {
		/**
		 * Generate a data set from the submittable elements in a form
		 * see http://www.w3.org/html/wg/drafts/html/master/forms.html#constructing-the-form-data-set
		 *
		 * @param {DOM.Core|HTMLElement} form
		 * @return {Object}
		 */
		Static.serializeForm = function(form) {
			// normalize form
			return Static.create(Static.toElement(form).elements).reduce(function(formData, field) {
				if (field.hasAttribute('disabled')) {
					// ignore disabled controls
					return;
				}

				var name  = field.name;
				var value = field.value;

				if (/input/i.test(field.nodeName)) {
					switch (field.getAttribute('type') || 'text') {
						// do not include button fields
						case 'submit':
							case 'image':
							case 'reset':
							case 'button':
							// and ignore file (for now)
							case 'file':
							return formData;
						break;
						// checkbox and radio
						case 'checkbox':
							case 'radio':
							if (field.checked) {
							value = (field.hasAttribute('value') ? field.value : 'on');
						} else {
							return formData;
						}
						break;
						// normal fields
						//case 'text':
						//case 'hidden':
						//case 'search':
						//case 'tel':
						//case 'url':
						//case 'email':
						//case 'password':
						//case 'datetime':
						//case 'date':
						//case 'month':
						//case 'week':
						//case 'time':
						//case 'datetime-local':
						//case 'number':
						//case 'range':
						//case 'color':
						default:
							value = field.value;
						break;
					}
				} else if (/select/i.test(field.nodeName) && field.multiple) {
					// array of selected values
					value = Array.prototype.reduce.call(field.options, function(vals, opt) {
						if (opt.selected) {
							vals.push(opt.value);
						}
						return vals;
					}, []);
				}

				querystring.append(formData, field.getAttribute('name'), value);
				return formData;
			}, {});
		};
	}

	return DomForm;
});
