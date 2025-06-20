// @ts-check

import { Component } from "../engine/core.js";

export class Button extends Component {
  /**
   * @param {{
   *   classList?: string | string[] | null,
   *   attributes?: { [key: string]: string },
   *   text?: string,
   *   onClick?: (() => void) | null
   * }} options
   */
  constructor({
    classList = null,
  }) {
    super("button", classList);
  }
  renderContent(options = {}) {
    if (options?.text) {
      this.setContent(options.text);
    }
    if (options?.attributes) {
      for (const [key, value] of Object.entries(options.attributes)) {
        this.setAttribute(key, value);
      }
    }
    if (options?.onClick) {
      this.addEventListener("click", options.onClick);
    }
    return this;
  }
}
