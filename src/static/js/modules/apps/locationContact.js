// static/js/modules/apps/locationContact.js
// @ts-check
import { Component } from "../engine/core.js";
import { Anchor } from "../components/actions.js";
import { instagramPrimaryContent, whatsappPrimaryContent } from "../svg.js";
import { locationContactData } from "./data/locationcontactData.js";

export class GoogleMapsMarker extends Component {
  constructor() {
    super("gmp-advanced-marker");
  }
  renderContent(options = {}) {
    if (options?.position) {
      this.setAttribute("position", options.position);
    }
    if (options?.title) {
      this.setAttribute("title", options.title);
    }
    return this;
  }
}

export class GoogleMapsMap extends Component {
  constructor() {
    super("gmp-map");
  }
  addMarker(options = {}) {
    new GoogleMapsMarker()
      .renderContent(options)
      .render({ target: this.element });
    return this;
  }
  renderContent(options = {}) {
    if (options?.center) {
      this.setAttribute("center", options.center);
    }
    if (options?.zoom) {
      this.setAttribute("zoom", options.zoom);
    }
    if (options?.mapId) {
      this.setAttribute("map-id", options.mapId);
    }
    return this;
  }
}

/**
 * Seção Localização & Contato.
 */
export class AppLocationContact extends Component {
  constructor() {
    super("div", "py-20 w-full");
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
    this.render({ target: target });
    this.renderContent();
  }

  /** Mapa estático clicável */
  _buildMap() {
    const container = new Component(
      "div",
      "w-96 h-96 max-w-1/2 mx-auto md:mr-0"
    );
    new GoogleMapsMap()
      .addMarker({
        position: "-5.177338123321533,-40.67045211791992",
        title: "Localização do Box Base Inicial",
      })
      .renderContent({
        center: "-5.177338123321533,-40.67045211791992",
        zoom: "14",
        mapId: "DEMO_MAP_ID",
      })
      .render({ target: container.element });

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
      .setText(locationContactData.address)
      .render({ target: wrapper.element });

    // Botões
    const btnGroup = new Component(
      "div",
      "flex flex-col md:flex-row gap-4 mt-4 text-primary-content"
    ).render({ target: wrapper.element });

    // WhatsApp
    new Anchor({ href: locationContactData.whatsappUrl })
      .setContent(whatsappPrimaryContent)
      .render({ target: btnGroup.element });

    new Component("a", "my-auto")
      .setAttributes({
        target: "_blank",
        href: locationContactData.instagramUrl,
      })
      .setContent(instagramPrimaryContent)
      .render({ target: btnGroup.element });

    // Agendar aula (scroll para #contact)
    new Anchor({
      targetBlank: false,
      classList:
        "btn btn-accent text-lg px-6 py-3 rounded-full shadow-neon-accent hover:btn-success hover:shadow-neon-success transition-all duration-300 ",
    })
      .renderContent({
        text: "Agendar Aula",
        onClick: (e) => {
          e.preventDefault();
          document
            .getElementById(locationContactData.buttonTargetId)
            ?.scrollIntoView({ behavior: "smooth" });
        },
      })
      .setText("Agendar Aula")
      .render({ target: btnGroup.element });
    return wrapper;
  }
}
