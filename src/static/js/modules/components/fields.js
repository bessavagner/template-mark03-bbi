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
  renderContent(options = {}) {
    const attributes = options?.attributes || null;
    if (attributes && typeof attributes === "object")
      this.setAttributes(attributes);
    return this;
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
   * @param {Object} [options.attributes] - Atributos adicionais.
   * @returns {this} Retorna a instância do Label para encadeamento.
   */
  renderContent(options = {}) {
    this.setText(options?.text || "Label");
    if (options?.for) {
      this.setAttribute("for", options.for);
    }
    return super.renderContent(options);
  }
}

export class ValueField extends FormElementComponent {
  /**
   * @param {string} tagName - O nome da tag HTML do elemento de formulário (input, select, textarea etc.).
   * @param {string|string[]|null} [classList=null] - Lista de classes CSS para o elemento.
   */
  constructor(tagName, classList = null) {
    super(tagName, classList);
    this.state = {
      value: null, // Valor atual do campo
      isDisabled: false, // Estado de desabilitado do campo
    };
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
   * @returns {ValueField} This Input instance for chaining.
   */
  setValue(value) {
    this.setAttribute("value", value);
    return this;
  }
  /**
   * Disables the input.
   * @returns {ValueField} This Input instance for chaining.
   */
  disable() {
    this.setAttribute("disabled", "disabled");
    return this;
  }
  /**
   * Enables the input.
   * @returns {ValueField} This Input instance for chaining.
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
  /**
   * Atualiza o valor do campo a partir do DOM.
   * @returns {this}
   * @throws {Error} Se o elemento não suportar a propriedade value.
   */
  refresh() {
    const element = this.element;

    if (element && "value" in element && typeof element.value === "string") {
      this.setValue(element.value);
      return this;
    }

    throw new Error("Element does not support string value retrieval.");
  }
}

export class Input extends ValueField {
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
   * @param {string} [options.id] - ID do input.
   * @param {string} [options.idPrefix="input"] - Prefixo para gerar um ID aleatório se não for fornecido.
   * @param {Object} [options.attributes] - Atributos adicionais.
   * @returns {this} Retorna a instância do Input para encadeamento.
   */
  renderContent(options = {}) {
    if (!options?.type || !inputTypes.includes(options.type)) {
      console.warn(
        `Input: Invalid type "${options.type}". Defaulting to "text".`
      );
      options.type = "text";
    }
    this.setAttribute("type", options.type);
    // Inputs must have id
    this.setAttribute(
      "id",
      options?.id || generateRandomId(options?.idPrefix || "input")
    );
    return super.renderContent(options);
  }
}

export class Options extends ValueField {
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
   * @param {Object} [options.attributes] - Atributos adicionais.
   * @returns {this} Retorna a instância do Options para encadeamento.
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
    return super.renderContent(options);
  }
}

export class Select extends ValueField {
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
   * @param {Object} [options.attributes] - Atributos adicionais.
   * @returns {this} Retorna a instância do Select para encadeamento.
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
      this.addOption(opt);
    });
    return super.renderContent(options);
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
}

