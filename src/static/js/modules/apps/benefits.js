// static/js/modules/apps/benefits.js
//@ts-check

import { Component } from "../engine/core.js";
import { Card } from "../components/display.js";
import { BulletList } from "../components/bullets.js";
import { cardsData } from "./data/benefitsData.js";

export class BenefitsCard extends Card {
  constructor() {
    super(
      "w-96 md:h-[460px] bg-base-300 rounded-xl transition-all duration-300 hover:shadow-neon hover:scale-105"
    );
    this.body.addClassList("max-w-full justify-center m-auto");
    this.header.addClassList("flex justify-center pt-6 px-6");
  }
  renderContent(options = {}) {
    const { title = "", descriptions = [], svg = "" } = options;
    this.setState(options);

    return super.renderContent({
      header: svg,
      body: this._buildBodyContent(title, descriptions),
    });
  }
  /**
   * Builds the body content for the benefits card.
   * @param {string} title - The title of the card.
   * @param {string[]} descriptions - An array of description strings.
   * @returns {Component[]} - Returns an array of components to be rendered in the body.
   */
  _buildBodyContent(title, descriptions) {
    const titleEl = new Component(
      "h3",
      "text-center text-xl md:text-2xl font-heading barlow-condensed-regular px-2"
    ).setText(title);

    const list = new BulletList();
    list.setClassList("space-y-2 text-lg md:text-xl mt-4 roboto-flex-400");
    for (const desc of descriptions) list.addItem(desc);

    return [titleEl, list];
  }
}

export class AppBenefits extends Component {
  constructor() {
    super("div", "mx-auto mt-20");
    const classList =
      "grid grid-cols-1 md:grid-cols-3 justify-items-center gap-4 mt-10 w-11/12 mx-auto";
    this.cardsWrapper = new Component("div", classList);
  }
  /**
   * Renders a benefits card with the provided data.
   * @param {Object} options - The data for the benefits card.
   * @returns {BenefitsCard} - Returns the BenefitsCard instance.
   */
  renderCard(options = {}) {
    const card = new BenefitsCard().renderContent(options);
    card.render({ target: this.cardsWrapper.element });
    return card;
  }
  /**
   * Initializes the component and renders the benefits cards.
   * @param {string|HTMLElement|Component|Node} target - The target to resolve and where the component will be rendered to.
   * @returns {AppBenefits} - Returns the AppBenefits instance for chaining.
   */
  init(target) {
    this.render({ target: target });
    this.cardsWrapper.render({ target: this.element });
    for (const data of cardsData) this.renderCard(data);
    return this;
  }
}
