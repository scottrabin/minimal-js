"use strict";

define(function(require) {
	var DOM = require('dom/core').mix(require('dom/form'));

	describe("dom/form", function() {
		beforeEach(function() {
			this.form = document.createElement('form');
			this.form.innerHTML =
				// normal fields
				'<input type="text" name="textInput" value="textInputValue" />' +
				'<input type="password" name="passwordInput" value="passwordInputValue" />' +
				'<input type="hidden" name="hiddenInput" value="hiddenInputValue" />' +

				// checkboxes
				'<input type="checkbox" name="checkboxChecked" value="checkboxCheckedValue" checked="checked" />' +
				'<input type="checkbox" name="checkboxUnchecked" value="checkboxUncheckedValue" />' +
				'<input type="checkbox" name="checkboxNoValue" checked="true" />' +

				// radio buttons
				'<input type="radio" name="radioInput" value="radioOne" checked="checked" />' +
				'<input type="radio" name="radioInput" value="radioTwo" />' +
				'<input type="radio" name="radioInputUnchecked" value="radioOneUnchecked" />' +
				'<input type="radio" name="radioInputUnchecked" value="radioTwoUnchecked" />' +

				// file
				// TODO
				// '<input type="file" name="fileInput" />' +

				// buttons
				'<input type="submit" name="submitInput" value="submitValue" />' +
				'<input type="reset" name="resetInput" value="resetValue" />' +
				'<input type="image" name="imageInput" value="imageValue" />' +
				'<input type="button" name="buttonInput" value="buttonValue" />' +

				// select
				'<select name="selectSingle">' +
					'<option value="selectSingleValue" selected>Option</option>' +
				'</select>' +
				'<select name="selectMultiple" multiple>' +
					'<option value="multiOne" selected>Option One</option>' +
					'<option value="multiTwo" selected>Option Two</option>' +
					'<option value="multiNope">Option Nope</option>' +
					'<option selected>multiThree</option>' +
				'</select>';

			this.formData = DOM.serializeForm(this.form);
		});

		describe("#serialize", function() {
			describe('input[type="text"]', function() {
				it("should appear in the form data", function() {
					expect(this.formData.textInput).toBe('textInputValue');
				});
			});

			describe('input[type="password"]', function() {
				it("should appear in the form data", function() {
					expect(this.formData.passwordInput).toBe('passwordInputValue');
				});
			});

			describe('input[type="hidden"]', function() {
				it("should appear in the form data", function() {
					expect(this.formData.hiddenInput).toBe('hiddenInputValue');
				});
			});

			describe('input[type="checkbox"]', function() {
				it("should appear in the form data if checked", function() {
					expect(this.formData.checkboxChecked).toBe('checkboxCheckedValue');
				});

				it("should not appear in the form data if not checked", function() {
					expect(this.formData).not.toHaveProperty('checkboxUnchecked');
				});

				it("should default to the value 'on' if the `value` attribute is missing", function() {
					expect(this.formData.checkboxNoValue).toBe('on');
				});
			});

			describe('input[type="radio"]', function() {
				it("should appear in the form data with the value of the checked radio control", function() {
					expect(this.formData.radioInput).toBe('radioOne');
				});

				it("should not appear in the form data if none of the radio items is checked", function() {
					expect(this.formData).not.toHaveProperty('radioInputUnchecked');
				});
			});

			describe('input[type="file"]', function() {
				// TODO
			});

			describe('input[type="submit"]', function() {
				it("should not appear in the form data", function() {
					expect(this.formData).not.toHaveProperty('submitInput');
				});
			});

			describe('input[type="reset"]', function() {
				it("should not appear in the form data", function() {
					expect(this.formData).not.toHaveProperty('resetInput');
				});
			});

			describe('input[type="image"]', function() {
				it("should not appear in the form data", function() {
					expect(this.formData).not.toHaveProperty('imageInput');
				});
			});

			describe('input[type="button"]', function() {
				it("should not appear in the form data", function() {
					expect(this.formData).not.toHaveProperty('buttonInput');
				});
			});

			describe('select', function() {
				it("should include a single value if the `multiple` attribute is missing", function() {
					expect(this.formData.selectSingle).toBe('selectSingleValue');
				});

				it("should include an array of values if the `multiple` attribute is set", function() {
					expect(this.formData.selectMultiple).toEqual(['multiOne', 'multiTwo', 'multiThree']);
				});
			});
		});
	});
});
