// @ts-check
import { Component } from "../engine/core.js";
import { formElementsTag, inputTypes } from "./constants.js";
import { Button } from "./actions.js";
import { generateRandomId } from "./utils.js";

export class FormElementComponent extends Component {
  /**
   * @param {string} tagName - O nome da tag HTML do elemento de formulário (input, select, textarea etc.).
   * @param {Array<string>|string|null} [classList=null] - Optional class names to apply to the element.
   */
  // eslint-disable-next-line no-unused-vars
  constructor(tagName, classList = null) {
    if (!formElementsTag.includes(tagName)) {
      console.warn(
        `FormElementComponent: Invalid tag "${tagName}". Defaulting to "input".`
      );
      tagName = "input";
    }
    super(tagName, classList);
  }
}

export class Label extends FormElementComponent {
  /**
   * @param {string|string[]|null} classList - Lista de classes CSS para o elemento.
   */
  constructor(classList = null) {
    super("label", classList);
  }
  /**
   * Renderiza o conteúdo do label com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o label.
   * @param {string} [options.text] - Texto visível do label.
   * @param {string} [options.for] - ID do elemento associado ao label.
   * @returns {Label} Retorna a instância do Label para encadeamento.
   */
  renderContent(options = {}) {
    if (options?.text) {
      this.setText(options.text);
    }
    if (options?.for) {
      this.setAttribute("for", options.for);
    }
    return this;
  }
}

export class Options extends FormElementComponent {
  /**
   * @param {string|string[]|null} classList - Lista de classes CSS para o elemento.
   */
  constructor(classList = null) {
    super("option", classList);
  }
  /**
   * Renderiza o conteúdo do option com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o option.
   * @param {string} [options.value] - Valor do option.
   * @param {string} [options.text] - Texto visível do option.
   * @returns {Options} Retorna a instância do Options para encadeamento.
   */
  renderContent(options = {}) {
    if (!options?.value) {
      const value = options?.text || "--";
      console.warn(
        `Options: No value provided. Defaulting to ${value} string.`
      );
      options.value = value;
    }
    if (!options?.text) {
      console.warn(
        `Options: No text provided. Defaulting to value "${options.value}".`
      );
      options.text = options.value;
    }
    this.setAttribute("value", options.value);
    this.setText(options.text);
    return this;
  }
}

export class Input extends FormElementComponent {
  /**
   * @param {string|string[]|null} classList - Lista de classes CSS para o elemento.
   */
  constructor(classList = null) {
    super("input", classList);
  }
  /**
   * Renderiza o conteúdo do input com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o input.
   * @param {string} [options.type="text"] - O tipo de input (text, password, email etc.).
   * @param {string} [options.placeholder] - Texto de placeholder do input.
   * @param {string} [options.value] - Valor inicial do input.
   * @param {string} [options.id] - ID do input.
   * @param {string} [options.idPrefix="input"] - Prefixo para gerar um ID aleatório se não for fornecido.
   * @returns {Input} Retorna a instância do Input para encadeamento.
   */
  renderContent(options = {}) {
    if (!options?.type || !inputTypes.includes(options.type)) {
      console.warn(
        `Input: Invalid type "${options.type}". Defaulting to "text".`
      );
      options.type = "text";
    }
    this.setAttribute("type", options.type);
    if (options?.placeholder) {
      this.setAttribute("placeholder", options.placeholder);
    }
    if (options?.value) {
      this.setAttribute("value", options.value);
    }
    this.setAttribute(
      "id",
      options?.id || generateRandomId(options?.idPrefix || "input")
    );
    return this;
  }
  /**
   * Gets the current value of the input.
   * @returns {string | null} The input value.
   */
  getValue() {
    this.refresh();
    return this.getAttribute("value");
  }
  /**
   * Sets the value of the input.
   * @param {string} value - The new input value.
   * @returns {Input} This Input instance for chaining.
   */
  setValue(value) {
    this.setAttribute("value", value);
    return this;
  }
  /**
   * Disables the input.
   * @returns {Input} This Input instance for chaining.
   */
  disable() {
    this.setAttribute("disabled", "disabled");
    return this;
  }
  /**
   * Enables the input.
   * @returns {Input} This Input instance for chaining.
   */
  enable() {
    this.element.removeAttribute("disabled");
    return this;
  }
  toggleEnable() {
    if (this.element.hasAttribute("disabled")) {
      this.enable();
    } else {
      this.disable();
    }
  }
  refresh() {
    const id = this.element.id;
    if (id !== null && id !== "") {
      const element = document.getElementById(id);
      if (element) {
        this.setValue(element instanceof HTMLInputElement ? element.value : "");
        return this;
      }
      throw new Error(
        `Input element with id '${id}' not found in the document.`
      );
    }
    throw new Error("Input element not found or has no id");
  }
}

