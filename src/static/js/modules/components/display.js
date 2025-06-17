//@ts-check

import { Component } from "../engine/core.js";
import { normalizeClass } from "../utils.js";

/**
 * Componente de seção de cartão, usado para estruturar o conteúdo do cartão.
 * Pode ser usado para o cabeçalho, corpo ou rodapé do cartão.
 * @extends Component
 */
export class CardSection extends Component {
  /**
   * @param {"header"|"body"|"footer"} type
   * @param {string|string[]} [classList]
   */
  constructor(type, classList = "") {
    super("div", `card-${type}`);
    this.addClassList(normalizeClass(classList));
  }
  renderContent(options = {}) {
    if (options?.content) {
      this.setContent(options.content);
    }
    return this;
  }
}

export class Card extends Component {
  constructor(classList = "") {
    super("div", "card");
    this.addClassList(normalizeClass(classList));
    this.state = {
      headerContent: null, // Placeholder for header content
      bodyContent: null, // Placeholder for body content
      footerContent: null, // Placeholder for footer content
    };
    this.header = new CardSection("header");
    this.body = new CardSection("body");
    this.footer = new CardSection("footer");
    this.state = {
      isHeaderMounted: false,
      isBodyMounted: false,
      isFooterMounted: false,
    };
  }

  /**
   * Sets the  content of the card header.
   *
   * @param {string|HTMLElement|Component} content - The innerHTML to set, or a HTMLElement or Component.
   * @returns {Card} This Component instance for chaining.
   */
  setHeaderContent(content) {
    this.header.setContent(content);
    return this;
  }

  /**
   * Sets the  content of the card body.
   *
   * @param {string|HTMLElement|Component} content - The innerHTML to set, or a HTMLElement or Component.
   * @returns {Card} This Component instance for chaining.
   */
  setBodyContent(content) {
    this.body.setContent(content);
    return this;
  }
  /**
   * Adds a component to the card body.
   *
   * @param {Component} component - The Component instance to add to the card body.
   */
  addBodyComponent(component) {
    this.body.addComponent(component);
  }

  /**
   * Sets the  content of the card footer.
   *
   * @param {string|HTMLElement|Component} content - The innerHTML to set, or a HTMLElement or Component.
   * @returns {Card} This Component instance for chaining.
   */
  setFooterContent(content) {
    this.footer.setContent(content);
    return this;
  }
  renderContent(options = {}) {
    console.debug("Card.renderContent", options);
    if (options?.header) {
      if (this.header.isMounted()) {
        this.header.update({ content: options.header });
      } else {
        if (options.header instanceof Array) {
          options.header.forEach((item) => {
            if (item instanceof Component) {
              this.header.addComponent(item);
            } else {
              this.header.setContent(item);
            }
          });
        } else if (options.header instanceof Component) {
          this.header.addComponent(options.header);
        } else {
          this.setHeaderContent(options.header);
        }
        this.header.render({ target: this.element });
        this.setState({ isHeaderMounted: this.header.isMounted() });
      }
    }
    if (options?.body) {
      if (this.body.isMounted()) {
        this.body.update({ content: options.body });
      } else {
        if (options.body instanceof Array) {
          options.body.forEach((item) => {
            if (item instanceof Component) {
              this.addBodyComponent(item);
            } else {
              this.body.setContent(item);
            }
          });
        } else if (options.body instanceof Component) {
          this.addBodyComponent(options.body);
        } else {
          this.setBodyContent(options.body);
        }
        this.body.render({ target: this.element });
        this.setState({ isBodyMounted: this.body.isMounted() });
      }
    }
    if (options?.footer) {
      if (this.footer.isMounted()) {
        this.footer.update({ content: options.footer });
      } else {
        if (options.footer instanceof Array) {
          options.footer.forEach((item) => {
            if (item instanceof Component) {
              this.footer.addComponent(item);
            } else {
              this.footer.setContent(item);
            }
          });
        } else if (options.footer instanceof Component) {
          this.footer.addComponent(options.footer);
        } else {
          this.setFooterContent(options.footer);
        }
        this.footer.render({ target: this.element });
        this.setState({ isFooterMounted: this.footer.isMounted() });
      }
    }
    return this;
  }
}
