// static/js/modules/apps/benefits.js
//@ts-check

import { Component } from "../engine/core.js";
import { Card } from "../components/display.js";
import { BulletList } from "../components/bullets.js";
import { cardsData } from "./data/benefitsData.js";

export class BenefitsCard extends Card {
  constructor() {
    super(
      "w-96 md:h-[500px] bg-base-300 rounded-lg transition-all duration-300 hover:shadow-neon hover:scale-105"
    );
    this.body.addClassList("max-w-full justify-center m-auto");
  }
  renderBody(options = {}) {
    const { title = "", descriptions = [], svg = "" } = options;
    this.setState({ title, descriptions, svg });
    const svgWrapper = new Component(
      "div",
      "flex flex-col items-center mb-4"
    ).setContent(this.state.svg);
    const titleComponent = new Component(
      "h3",
      "mt-4 text-center text-xl md:text-4xl font-heading barlow-condensed-regular px-2"
    ).setText(this.state.title);
    const list = new BulletList();
    list.setClassList("space-y-2 text-lg md:text-xl mt-4 roboto-flex-400");
    for (const desc of this.state.descriptions) {
      list.addItem(desc);
    }
    return super.renderContent({
      body: [svgWrapper, titleComponent, list],
    });
  }
}

export class AppBenefits extends Component {
  /**
   * Initializes the AppBenefits component.
   * @param {string|HTMLElement|Component|Node} target - The target to resolve and where the component will be rendered to.
   */
  constructor(target) {
    super("div", "mx-auto mt-20");
    this.render({ target: target });
    const classList =
      "grid grid-cols-1 md:grid-cols-3 justify-items-center gap-4 mt-10 w-11/12 mx-auto";
    this.cardsWrapper = new Component("div", classList).render({
      target: this.element,
    });
  }
  init() {
    for (const data of cardsData) {
      const card = new BenefitsCard().renderBody(data);
      card.render({ target: this.cardsWrapper.element });
    }
    return this;
  }
}
