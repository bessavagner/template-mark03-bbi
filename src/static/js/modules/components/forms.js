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

export class FormValidator {
  /**
   * @param {Form} formInstance
   * @param {Object} rules
   */
  constructor(formInstance, rules = {}) {
    this.form = formInstance;
    this.rules = rules;
    this.firstInvalidField = null;
    this.isValid = true;
  }

  validate() {
    this.isValid = true;
    this.firstInvalidField = null;

    for (const [key, rule] of Object.entries(this.rules)) {
      const field = this._resolveField(key);
      if (!field || typeof field.getValue !== "function") continue;

      field.clearError?.(); // se existir, remove erro anterior

      const value = field.getValue()?.trim?.() ?? "";

      // Regra required
      if (rule.required && !value) {
        this._invalidate(field, rule.message || "Campo obrigatório");
        continue;
      }

      // Regra customizada
      if (rule.validate && !rule.validate(value)) {
        this._invalidate(field, rule.error || "Valor inválido");
        continue;
      }
    }

    if (!this.isValid && this.firstInvalidField?.element) {
      this.firstInvalidField.element.focus();
    }

    return this.isValid;
  }

  _invalidate(field, message) {
    field.setError?.(message);
    if (!this.firstInvalidField) this.firstInvalidField = field;
    this.isValid = false;
  }

  _resolveField(key) {
    const path = key.split(".");
    let current = this.form;
    for (const part of path) {
      if (!current?.fields?.[part]) return null;
      current = current.fields[part];
    }
    return current;
  }
}

export class PhoneValidator {
  /**
   * Verifica se um número de telefone é válido após remover caracteres não numéricos.
   * @param {string} value
   * @returns {boolean}
   */
  static isValid(value) {
    if (typeof value !== "string") return false;
    const digits = PhoneValidator.normalize(value);

    return (
      digits.length === 9 ||  // número sem DDD (9 dígitos)
      digits.length === 10 || // fixo com DDD
      digits.length === 11    // celular com DDD
    );
  }

  /**
   * Normaliza o número para formato E.164-like ou brasileiro compacto (somente dígitos).
   * Ex: "(88) 9 9999-9999" → "88999999999"
   * @param {string} value
   * @returns {string}
   */
  static normalize(value) {
    return value.replace(/\D/g, "");
  }
}

export class DiaUtilValidator {
  /**
   * Verifica se a data informada é um dia útil (segunda a sexta).
   * @param {string} value - Data em formato ISO (YYYY-MM-DD)
   * @returns {boolean}
   */
  static isValid(value) {
    if (!value) return false;
    const date = new Date(value);
    const day = date.getDay(); // 6 = domingo, 5 = sábado
    console.log(`Dia da semana: ${day} (${date.toISOString()})`);
    return day < 5;
  }
}

