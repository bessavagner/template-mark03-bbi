//@ts-check
import { Component } from "../engine/core.js";
import { Card } from "../components/display.js";
import { Anchor } from "../components/actions.js";
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
  renderContent(options = {}) {
    const { name = "", role = "", quote = "", image = "" } = options;

    const bodyContent = this._buildBodyContent(options);
    const headerContent = this._buildHeader(image, name);

    this.state.active = false;
    this.setState({ name, role, quote, image });
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
  _buildBodyContent(options = {}) {
    const { name = "", role = "", quote = "", image = "" } = options;
    
    const bodyContent = [];

    const quoteComponent = new Component("p", "italic text-lg roboto-flex-400 mt-10")
      .setText(`“${quote}”`)
      .render({ target: this.body.element });

    const nameComponent = new Component(
      "h3",
      "font-heading barlow-condensed-semibold text-xl text-primary"
    )
      .setText(name);

      bodyContent.push(quoteComponent, nameComponent);

      
      if (role) {
        const roleComponent = new Component("span", "text-sm opacity-70")
        .setText(role);
        bodyContent.push(roleComponent);
      }

      return  bodyContent;
  }
}

/**
 * Carrossel 3D de depoimentos
 */
export class TestimonyCarousel extends Component {
  /**
   * @param {{ interval?: number }} [opts]
   */
  constructor(opts = {}) {
    super("div", "relative grid grid-cols-3 gap-8 items-center h-[440px]");

    /** @type {TestimonyCard[]} */
    this.cards = [];
    this.currentIndex = 0;
    this.interval = opts.interval ?? 5000;

    testimonyData.forEach((data) => {
      const card = new TestimonyCard().renderContent(data);
      this.cards.push(card);
      this.element.appendChild(card.element);

      card.setStyle({ left: "50%", transform: "translateX(-50%)" });
    });

    this.timer = undefined;
  }

  init(target) {
    this.render({ target });
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

export class AppTestimony extends Component {
  constructor() {
    super("section", "flex flex-col items-center justify-center md:grid-cols-2 w-full gap-4");
    this.carousel = new TestimonyCarousel();
  }

  renderContent() {
    this.addComponent(
      new Component("h2", "barlow-condensed-bold text-2xl md:text-3xl text-center text-primary")
        .setText("O que nossos alunos dizem")
    )
    this.carousel.addClass("mt-10")
    this.carousel.init(this.element);
    new Component("div", "flex flex-col w-1/2 h-full items-center justify-evenly mt-8 space-y-4 mx-auto")
      .addComponent(
        new Component("p", "text-xl opacity-80 mt-2")
          .setText("Mais de 80% de agendados se tornam alunos")
        )
      .addComponent(
        new Anchor({
          targetBlank: false,
          classList:
            "btn btn-accent w-64 text-lg px-6 py-3 mt-4 rounded-full shadow-neon-accent hover:btn-success hover:shadow-neon-success transition-all duration-300 ",
        })
          .renderContent({
            text: "Agendar Aula",
            onClick: (e) => {
              e.preventDefault();
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            },
          })
          .setText("Agendar Aula")
      )
      .render({ target: this.element });
    return this;
  }

  init(target) {
    this.render({ target });
    this.renderContent();
  }
}