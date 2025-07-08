// @ts-check

import { Component } from "../engine/core.js";

export class Button extends Component {
  /**
   * @param {{ classList?: string | string[] | null }} options
   */
  constructor({
    classList = null,
  }) {
    super("button", classList);
  }
  /**
   * @param {{
   *   classList?: string | string[] | null,
   *   attributes?: { [key: string]: string },
   *   text?: string,
   *   onClick?: (() => void) | null
   * }} options
   */
  renderContent(options = {}) {
    if (options?.text) {
      this.setText(options.text);
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


export class Anchor extends Component {
  /**
   * @param {{ href?: string | null, classList?: string | string[] | null, targetBlank?: boolean }} options
   */
  constructor({
    href = null,
    classList = null,
    targetBlank = true,
  }) {
    super("a", classList);
    if (href) {
      this.setAttribute("href", href);
    }
    if (targetBlank) {
      this.setAttribute("target", "_blank");
      this.setAttribute("rel", "noopener noreferrer");
    }
  }
  renderContent(options = {}) {
    if (options?.text) {
      this.setText(options.text);
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

export class AnchorToSection extends Anchor {
  /**
   * @param {{ classList?: string | string[] | null }} options
   */
  constructor({classList = null}) {
    if (!classList) {
      classList = "text-gray-500 hover:text-primary";
    }
    super({targetBlank: false, classList: classList });
  }
  renderContent(options = {}) {
    const sectionTargetId = options?.sectionTargetId;
    if (!sectionTargetId) {
      throw new Error("sectionTargetId is required for FooterAnchor");
    }
    return super.renderContent({
      ...options,
      onClick: (e) => {
        e.preventDefault();
        console.log(`Scrolling to section: ${sectionTargetId}`);
        document
          .getElementById(sectionTargetId)
          ?.scrollIntoView({ behavior: "smooth" });
      },
    });
  }
}