// /static/js/modules/testimonyCard.js
//@ts-check
import { Component } from "../engine/core.js";
import { Card, CardList } from "../components/display.js";
import { testimonyData } from "./testimonyData.js";
/**
 * Card 3-D para depoimentos.
 *  - foto redonda
 *  - nome, cargo
 *  - citação curta
 *  - animações de escala / blur controladas por setActive()
 *  @extends Card
 */
export class TestimonyCard extends Card {
  /**
   * @param {{name:string, role?:string, quote:string, image:string}} opts
   */
  constructor(opts) {
    super();

    const { name = "", role = "", quote = "", image = "" } = opts;

    /* ---------- classe base ---------- */
    this.addClassList(
      "absolute flex-col justify-center w-64 md:w-80 h-[460px] bg-base-300 rounded-xl " +
        "transition-all duration-700 ease-in-out transform-gpu "
    ); //  scale/blur alterados pelo estado

    /* ---------- body ---------- */
    this.cardBody.addClassList(
      "items-center text-center py-16"
    );

    /* foto */
    const avatarWrapper = new Component(
      "div",
      "avatar"
    ).render({ target: this.cardBody.element });
    const avatar = new Component(
      "div",
      "w-32 rounded-full ring-2 ring-offset-2 ring-primary border-primary shadow-neon ring-offset-base-100 overflow-hidden"
    ).render({ target: avatarWrapper.element });

    new Component("img")
      .setAttributes({
        src: image,
        alt: `Foto de ${name}`,
        class: "w-full h-full object-cover",
      })
      .render({ target: avatar.element });

    /* quote */
    new Component("p", "italic text-lg roboto-flex-400 mt-10")
      .setText(`“${quote}”`)
      .render({ target: this.cardBody.element });

    /* nome */
    new Component(
      "h3",
      "font-heading barlow-condensed-semibold text-xl text-primary"
    )
      .setText(name)
      .render({ target: this.cardBody.element });

    /* cargo (opcional) */
    if (role) {
      new Component("span", "text-sm opacity-70")
        .setText(role)
        .render({ target: this.cardBody.element });
    }

    /* ---------- estado visual ---------- */
    this.state = { active: false };
    this.applyState();
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
 * Carrossel 3-D de depoimentos.
 *  • Mostra 3 cards visíveis; central = ativo (sem blur/escala).
 *  • Auto-rotate a cada X segundos.
 *  • Métodos next/prev para controle externo.
 */
export class TestimonyCarousel extends CardList {
  /**
   * @param {string|HTMLElement|import("../engine/core.js").Component|Node} target
   * @param {{interval?:number}} [opts]
   */
  constructor(target, opts = {}) {
    super("relative grid grid-cols-3 gap-8 items-center h-[440px]"); // altura fixa ajustável
    this.render({ target });

    /** @type {TestimonyCard[]} */
    this.cards = [];
    this.currentIndex = 0;
    this.interval = opts.interval ?? 5000;

    // Criar todos os cards e armazenar
    testimonyData.forEach((data) => {
      const card = new TestimonyCard(data).renderBody();
      this.addCard(card);

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
    this.currentIndex =
      (this.currentIndex - 1 + this.cards.length) % this.cards.length;
    this.updateVisuals();
  }

  updateVisuals() {
    const len = this.cards.length;

    this.cards.forEach((card, idx) => {
      card.setActive(false); // reset
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

    // CENTER
    this.cards[center].setActive(true);
    this.cards[center].setStyle({
      display: "flex",
      transform: "translateX(-50%) scale(1)",
      zIndex: "30",
      opacity: "1",
    });

    // LEFT
    this.cards[left].setStyle({
      display: "flex",
      transform: "translateX(-160%) scale(0.85)",
      zIndex: "20",
      opacity: "0.5",
    });

    // RIGHT
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
