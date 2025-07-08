//@ts-check

import { Component } from "../engine/core.js";
import { normalizeClass } from "../utils.js";

/**
 * Componente de seção de cartão, usado para estruturar o conteúdo do cartão.
 * Pode ser usado para o cabeçalho, corpo ou rodapé do cartão.
 * @extends Component
 */
export class CardSection extends Component {
  /**
   * @param {"header"|"body"|"footer"} type
   * @param {string|string[]} [classList]
   */
  constructor(type, classList = "") {
    let className = "";
    // Para que tailwind compile a classe:
    if (type === "header") {
      className = "card-header";
    } else if (type === "body") {
      className = "card-body";
    } else if (type === "footer") {
      className = "card-footer";
    } else {
      console.warn(
        `CardSection: Invalid type "${type}". Defaulting to "body".`
      );
      className = "card-body";
    }
    super("div", `card-${type}`);
    this.addClassList(normalizeClass(className));
  }
  renderContent(options = {}) {
    if (options?.content) {
      this.setContent(options.content);
    }
    return this;
  }
}

export class Card extends Component {
  constructor(classList = "") {
    super("div", "card");
    this.addClassList(normalizeClass(classList));
    this.state = {
      headerContent: null, // Placeholder for header content
      bodyContent: null, // Placeholder for body content
      footerContent: null, // Placeholder for footer content
    };
    this.header = new CardSection("header");
    this.body = new CardSection("body");
    this.footer = new CardSection("footer");
    this.state = {
      isHeaderMounted: false,
      isBodyMounted: false,
      isFooterMounted: false,
    };
  }

  /**
   * Sets the  content of the card header.
   *
   * @param {string|HTMLElement|Component} content - The innerHTML to set, or a HTMLElement or Component.
   * @returns {Card} This Component instance for chaining.
   */
  setHeaderContent(content) {
    this.header.setContent(content);
    return this;
  }

  /**
   * Sets the content of the card body.
   *
   * @param {string|HTMLElement|Component|Array<string|HTMLElement|Component>} content - The content(s) to set.
   * @returns {Card} This Component instance for chaining.
   */
  setBodyContent(content) {
    this.body.setContent(""); // Clear previous content
    if (Array.isArray(content)) {
      content.forEach((item) => {
        if (item instanceof Component) {
          this.body.addComponent(item);
        } else if (item instanceof HTMLElement) {
          this.body.element.appendChild(item);
        } else {
          this.body.setContent(item);
        }
      });
    } else if (content instanceof Component) {
      this.body.addComponent(content);
    } else if (content instanceof HTMLElement) {
      this.body.element.appendChild(content);
    } else {
      this.body.setContent(content);
    }
    return this;
  }
  /**
   * Adds a component to the card body.
   *
   * @param {Component} component - The Component instance to add to the card body.
   */
  addBodyComponent(component) {
    this.body.addComponent(component);
  }