export class Select extends FormElementComponent {
  /**
   * @param {string|string[]|null} classList - Lista de classes CSS para o elemento.
   */
  constructor(classList = null) {
    super("select", classList);
  }
  /**
   * Renderiza o conteúdo do select com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o select.
   * @param {Array<{ value: string, text: string }>} [options.options] - Lista de opções para o select.
   * @param {string} [options.id] - ID do select.
   * @param {string} [options.idPrefix="select"] - Prefixo para gerar um ID aleatório se não for fornecido.
   * @returns {Select} Retorna a instância do Select para encadeamento.
   */
  renderContent(options = {}) {
    if (!Array.isArray(options?.options) || options.options.length === 0) {
      console.warn(
        "Select: No options provided. Defaulting to a single empty option."
      );
      options.options = [{ value: "", text: "--" }];
    }
    this.setAttribute(
      "id",
      options?.id || generateRandomId(options?.idPrefix || "select")
    );
    options.options.forEach((opt) => {
      if (!opt.value || !opt.text) {
        throw new Error(
          "Each option must have both 'value' and 'text' properties."
        );
      }
      if (typeof opt.value !== "string" || typeof opt.text !== "string") {
        throw new Error("Option 'value' and 'text' must be strings.");
      }
      this.addOption({ value: opt.value, text: opt.text });
    });
    return this;
  }
  /**
   * Adds an option to the select.
   * @param {Options|{ value: string, text: string }} option - An instance of Options or an object with value and text properties.
   * @returns {Select} This Select instance for chaining.
   */
  addOption(option) {
    if (option instanceof Options) {
      this.append(option);
    } else if (typeof option === "object" && option.value && option.text) {
      const newOption = new Options().renderContent(option);
      this.append(newOption);
    } else {
      throw new Error(
        "Invalid option format. Must be an Options instance or an object with value and text properties."
      );
    }
    return this;
  }
  /**
   * Gets the current value of the select.
   * @returns {string | null} The selected value.
   */
  getValue() {
    this.refresh();
    return this.getAttribute("value");
  }
  /**
   * Sets the value of the select.
   * @param {string} value - The new selected value.
   * @returns {Select} This Select instance for chaining.
   */
  setValue(value) {
    this.setAttribute("value", value);
    const options = this.element.querySelectorAll("option");
    options.forEach((option) => {
      if (option.value === value) {
        option.selected = true;
      } else {
        option.selected = false;
      }
    });
    return this;
  }
  /**
   * Disables the select.
   * @returns {Select} This Select instance for chaining.
   */
  disable() {
    this.setAttribute("disabled", "disabled");
    return this;
  }
  /**
   * Enables the select.
   * @returns {Select} This Select instance for chaining.
   */
  enable() {
    this.element.removeAttribute("disabled");
    return this;
  }
  toggleEnable() {
    if (this.element.hasAttribute("disabled")) {
      this.enable();
    } else {
      this.disable();
    }
  }
  refresh() {
    const id = this.element.id;
    if (id !== null && id !== "") {
      const element = document.getElementById(id);
      if (element) {
        this.setValue(
          element instanceof HTMLSelectElement ? element.value : ""
        );
        return this;
      }
      throw new Error(
        `Select element with id '${id}' not found in the document.`
      );
    }
    throw new Error("Select element not found or has no id");
  }
}

