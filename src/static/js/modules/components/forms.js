// @ts-check

import { Component } from "../engine/core.js";
import { Button } from "./actions.js";
import { Input, LabeledInput, LabeledSelect, FormSection } from "./fields.js";
import { normalizeClass } from "../utils.js";
import { formElementsTag } from "./constants.js";

export class Form extends Component {
  constructor(classList = null) {
    super("form", classList);
    /** @type {(Input | LabeledInput | LabeledSelect | Button)[]} */
    this.fields = [];
    /** @type {Button|null} */
    this.submitButton = null;
    this.state = {
      hasSubmitButton: this._hasSubmitButton(),
      hasField: this._hasField(),
    };
  }
  renderContent(options = {}) {
    if (options?.id) {
      this.setAttribute("id", options.id);
    }
    if (options?.action) {
      this.setAttribute("action", options.action);
    }
    if (options?.method) {
      this.setAttribute("method", options.method);
    }
    if (options?.target) {
      this.setAttribute("target", options.target);
    }
    if (options?.fields) {
      options.fields.forEach((field) => {
        if (
          !field.tagName ||
          !formElementsTag.includes(field.tagName.toLowerCase())
        ) {
          console.warn(
            "Form: Unsupported field type. Only form elements are allowed."
          );
          return;
        }
        if (field.tagName.toLowerCase() === "input") {
          this.renderInput(field.options || {}, field.renderOptions || {});
        } else if (field.tagName.toLowerCase() === "select") {
          this.renderSelect(field.options || {}, field.renderOptions || {});
        } else if (field.tagName.toLowerCase() === "button") {
          this.renderButton(field.options || {}, field.renderOptions || {});
        }
      });
    }
  }
  renderInput(options = {}, renderOptions = {}) {
    this.addField(
      this._buildInputContent(options, renderOptions).render({
        target: this.element,
      })
    );
    this.setState({
      hasField: this._hasField(),
    });
  }
  renderSelect(options = {}, renderOptions = {}) {
    this.addField(
      this._buildSelectContent(options, renderOptions).render({
        target: this.element,
      })
    );
    this.setState({
      hasField: this._hasField(),
    });
  }
  renderButton(options = {}, renderOptions = {}) {
    this.addField(
      this._buildButtonContent(options, renderOptions).render({
        target: this.element,
      })
    );
    this.setState({
      hasField: this._hasField(),
      hasSubmitButton: this._hasSubmitButton(),
    });
  }
  /**
   * Adiciona um campo ao atributo fields.
   * * @param {Input|LabeledInput|LabeledSelect|Button} field - O campo a ser adicionado.
   * * @returns {this}
   */
  addField(field) {
    this.fields.push(field);
    if (field.getAttribute("type") === "submit") {
        this.state.hasSubmitButton = true;
        this.submitButton = field;
    }
    return this;
  }

  /**
   * Atualiza o campo com base no índice ou objeto fornecido.
   * @param {number|Object} label - Índice do campo ou objeto com atributos 'by' e 'value'.
   * @param {Object} [options={}] - Novas opções para atualizar o campo.
   * @returns {void}
   */
  updateField(label, options = {}) {
    if (typeof label === "number") {
      if (label < 0 || label >= this.fields.length) {
        console.warn(`Form: Índice ${label} fora do intervalo.`);
        return;
      }
      this.fields[label].update(options);
    } else if (typeof label === "object") {
      if (!label.by || !label.value) {
        console.warn(
          "Form: Parâmetro inválido. Use { by: 'name'|'id', value: 'valor' }."
        );
        return;
      }
      if (label.by === "name") {
        this.updateFieldByName(label.value, options);
        return;
      }
      if (label.by === "id") {
        this.updateFieldById(label.value, options);
        return;
      }
    }
  }
  /**
   * Atualiza o campo cujo atributo name corresponde ao argumento.
   * @param {string} name - O atributo name do campo desejado.
   * @param {Object} options - Novas opções para atualizar o campo.
   * @returns {void}
   */
  updateFieldByName(name, options = {}) {
    const field = this.fields.find(
      (f) =>
        "field" in f &&
        f.field.getAttribute &&
        f.field.getAttribute("name") === name
    );
    if (!field) {
      console.warn(`Form: Nenhum campo com name="${name}" encontrado.`);
      return;
    }
    if (typeof field.update === "function") {
      field.update(options);
    } else {
      console.warn("Form: Este campo não suporta update.");
    }
    return;
  }
  /**
   * Atualiza o campo cujo atributo id corresponde ao argumento.
   * @param {string} id - O atributo id do campo desejado.
   * @param {Object} options - Novas opções para atualizar o campo.
   * @returns {void}
   */
  updateFieldById(id, options = {}) {
    const field = this.fields.find(
      (f) =>
        "field" in f &&
        f.field.getAttribute &&
        f.field.getAttribute("id") === id
    );
    if (!field) {
      console.warn(`Form: Nenhum campo com id="${id}" encontrado.`);
      return;
    }
    if (typeof field.update === "function") {
      field.update(options);
    } else {
      console.warn("Form: Este campo não suporta update.");
    }
    return;
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
  _buildInputContent(options = {}, renderOptions = {}) {
    if (renderOptions.label) {
        return new LabeledInput(options).renderContent(renderOptions);
    }
    return new Input(options?.classList).renderContent(renderOptions);
  }
  _buildSelectContent(options = {}, renderOptions = {}) {
    return new LabeledSelect(options).renderContent(renderOptions);
  }
  _buildButtonContent(options = {}, renderOptions = {}) {
    return new Button(options).renderContent(renderOptions);
  }
  _hasField() {
    return this.fields.length > 0;
  }
  _hasSubmitButton() {
    return (
      this.submitButton !== null &&
      this.submitButton.getAttribute("type") === "submit"
    );
  }
}
