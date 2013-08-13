"use strict";

define(function(require) {
	/**
	 * Append a name/value pair to a form data object
	 *
	 * @param {Object} formData
	 * @param {String} name
	 * @param {String} value
	 */
	function appendFormData(formData, name, value) {
		var namespaces = tokenizeName(name);
		var len = namespaces.length;

		var key, arrNext = false, ns = formData;
		for (var i = 0; i < len; i++) {
			// if the key is '', then use the array index instead
			key = (arrNext ? ns.length : namespaces[i]);
			arrNext = (namespaces[i+1] === '' || /[0-9]+/.test(namespaces[i+1]));
			ns[key] = (i < len - 1
					   // if not at the last index, create the namespace (if necessary)
					   ? (ns[key] || (arrNext ? [] : {}))
					   // set the value
					   : value);

			ns = ns[key];
		}
	}

	/**
	 * Tokenize a form field input name into an array of namespaces
	 * @private
	 *
	 * @param {String} name
	 * @return {String}
	 */
	function tokenizeName(name) {
		return name.split('[').map(function(key) {
			return key.replace(/\]$/, '');
		});
	}

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
						// select
						case 'select':
							value = 'TODO';
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

				appendFormData(formData, field.getAttribute('name'), value);
				return formData;
			}, {});
		};
	}

	return DomForm;
});