export class LabeledField extends Component {
  /**
   * @param {Object} options - Opções para configurar o LabeledField.
   * @param {string|string[]|null} [options.classList=null] - Lista de classes CSS para o container.
   * @param {string|string[]|null} [options.labelClassList=null] - Lista de classes CSS para o label.
   */
  constructor(options = {}) {
    const classList = options.classList || null;
    const labelClassList = options.labelClassList || null;
    super("div", classList);
    this.label = new Label(labelClassList);
    /** @type {FormElementComponent|Input|Select|null} */
    this.field = null; // Será definido nas subclasses
  }
  renderContent(options = {}) {
    throw new Error("renderContent must be implemented by subclass.");
  }
  /**
   * Renderiza o conteúdo do label com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o label.
   * @param {string} [options.text] - Texto visível do label.
   * @param {string} [options.for] - ID do elemento associado ao label.
   */
  setLabelContent(options = {}) {
    this.label.renderContent(this._buildLabelContent(options));
  }
  /**
   * Constrói o conteúdo do label com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o label.
   * @param {string} [options.text] - Texto visível do label.
   * @param {string} [options.for] - ID do elemento associado ao label.
   * @returns {Object} Objeto com as propriedades do label.
   */
  _buildLabelContent(options = {}) {
    if (!this.label) {
      throw new Error("Label component is not initialized.");
    }
    if (!this.field || !this.field.element.id) {
      throw new Error("Field component is not initialized or has no ID.");
    }
    return {
      text: options.text || "Label",
      for: options.for || this.field.element.id,
    };
  }
}

export class LabeledInput extends LabeledField {
  /**
   * @param {Object} options - Opções para configurar o LabeledInput.
   * @param {string|string[]|null} [options.classList=null] - Lista de classes CSS para o container.
   * @param {string|string[]|null} [options.labelClassList=null] - Lista de classes CSS para o label.
   * @param {string|string[]|null} [options.inputClassList=null] - Lista de classes CSS para o input.
   */
  constructor(options = {}) {
    const inputClassList = options.inputClassList || null;
    super(options);
    this.input = new Input(inputClassList);
    this.field = this.input; // Define o campo como input
    this.state = {
      isLabelMounted: false,
      isInputMounted: false,
    };
  }
  /**
   * Renderiza o conteúdo do LabeledInput, incluindo o label e o input.
   * @param {Object} options - Opções para configurar o LabeledInput.
   */
  renderContent(options = {}) {
    this.renderInputContent(options);
    this.setLabelContent(options?.label);
    if (!this.state.isLabelMounted) {
      this.label.render({ target: this.element });
      this.state.isLabelMounted = true;
    } else {
      this.label.update(this._buildLabelContent(options));
    }
    if (!this.state.isInputMounted) {
      this.input.render({ target: this.element });
      this.state.isInputMounted = true;
    } else {
      this.input.update(this._buildInputContent(options));
    }
    return this;
  }
  /**
   * Renderiza o conteúdo do input com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o input.
   */
  renderInputContent(options = {}) {
    this.input.renderContent(this._buildInputContent(options));
  }
  /**
   * Constrói o conteúdo do input com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o input.
   * @param {string} [options.type="text"] - O tipo de input (text, password, email etc.).
   * @param {string} [options.placeholder] - Texto de placeholder do input.
   * @param {string} [options.value] - Valor inicial do input.
   * @param {string} [options.id] - ID do input.
   * @param {string} [options.idPrefix="input"] - Prefixo para gerar um ID aleatório se não for fornecido.
   * @returns {Object} Objeto com as propriedades do input.
   */
  _buildInputContent(options = {}) {
    return {
      type: options.type || "text",
      placeholder: options.placeholder || "",
      value: options.value || "",
      id: options.id || generateRandomId("input"),
      idPrefix: options.idPrefix || "input",
    };
  }
}