  /**
   * Sets the  content of the card footer.
   *
   * @param {string|HTMLElement|Component} content - The innerHTML to set, or a HTMLElement or Component.
   * @returns {Card} This Component instance for chaining.
   */
  setFooterContent(content) {
    this.footer.setContent(content);
    return this;
  }
  renderContent(options = {}) {
    if (options?.header) {
      if (this.header.isMounted()) {
        this.header.update({ content: options.header });
      } else {
        if (options.header instanceof Array) {
          options.header.forEach((item) => {
            if (item instanceof Component) {
              this.header.addComponent(item);
            } else {
              this.header.setContent(item);
            }
          });
        } else if (options.header instanceof Component) {
          this.header.addComponent(options.header);
        } else {
          this.setHeaderContent(options.header);
        }
        this.header.render({ target: this.element });
        this.setState({ isHeaderMounted: this.header.isMounted() });
      }
    }
    if (options?.body) {
      if (this.body.isMounted()) {
        this.body.update({ content: options.body });
      } else {
        if (options.body instanceof Array) {
          options.body.forEach((item) => {
            if (item instanceof Component) {
              this.addBodyComponent(item);
            } else {
              this.body.setContent(item);
            }
          });
        } else if (options.body instanceof Component) {
          this.addBodyComponent(options.body);
        } else {
          this.setBodyContent(options.body);
        }
        this.body.render({ target: this.element });
        this.setState({ isBodyMounted: this.body.isMounted() });
      }
    }
    if (options?.footer) {
      if (this.footer.isMounted()) {
        this.footer.update({ content: options.footer });
      } else {
        if (options.footer instanceof Array) {
          options.footer.forEach((item) => {
            if (item instanceof Component) {
              this.footer.addComponent(item);
            } else {
              this.footer.setContent(item);
            }
          });
        } else if (options.footer instanceof Component) {
          this.footer.addComponent(options.footer);
        } else {
          this.setFooterContent(options.footer);
        }
        this.footer.render({ target: this.element });
        this.setState({ isFooterMounted: this.footer.isMounted() });
      }
    }
    return this;
  }
}

export class Circle extends Component {
  constructor() {
    super("div", "rounded-full flex items-center justify-center");
  }
  renderContent(options = {}) {
    const size = options.size || "30";
    const mdSize = options.msSize || "40";
    const bgClass = options.bgClass || "bg-primary";
    const classList = options.classList || "";
    this.addClassList(
      `w-${size} h-${size} md:w-${mdSize} md:h-${mdSize} ${bgClass} ${classList}`
    );
    if (options?.content) {
      this.setContent(options.content);
    }
    return this;
  }
}

/**
 * Componente base genérico para carrosséis.
 *
 * ▸ Construtor: recebe apenas `classList` e opções estritamente
 *   necessárias (intervalo, quantidade de itens visíveis etc.).
 * ▸ renderContent(): gera/atualiza slides chamando _buildSlide().
 * ▸ Métodos de navegação (next, prev, goTo) + autoplay (start / stop).
 * ▸ Sub-classes só precisam sobrescrever _buildSlide() e,
 *   opcionalmente, updateVisuals().
 */
export class CarouselBase extends Component {
  /**
   * @param {{
   *   classList?: Array<string>|string|null,
   *   interval?: number,
   *   visibleCount?: number
   * }} [opts]
   */
  constructor({ classList = null, interval = 5000, visibleCount = 1 } = {}) {
    super("div", ["relative", "overflow-hidden"]);
    if (classList) {
      this.addClassList(classList);
    }

    /**  @type {Component} */
    this.track = new Component(
      "div",
      "flex h-full transition-transform duration-500 ease-in-out"
    );
    this.addComponent(this.track);

    /** @protected @type {Component[]} */
    this.slides = [];

    /** @protected */ this.currentIndex = 0;
    /** @protected */ this.interval = interval;
    /** @protected */ this.visibleCount = visibleCount;
    /** @private */ this._timer = undefined;
  }

  /**
   * Renderiza ou atualiza o carrossel.
   * @param {{ items?: any[] }} [options]
   *   ➜ Cada item é passado para _buildSlide().
   */
  renderContent({ items = [] } = {}) {
    // Se já existiam slides, remove-os antes de redesenhar
    if (this.slides.length) {
      this.slides.forEach((slide) => slide.remove());
      this.slides = [];
    }

    items.forEach((itemData) => {
      const slide = this._buildSlide(itemData);
      this.slides.push(slide);
      this.track.addComponent(slide);
    });

    this.track.setStyle({
      width: `${this.slides.length * 100}%`,
      display: "flex",
    });
    this.slides.forEach((slide) => {
      slide.setStyle({
        width: `${100 / this.slides.length}%`,
        flexShrink: "0",
      });
    });

    this.updateVisuals();
    return this;
  }

  /* ======================================================================
   * › SUB-COMPONENT BUILDERS
   * ====================================================================*/

