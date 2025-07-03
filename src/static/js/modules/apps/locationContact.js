// static/js/modules/apps/locationContact.js
// @ts-check
import { Component } from "../engine/core.js";
import { instagramPrimaryContent, whatsappPrimaryContent } from "../svg.js";

/**
 * Botão genérico (link estilizado).
 */
class ActionButton extends Component {
  /**
   * @param {{ href:string, text:string, extraClasses?:string, targetBlank?:boolean }} opts
   */
  constructor({ href, text, extraClasses = "", targetBlank = true }) {
    super(
      "a",
      "btn text-lg px-6 py-3 rounded-full shadow-neon hover:btn-success " +
        "hover:shadow-neon-success transition-all duration-300 " +
        extraClasses
    );
    this.setAttributes({
      href,
      ...(targetBlank && { target: "_blank", rel: "noopener noreferrer" }),
    });
    this.setText(text);
  }
}

/**
 * Seção Localização & Contato.
 */
export class AppLocationContact extends Component {
  /**
   * @param {{ address:string, mapsUrl:string,
   *           whatsappUrl:string, instagramUrl?:string,
   *           staticMapUrl:string, scheduleTargetId?:string }} opts
   */
  constructor(opts) {
    super(
      "div",
      "py-20 w-full"
    );
    this.opts = { scheduleTargetId: "contact", ...opts };
  }

  /** Monta o DOM interno */
  renderContent() {
    // container responsivo 2-colunas
    const container = new Component(
      "div",
      "container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-4"
    ).render({ target: this.element });

    this._buildMap().render({ target: container.element });
    this._buildInfo().render({ target: container.element });

    return this;
  }

  /** Inicializa */
  init(target) {
    this.render({ target });
    this.renderContent();
  }

  /** Mapa estático clicável */
  _buildMap() {
    const container = new Component("div", "w-96 h-96 max-w-1/2 mx-auto md:mr-0");
    const map = new Component("gmp-map", "w-full")
      .setAttributes({
        center: "-5.177338123321533,-40.67045211791992",
        zoom: "14",
        "map-id": "DEMO_MAP_ID",
      })
      .render({ target: container.element });

    new Component("gmp-advanced-marker")
      .setAttributes({
        position: "-5.177338123321533,-40.67045211791992",
        title: "Localização do Box Base Inicial",
      })
      .render({ target: map.element });

    return container;
  }

  /** Bloco de informações e botões */
  _buildInfo() {
    const wrapper = new Component(
      "div",
      "flex flex-col space-y-10 w-96 max-w-1/2 text-center md:text-left p-8 md:ml-0"
    );

    // Endereço
    new Component(
      "h2",
      "text-3xl md:text-5xl font-heading barlow-condensed-semibold"
    )
      .setText("Como chegar")
      .render({ target: wrapper.element });

    new Component("p", "text-xl roboto-flex-400")
      .setText(this.opts.address)
      .render({ target: wrapper.element });

    // Botões
    const btnGroup = new Component(
      "div",
      "flex flex-col md:flex-row gap-4 mt-4 text-primary-content"
    ).render({ target: wrapper.element });

    // WhatsApp

    new Component("a")
        .setAttributes({
            target: "_blank",
            href: this.opts.whatsappUrl
        })
        .setContent(whatsappPrimaryContent)
        .render({ target: btnGroup.element });

    // Instagram opcional
    if (this.opts.instagramUrl) {
        new Component("a", "my-auto")
            .setAttributes({
                target: "_blank",
                href: this.opts.instagramUrl
            })
            .setContent(instagramPrimaryContent)
            .render({ target: btnGroup.element });
    }

    // Agendar aula (scroll para #contact)
    const agendarBtn = new ActionButton({
      href: `#${this.opts.scheduleTargetId}`,
      text: "Agendar Aula",
      targetBlank: false,
      extraClasses: "btn-accent shadow-neon-accent",
    });
    agendarBtn.render({ target: btnGroup.element });
    agendarBtn.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .getElementById(this.opts.scheduleTargetId)
        ?.scrollIntoView({ behavior: "smooth" });
    });

    return wrapper;
  }
}