export class TextArea extends ValueField {
  /**
   * @param {string|string[]|null} classList - Lista de classes CSS para o elemento.
   */
  constructor(classList = null) {
    super("textarea", classList);
  }
  /**
   * Renderiza o conteúdo do textarea com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o textarea.
   * @param {string} [options.placeholder] - Texto de placeholder do textarea.
   * @param {string} [options.value] - Valor inicial do textarea.
   * @param {string} [options.id] - ID do textarea.
   * @param {string} [options.idPrefix="textarea"] - Prefixo para gerar um ID aleatório se não for fornecido.
   * @param {Object} [options.attributes] - Atributos adicionais.
   * @returns {this} Retorna a instância do TextArea para encadeamento.
   */
  renderContent(options = {}) {
    // TextAreas must have id
    this.setAttribute(
      "id",
      options?.id || generateRandomId(options?.idPrefix || "textarea")
    );
    return super.renderContent(options);
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
    /** @type {FieldError|null} */
    this.error = null;
    this.state = {
      isLabelMounted: false,
      isInputMounted: false,
    };
  }
  /**
   * Renderiza o conteúdo do LabeledInput, incluindo o label e o input.
   * @param {Object} options - Opções para configurar o LabeledInput.
   * @param {string} [options.type="text"] - O tipo de input (text, password, email etc.).
   * @param {string} [options.id] - ID do input.
   * @param {string} [options.idPrefix="input"] - Prefixo para gerar um ID aleatório se não for fornecido.
   * @param {Object} [options.label] - Opções para o label.
   * @param {string} [options.label.text] - Texto visível do label.
   * @param {string} [options.label.for] - ID do elemento associado ao label.
   * @param {Object} [options.label.attributes] - Atributos adicionais para o
   * @param {Object} [options.attributes] - Atributos adicionais para o input.
   * @returns {this} Retorna a instância do LabeledInput para encadeamento.
   */
  renderContent(options = {}) {
    if (this.field == null)
      throw new Error("Field component is not initialized.");
    this.renderFieldContent(options);
    this.renderLabelContent(options?.label);
    if (!this.state.isLabelMounted) {
      this.label.render({ target: this.element });
      this.state.isLabelMounted = true;
    } else {
      this.label.update(this._buildLabelContent(options));
    }
    if (!this.state.isInputMounted) {
      this.field.render({ target: this.element });
      this.state.isInputMounted = true;
    } else {
      this.field.update(this._buildFieldContent(options));
    }
    return this;
  }
  renderFieldContent(options = {}) {
    throw new Error("renderInputContent must be implemented by subclass.");
  }
  /**
   * Renderiza o conteúdo do label com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o label.
   * @param {string} [options.text] - Texto visível do label.
   * @param {string} [options.for] - ID do elemento associado ao label.
   */
  renderLabelContent(options = {}) {
    this.label.renderContent(this._buildLabelContent(options));
  }
  /**
   * Constrói o conteúdo do label com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o label.
   * @param {string} [options.text] - Texto visível do label.
   * @param {string} [options.for] - ID do elemento associado ao label.
   * @param {Object} [options.attributes] - Atributos adicionais.
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
      ...options,
      ...{
        text: options.text || "Label",
        for: options.for || this.field.element.id,
      },
    };
  }
  _buildFieldContent(options = {}) {
    console.error("_buildFieldContent must be implemented by subclass.");
    return {};
  }
  setError(message = "Campo obrigatório") {
    if (!this.error) {
      this.error = new FieldError(message);
      this.addComponent(this.error);
    } else {
      this.error.setMessage(message);
    }

    if (this.field) {
      this.field.addClass("input-error");
    }

    return this;
  }

  clearError() {
    if (this.error) {
      this.error.remove();
      this.error = null;
    }

    if (this.field) {
      this.field.removeClass("input-error");
    }

    return this;
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
  }
  /**
   * Renderiza o conteúdo do input com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o input.
   */
  renderFieldContent(options = {}) {
    this.input.renderContent(this._buildFieldContent(options));
  }
  getValue() {
    if (!this.input) {
      throw new Error("Input component is not initialized.");
    }
    return this.input.getValue();
  }
  /**
   * Constrói o conteúdo do input com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o input.
   * @param {string} [options.type="text"] - O tipo de input (text, password, email etc.).
   * @param {string} [options.id] - ID do input.
   * @param {string} [options.idPrefix="input"] - Prefixo para gerar um ID aleatório se não for fornecido.
   * @returns {Object} Objeto com as propriedades do input.
   */
  _buildFieldContent(options = {}) {
    return {
      ...options,
      ...{
        type: options.type || "text",
        id: options.id || generateRandomId("input"),
        idPrefix: options.idPrefix || "input",
      },
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
  }
  /**
   * Renderiza o conteúdo do select com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o select.
   */
  renderFieldContent(options = {}) {
    this.select.renderContent(this._buildFieldContent(options));
  }
  getValue() {
    if (!this.select) {
      throw new Error("Select component is not initialized.");
    }
    return this.select.getValue();
  }
  /**
   * Constrói o conteúdo do select com base nas opções fornecidas.
   * @param {Object} options - Opções para configurar o select.
   * @param {Array<{ value: string, text: string }>} [options.options] - Lista de opções para o select.
   * @param {string} [options.id] - ID do select.
   * @param {string} [options.idPrefix="select"] - Prefixo para gerar um ID aleatório se não for fornecido.
   * @returns {Object} Objeto com as propriedades do select.
   */
  _buildFieldContent(options = {}) {
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

    /** @type {Object.<string, FormElementComponent> | {}}*/
    this.fields = {};
    this.state = {
      hasField: this._hasField(),
    };
  }
  renderContent(options = {}) {
    if (this.fields == null) throw new Error("No fields added yet");
    if (!this._hasField())
      throw new Error(
        "FieldsContainer must have at least one field to render."
      );
    const this_ = this;
    Object.keys(this.fields).forEach((name) => {
      const field = this_.fields[name];
      if (field.isMounted()) {
        console.warn(
          `FieldsContainer: "${name}" field is already mounted. Remounting it.`
        );
        field.remove();
      }
      if (field instanceof FormElementComponent) field.renderContent();
      field.render({ target: this_.element });
    });
    return this;
  }
  /**
   * Adiciona um campo já renderizado ao container.
   * @param {string} name - O nome do campo.
   * @param {FormElementComponent} field - O campo já renderizado a ser adicionado.
   * @returns {FieldsContainer} Retorna a instância do FieldsContainer para encadeamento.
   * @throws {Error} Se o nome ou o campo não forem fornecidos.
   */
  addRenderedField(name, field) {
    if (!name || !field) {
      throw new Error("FieldsContainer: 'name' and 'field' are required.");
    }
    if (this.fields.hasOwnProperty(name)) {
      console.warn(
        `FieldsContainer: container already has "${name}" element. Overriding it...`
      );
    }
    if (this.fields == null) this.fields = {};
    this.fields[name] = field;
    this._setHasField();
    return this;
  }
  /**
   * Adiciona um campo ao container.
   * @param {string} name - O nome do campo.
   * @param {typeof FormElementComponent | typeof ValueField | typeof Input | typeof Select | typeof TextArea | typeof LabeledField | typeof LabeledInput | typeof LabeledSelect | typeof FieldsContainer | typeof Button} FieldClass - Classe do elemento a ser adicionado.
   * @param {Object} [constructorOptions={}] - Opções adicionais para o construtor do elemento.
   * @param {Object} [renderOptions={}] - Opções de renderização para o campo.
   * @returns {FieldsContainer} Retorna a instância do FieldsContainer para encadeamento.
   * */
  addField(name, FieldClass, constructorOptions = {}, renderOptions = {}) {
    if (!name || !FieldClass) {
      throw new Error("FieldsContainer: 'name' and 'FieldClass' are required.");
    }
    if (this.fields.hasOwnProperty(name)) {
      console.warn(
        `FieldsContainer: container already has "${name}" element. Overriding it...`
      );
    }

    renderOptions.attributes = {
      ...renderOptions?.attributes,
      name: name,
    };
    const field = new FieldClass(constructorOptions).renderContent(
      renderOptions
    );

    if (this.fields == null) this.fields = {};
    this.fields[name] = field;
    this._setHasField();
    return this;
  }
  getValues({ nested = false, prefix = "" } = {}) {
    if (!this._hasField()) {
      throw new Error("FieldsContainer has no fields to get values from.");
    }

    const values = {};
    Object.entries(this.fields).forEach(([name, field]) => {
      if (field instanceof Button) return;
      const fullName = prefix ? `${prefix}.${name}` : name;

      if (field instanceof FieldsContainer) {
        const subValues = field.getValues({ nested, prefix: fullName });
        if (nested) {
          values[name] = subValues;
        } else {
          Object.assign(values, subValues);
        }
      } else if (
        field instanceof ValueField ||
        field instanceof Input ||
        field instanceof Select ||
        field instanceof TextArea ||
        field instanceof LabeledInput ||
        field instanceof LabeledSelect
      ) {
        values[fullName] = field.getValue();
      } else {
        console.warn(
          `FieldsContainer: "${name}" is not a ValueField or container. Skipping.`
        );
      }
    });

    return values;
  }

  _hasField() {
    return this.fields != null && Object.keys(this.fields).length > 0;
  }
  _setHasField() {
    if (!this._hasField()) {
      if (this.isMounted())
        console.warn(
          "Component mounted. Avoid mounting empty fields container."
        );
      this.setState({ hasField: this._hasField() });
    }
  }
}

// Dentro de fields.js

export class FieldError extends Component {
  /**
   * @param {string} [message=""] - Mensagem de erro a ser exibida.
   */
  constructor(message = "") {
    super("span", "text-error text-sm mt-1");
    this.setText(message);
  }
  /**
   * Renderiza o conteúdo do FieldError.
   * @param {Object} options - Opções para configurar o FieldError.
   * @param {string} [options.message] - Mensagem de erro a ser exibida.
   * @returns {this} Retorna a instância do FieldError para encadeamento.
   */
  setMessage(message) {
    this.setText(message);
    return this;
  }
}