  /**
   * Constrói um slide a partir dos dados fornecidos.
   * - Sub-classes DEVEM sobrescrever para montar slides específicos.
   * @protected
   * @param {any} itemData
   * @returns {Component}
   */
  _buildSlide(itemData) {
    // Placeholder genérico – evita erro se sub-classe esquecer de implementar
    return new Component("div", "flex-1 p-4").setText(JSON.stringify(itemData));
  }

  /* ======================================================================
   * › NAVEGAÇÃO / AUTOPLAY
   * ====================================================================*/

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  /**
   * Move para o índice desejado, com wrap-around.
   * @param {number} index
   */
  goTo(index) {
    const len = this.slides.length;
    if (!len) return;

    this.currentIndex = (index + len) % len;
    this.updateVisuals();
  }

  /**
   * Atualiza CSS do track para mostrar o slide corrente.
   * Sub-classes podem sobrescrever para efeitos 3-D, escalas etc.
   * @protected
   */
  updateVisuals() {
    const translatePct = -(100 / this.visibleCount) * this.currentIndex;
    this.track.setStyle({ transform: `translateX(${translatePct}%)` });
  }

  /* ======================================================================
   * › CICLO DE VIDA / BEHAVIOUR
   * ====================================================================*/

  /**
   * Monta o componente no DOM e inicia autoplay (se houver).
   * @param {HTMLElement|string|Component} target
   */
  init(target) {
    this.render({ target });
    this.start();
  }

  /** Inicia autoplay. */
  start() {
    this.stop(); // garante que não existam timers duplicados
    if (this.interval > 0) {
      this._timer = setInterval(() => this.next(), this.interval);
    }
  }

  /** Pausa autoplay. */
  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = undefined;
    }
  }

  /** Limpa timer ao remover do DOM. */
  beforeUnmount() {
    this.stop();
  }
}

export class Popup extends Component {
  constructor() {
    super(
      "div",
      "fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    );
    this.setAttribute("role", "dialog");

    const classList = "bg-base-300 rounded-xl shadow-lg w-[90%] max-w-md p-3 md:p-6 ";
    this.card = new Card(classList);
    this.addComponent(this.card);

    /** @type {{ isVisible: boolean, timeout: number|undefined|null }} */
    this.state = {
      isVisible: false,
      timeout: undefined,
    };
  }

  /**
   * Exibe o popup com título, mensagem e tipo visual (success, error, info).
   * @param {{
   *   title: string,
   *   message: string,
   *   type?: "success" | "error" | "info",
   *   autoCloseMs?: number
   * }} options
   */
  show({ title, message, type = "info", autoCloseMs = 20000 }) {
    const titleComp = new Component("h2", "text-xl font-bold mb-2").setText(
      title
    ).addComponent(this._buildIcon(type));
    const msgComp = new Component("p", "text-base leading-relaxed").setText(
      message
    );

    this.card.renderContent({
      body: [titleComp, msgComp],
      footer: new Component("button", "btn btn-sm btn-outline self-end mt-4")
        .setText("Fechar")
        .addEventListener("click", () => this.hide()),
    });
    this.card.footer.addClassList("flex justify-end");
    if (!this.isMounted()) {
      this.render({ target: document.body });
    }

    this.addClass("animate-fade-in");
    this.removeClass("hidden");
    console.log("Classes do elemento", this.element.classList);
    this.state.isVisible = true;

    if (autoCloseMs > 0) {
      clearTimeout(this.state.timeout);
      this.state.timeout = setTimeout(() => this.hide(), autoCloseMs);
    }

    return this;
  }

  hide() {
    this.addClass("hidden");
    this.state.isVisible = false;
    clearTimeout(this.state.timeout);
  }

  _buildIcon(type) {
    const map = {
      success: "✅",
      error: "❌",
      info: "ℹ️",
    };
    return new Component("span", "mx-1").setText(
      map[type] || "ℹ️"
    );
  }
}