export class LabeledSelect extends LabeledField {
  /**
   * @param {Object} options - Opções para configurar o LabeledSelect.
   * @param {string|string[]|null} [options.classList=null] - Lista de classes CSS para o container.
   * @param {string|string[]|null} [options.labelClassList=null] - Lista de classes CSS para o label.
   * @param {string|string[]|null} [options.selectClassList=null] - Lista de classes CSS para o select.
   */
  constructor(options = {}) {
    const selectClassList = options.selectClassList || null;
    super(options);
    this.select = new Select(selectClassList);
    this.field = this.select; // Define o campo como select
    this.state = {
      isLabelMounted: false,
      isSelectMounted: false,
    };
  }
  /**
   * Renderiza o conteúdo do LabeledSelect, incluindo o label e o select.
   * @param {Object} options - Opções para configurar o LabeledSelect.
   */
  renderContent(options = {}) {
    this.setLabelContent(options);
    this.setSelectContent(options);
    if (!this.state.isLabelMounted) {
      this.label.render({ target: this.element });
      this.state.isLabelMounted = true;
    } else {
      this.label.update(this._buildLabelContent(options));
    }
    if (!this.state.isSelectMounted) {
      this.select.render({ target: this.element });
      this.state.isSelectMounted = true;
    } else {
      this.select.update(this._buildSelectContent(options));
    }
    return this;
  }
  /**
   * Renderiza o conteúdo do select com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o select.
   */
  setSelectContent(options = {}) {
    this.select.renderContent(this._buildSelectContent(options));
  }
  /**
   * Constrói o conteúdo do select com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o select.
   * @param {Array<{ value: string, text: string }>} [options.options] - Lista de opções para o select.
   * @param {string} [options.id] - ID do select.
   * @param {string} [options.idPrefix="select"] - Prefixo para gerar um ID aleatório se não for fornecido.
   * @returns {Object} Objeto com as propriedades do select.
   */
  _buildSelectContent(options = {}) {
    return {
      options: options.options || [],
      id: options.id || generateRandomId("select"),
      idPrefix: options.idPrefix || "select",
    };
  }
}

export class FieldsContainer extends Component {
  /**
   * @param {Object} options - Opções para configurar o FieldsContainer.
   * @param {string} [options.tagName="div"] - O nome da tag HTML do container.
   * @param {string|string[]|null} [options.classList=null] - Lista de classes CSS para o container.
   */
  constructor(options = {}) {
    const tagName = options.tagName || "div";
    const classList = options.classList || null;
    super(tagName, classList);

    /** @type {(FieldsContainer | Input | Select | LabeledInput | LabeledSelect | Button)[]} */
    this.fields = [];
    this.state = {
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
      if (!Array.isArray(options?.fields)) {
        console.warn("FieldsContainer: 'fields' precisa ser array.");
        return this;
      }
      options.fields.forEach((field) => {
        if (
          !field.tagName ||
          !formElementsTag.includes(field.tagName.toLowerCase())
        ) {
          if (field.FieldsContainer) {
            this.renderFieldsContainer(
              field.FieldsContainer.options || {},
              field.FieldsContainer.renderOptions || {}
            );
          } else {
            console.warn(
              "Form: Unsupported field type. Only form elements are allowed."
            );
          }
        } else if (field.tagName.toLowerCase() === "input") {
          this.renderInput(field.options || {}, field.renderOptions || {});
        } else if (field.tagName.toLowerCase() === "select") {
          this.renderSelect(field.options || {}, field.renderOptions || {});
        } else if (field.tagName.toLowerCase() === "button") {
          this.renderButton(field.options || {}, field.renderOptions || {});
        }
      });
    }
    return this;
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
  renderFieldsContainer(options = {}, renderOptions = {}) {
    const container = this._buildFieldsContainerContent(
      options,
      renderOptions
    ).render({
      target: this.element,
    });
    container.fields.forEach((field) => {
      this.fields.push(field);
      if (field.getAttribute("type") === "submit") {
        this.state.hasSubmitButton = true;
        this.submitButton = field;
      }
    });
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
  _buildInputContent(options = {}, renderOptions = {}) {
    if (renderOptions.label) {
      return new LabeledInput(options).renderContent(renderOptions);
    }
    return new Input(options?.classList).renderContent(renderOptions);
  }
  _buildSelectContent(options = {}, renderOptions = {}) {
    return new LabeledSelect(options).renderContent(renderOptions);
  }
  _buildFieldsContainerContent(options = {}, renderOptions = {}) {
    return new FieldsContainer(options).renderContent(renderOptions);
  }
  _buildButtonContent(options = {}, renderOptions = {}) {
    return new Button(options).renderContent(renderOptions);
  }
  _hasField() {
    return this.fields.length > 0;
  }
}
