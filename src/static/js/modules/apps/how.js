// @ts-check
import { Card } from "../components/display.js";
import { Component } from "../engine/core.js";
import { BulletList } from "../components/bullets.js";
import { stepsData } from "./data/howData.js";

export class HowStepCard extends Card {
  constructor() {
    super(
      "flex flex-col items-center md:w-1/3 text-center bg-transparent shadow-none"
    );
    this.header.addClassList("mb-4");
    this.body.addClassList("mt-4");
  }

  renderContent(options = {}) {
    const { title = "", svg = "", bullets = [] } = options;
    this.setState(options);

    return super.renderContent({
      header: this._buildCircleIcon(svg),
      body: this._buildBodyContent(title, bullets),
    });
  }

  _buildCircleIcon(svg) {
    const circle = new Component("div",
      "bg-base-300 w-30 h-30 md:w-40 md:h-40 rounded-full " +
      "flex items-center justify-center text-primary shadow-neon"
    );
    circle.setContent(svg);
    return circle;
  }

  _buildBodyContent(title, bullets) {
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

/**
 * Botão CTA com scroll suave
 */
class HowCtaButton extends Component {
  constructor() {
    super("a",
      "btn btn-primary hover:btn-success text-3xl px-8 py-8 mt-10 " +
      "rounded-full shadow-neon hover:shadow-neon-success transition-all duration-300 " +
      "font-heading barlow-condensed-semibold"
    );
    this.setText("Agendar treino experimental");
  }

  init(buttonTargetId = "contact") {
    this.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(buttonTargetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        console.warn(`#${buttonTargetId} não encontrado.`);
      }
    });
  }
}

export class AppHowItWorks extends Component {
  /**
   * @param {{ buttonTargetId?: string }} options
   */
  constructor(options = {}) {
    super("div", "relative mt-16");
    this.buttonTargetId = options.buttonTargetId || "contact";

    // linha horizontal de conexão (estética)
    new Component("div",
      "hidden md:block absolute top-1/2 left-8 right-8 h-[2px] bg-primary opacity-50")
      .render({ target: this.element });

    this.stepsWrapper = new Component(
      "div",
      "flex flex-col md:flex-row items-center " +
      "justify-between space-y-12 md:space-y-0 md:space-x-4",
    ).render({ target: this.element });

    this.ctaWrapper = new Component("div", "mt-16 text-center")
      .render({ target: this.element });
    this.cta = new HowCtaButton();
  }
  renderContent(options = {}) {
    stepsData.forEach(step =>
      new HowStepCard().renderContent(step).render({ target: this.stepsWrapper.element })
    );
    this.cta.render({ target: this.ctaWrapper.element });
    
  }
  init(target, options = {}) {
    this.renderContent(options);
    const buttonTargetId = options.buttonTargetId || "contact";
    this.cta.init(buttonTargetId);
    this.render({ target: target });
  }
}
