// @ts-check
import { Card } from "../components/display.js";
import { Component } from "../engine/core.js";
import { BulletList } from "../components/bullets.js";
import { stepsData } from "./data/howData.js";

/**
 * Um cartão estilizado com ícone circular, título e bullets
 */
export class HowStepCard extends Card {
  constructor() {
    super(
      "flex flex-col items-center md:w-1/3 text-center bg-transparent shadow-none"
    );
    this.header.addClassList("mb-4");
    this.body.addClassList("mt-4");
  }

  /**
   * Renderiza o conteúdo com SVG, título e bullets
   * @param {{ title?: string, svg?: string, bullets?: string[] }} options 
   * @returns {this}
   */
  renderContent(options = {}) {
    const { title = "", svg = "", bullets = [] } = options;
    this.setState(options);

    return super.renderContent({
      header: this._renderCircleIcon(svg),
      body: this._renderBody(title, bullets),
    });
  }

  _renderCircleIcon(svg) {
    const circle = new Component("div",
      "bg-base-300 w-30 h-30 md:w-40 md:h-40 rounded-full " +
      "flex items-center justify-center text-primary shadow-neon"
    );
    circle.setContent(svg);
    return circle;
  }

  _renderBody(title, bullets) {
    const titleEl = new Component(
      "h3",
      "font-heading barlow-condensed-semibold text-3xl"
    ).setText(title);

    const list = new BulletList();
    list.addItems(bullets);
    list.setClassList("space-y-2 text-xl roboto-flex-100 text-center mt-10");

    return [titleEl, list];
  }
}

export class AppHowItWorks extends Component {
  constructor(target) {
    super("div", "relative mt-16");
    this.render({ target });

    new Component("div",
      "hidden md:block absolute top-1/2 left-8 right-8 h-[2px] bg-primary opacity-50")
      .render({ target: this.element });

    this.stepsWrapper = new Component(
      "div",
      "flex flex-col md:flex-row items-center " +
      "justify-between space-y-12 md:space-y-0 md:space-x-4",
    ).render({ target: this.element });
  }

  init() {
    stepsData.forEach(step =>
      new HowStepCard().renderContent(step).render({ target: this.stepsWrapper.element })
    );
  }
}
