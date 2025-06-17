// /static/js/modules/testimonyCard.js
//@ts-check
import { Component } from "../engine/core.js";
import { Card } from "../components/display.js";
import { testimonyData } from "./data/testimonyData.js";
/**
 * Card 3-D para depoimentos.
 *  - foto redonda
 *  - nome, cargo
 *  - citação curta
 *  - animações de escala / blur controladas por setActive()
 *  @extends Card
 */
export class TestimonyCard extends Card {
  constructor() {
    super(
      "absolute flex-col justify-center w-64 md:w-80 h-[460px] bg-base-300 rounded-xl " +
        "transition-all duration-700 ease-in-out transform-gpu "
    );
    this.header.addClassList("avatar flex justify-center pt-6 px-6 mt-8");
    this.body.addClassList("items-center text-center py-8");
  }
  _buildHeader(image, name) {
    const avatar = new Component(
      "div",
      "w-32 rounded-full ring-2 ring-offset-2 ring-primary border-primary shadow-neon ring-offset-base-100 overflow-hidden"
    )

    new Component("img")
      .setAttributes({
        src: image,
        alt: `Foto de ${name}`,
        class: "w-full h-full object-cover",
      })
      .render({ target: avatar.element });

    return avatar;
  }
  renderBody(options = {}) {
    const { name = "", role = "", quote = "", image = "" } = options;

    const bodyContent = [];
    const headerContent = this._buildHeader(image, name);

    /* quote */
    const quoteComponent = new Component("p", "italic text-lg roboto-flex-400 mt-10")
      .setText(`“${quote}”`)
      .render({ target: this.body.element });

    /* nome */
    const nameComponent = new Component(
      "h3",
      "font-heading barlow-condensed-semibold text-xl text-primary"
    )
      .setText(name);

    /* cargo (opcional) */
    bodyContent.push(quoteComponent, nameComponent);
    this.setState({ name, role, quote, image });
    if (role) {
      const roleComponent = new Component("span", "text-sm opacity-70")
        .setText(role);
      bodyContent.push(roleComponent);
    }

    this.state.active = false;
    this.applyState();
    return super.renderContent({ header: headerContent, body: bodyContent });

  }

  /** Aplica classes conforme active / inactive */
  applyState() {
    if (this.state.active) {
      this.addClassList("scale-100 blur-0 opacity-100 z-20");
      this.removeClassList(["scale-90", "blur-sm", "opacity-50"]);
    } else {
      this.addClassList("scale-90 blur-sm opacity-50");
      this.removeClassList(["scale-100", "z-20", "opacity-100"]);
    }
  }

  /**
   * Define se o card está no foco do carrossel.
   * @param {boolean} isActive
   */
  setActive(isActive) {
    this.setState({ active: isActive });
    this.applyState();
  }
}

/**
 * Carrossel 3D de depoimentos
 */
export class TestimonyCarousel extends Component {
  /**
   * @param {string|HTMLElement|Component|Node} target
   * @param {{ interval?: number }} [opts]
   */
  constructor(target, opts = {}) {
    super("div", "relative grid grid-cols-3 gap-8 items-center h-[440px]");
    this.render({ target });

    /** @type {TestimonyCard[]} */
    this.cards = [];
    this.currentIndex = 0;
    this.interval = opts.interval ?? 5000;

    testimonyData.forEach((data) => {
      const card = new TestimonyCard().renderBody(data);
      this.cards.push(card);
      this.element.appendChild(card.element);

      card.setStyle({ left: "50%", transform: "translateX(-50%)" });
    });

    this.timer = undefined;
  }

  init() {
    this.updateVisuals();
    this.timer = setInterval(() => this.next(), this.interval);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    this.updateVisuals();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
    this.updateVisuals();
  }

  updateVisuals() {
    const len = this.cards.length;

    this.cards.forEach((card, idx) => {
      card.setActive(false);
      card.setStyle({
        display: "none",
        transform: "translateX(-50%)",
        zIndex: "0",
        opacity: "0",
      });
    });

    const center = this.currentIndex;
    const left = (center - 1 + len) % len;
    const right = (center + 1) % len;

    this.cards[center].setActive(true);
    this.cards[center].setStyle({
      display: "flex",
      transform: "translateX(-50%) scale(1)",
      zIndex: "30",
      opacity: "1",
    });

    this.cards[left].setStyle({
      display: "flex",
      transform: "translateX(-160%) scale(0.85)",
      zIndex: "20",
      opacity: "0.5",
    });

    this.cards[right].setStyle({
      display: "flex",
      transform: "translateX(50%) scale(0.85)",
      zIndex: "20",
      opacity: "0.5",
    });
  }

  stop() {
    clearInterval(this.timer);
  }
}
