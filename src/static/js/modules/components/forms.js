// @ts-check

import { Button } from "./actions.js";
import {
  FormElementComponent,
  ValueField,
  Input,
  TextArea,
  Select,
  LabeledField,
  LabeledInput,
  LabeledSelect,
  FieldsContainer,
} from "./fields.js";

export class Form extends FieldsContainer {
  constructor(classList = null) {
    super({ tagName: "form", classList: classList });
    // Não cria botão de submit por padrão; será definido quando um campo do tipo submit for adicionado.
    /** @type {Button|Input|null} */
    this.submitButton = null;
    // Inicializa estado do formulário
    this.state.hasSubmitButton = false;
  }
  renderContent(options = {}) {
    return super.renderContent(options);
  }

  /**
   * Adiciona um campo ao container.
   * @param {string} name - O nome do campo.
   * @param {typeof FormElementComponent | typeof ValueField | typeof Input | typeof Select | typeof TextArea | typeof LabeledField | typeof LabeledInput | typeof LabeledSelect | typeof FieldsContainer | typeof Button} FieldClass - Classe do elemento a ser adicionado.
   * @param {Object} [constructorOptions={}] - Opções adicionais para o construtor do elemento.
   * @param {Object} [renderOptions={}] - Opções de renderização para o campo.
   * @returns {this} Retorna a instância do FieldsContainer para encadeamento.
   * */
  addField(name, FieldClass, constructorOptions = {}, renderOptions = {}) {
    super.addField(name, FieldClass, constructorOptions, renderOptions);
    const field = this.fields[name];
    // Verifica se o campo inserido é um botão de submit (input type="submit" ou <button> sem type ou com type="submit")
    const tag = field.element.tagName.toLowerCase();
    const typeAttr = field.getAttribute && field.getAttribute("type");
    const isSubmitButton =
      (tag === "input" && typeAttr && typeAttr.toLowerCase() === "submit") ||
      (tag === "button" && (!typeAttr || typeAttr.toLowerCase() === "submit"));
    if (isSubmitButton) {
      if (this.submitButton && this.submitButton !== field) {
        console.warn(
          "Form: mais de um botão de submit adicionado; substituindo o anterior."
        );
      }
      this.submitButton = field;
      this.state.hasSubmitButton = true;
    }
    return this;
  }
  init() {
    if (!this._hasField()) {
      throw new Error("Form must have at least one field");
    }
    if (!this._hasSubmitButton()) {
      throw new Error("Form must have a submit button");
    }
    this.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit(e);
    });
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
  getFormData({ nested = false } = {}) {
    return this.getValues({ nested });
  }
  /**
   * Verifica se há um botão de submit válido associado ao formulário.
   * @returns {boolean}
   */
  _hasSubmitButton() {
    if (!this.submitButton) return false;
    const tag = this.submitButton.element.tagName.toLowerCase();
    if (tag === "button") {
      const typeAttr = this.submitButton.getAttribute("type");
      // Botão sem tipo definido ou com type "submit" conta como submit válido
      return !typeAttr || typeAttr.toLowerCase() === "submit";
    }
    if (tag === "input") {
      const typeAttr = this.submitButton.getAttribute("type");
      if (!typeAttr) return false;
      return typeAttr.toLowerCase() === "submit";
    }
    return false;
  }
}
