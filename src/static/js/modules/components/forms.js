// @ts-check

import { Button } from "./actions.js";
import { Input, Select, LabeledInput, LabeledSelect, FieldsContainer } from "./fields.js";


export class Form extends FieldsContainer {
  constructor(classList = null) {
    super({tagName: "form", classList: classList});
    /** @type {(FieldsContainer | Input | Select | LabeledInput | LabeledSelect | Button)[]} */
    this.fields = [];
    this.submitButton = new Button({classList: null});
    this.setState({
      hasSubmitButton: this._hasSubmitButton(),
    });
  }
  renderContent(options = {}) {
    return super.renderContent(options);
  }
  init() {
    if (!this._hasField()) {
      throw new Error("Form must have at least one field");
    }
    if (!this._hasSubmitButton()) {
      throw new Error("Form must have a submit button");
    }
    this.addEventListener("submit", (e) => this.handleSubmit(e));
    return this;
  }
  /**
   * Handles the form submission.
   * @param {Event} e - The submit event.
   */
  async handleSubmit(e) {
    /**
     * Should be overridden by the user.
     */
  }
  getFormData() {
    if (!(this.element instanceof HTMLFormElement)) {
      throw new Error("Form element is not a valid HTMLFormElement.");
    }
    const formData = new FormData(this.element);
    const data = {};
    for (const [key, value] of formData.entries()) {
      if (data[key]) {
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      } else {
        data[key] = value;
      }
    }
    return data;
  }
  _hasSubmitButton() {
    return (
      this.submitButton !== null &&
      this.submitButton.getAttribute("type") === "submit"
    );
  }
}
