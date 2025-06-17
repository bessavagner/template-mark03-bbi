//@ts-check

import { Component } from "../engine/core.js";
import { normalizeClass } from "../utils.js";

/**
 * Componente de lista genérica para exibir uma coleção de itens.
 * Permite adicionar, renderizar e limpar itens dinamicamente.
 *  @extends Component
 */
export class ComponentList extends Component {
  /**
   * Cria uma nova instância de ComponentList.
   * @param {string|string[]} [wrapperClass=""] Classe CSS opcional para o wrapper da lista.
   */
  constructor(wrapperClass = "") {
    super("div", normalizeClass(wrapperClass));
    this.state = {
      items: /** @type {Component[]} */ ([])
    };
  }
  /**
   * Adiciona um item à lista.
   * @param {Component} item
   * @returns {ComponentList}
   */
  add(item) {
    const { items } = this.state  || {items: []};
    if (!(item instanceof Component)) {
      console.warn("Item must be an instance of Component");
      return this;
    }
    items.push(item);
    return this.setState({ items });
  }
  renderContent(options = {}) {
    if (options?.items) {
      this.setState({ item: options.items });
    }
    const { items } = this.state || { items: [] };
    if (!items) {
      console.warn("No item provided for ComponentList");
      return this;
    }
    this.setContent("");
    items.forEach((item) => {
        item.render({ target: this.element });
    });
  }
  clear() {
    this.remove();
    this.state.items = [];
    return this;
  }
}
