// @ts-check
import { Component } from "../engine/core.js";
import { Card } from "../components/display.js";
import { coachesData } from "./data/coachesData.js";

export class CoachCard extends Card {
  constructor() {
    super("card w-72 bg-base-300 rounded-lg shadow-md " +
      "transition-transform duration-300 hover:shadow-neon hover:scale-110"
    );
    this.body.addClassList("card-body flex flex-col items-center text-center p-6 space-y-4");
  }
  renderContent(options = {}) {
    const { name = "", title = "", image = "", credentials = [] } = options;
    this.setState({ name, title, image, credentials });

    const bodyContent = this._buildBodyContent({
      name, title, image, credentials
    });

    return super.renderContent({ body: bodyContent });
  }
  _buildBodyContent({ name, title, image, credentials }) {
    // avatar
    const avatarWrapper = new Component("div",
      "w-32 h-32 rounded-full overflow-hidden ring-2 ring-primary " +
      "ring-offset-base-100 shadow-neon"
    ).append(
      new Component("img")
        .setAttributes({
          src: image,
          alt: `Foto de ${name}`,
          class: "w-full h-full object-cover"
        }).element
    );

    // nome
    const nameComponent = new Component("h3",
      "text-xl font-heading barlow-condensed-semibold text-primary"
    )
      .setText(name);

    // cargo
    const titleComponent = new Component("span", "text-sm opacity-70")
      .setText(title);

    const content = [avatarWrapper, nameComponent, titleComponent];

    // credenciais
    if (credentials && credentials.length) {
      const ul = new Component("ul", "mt-2 text-xs list-disc list-inside space-y-1").render({ target: this.body.element });
      credentials.forEach(cred =>
        new Component("li").setText(cred).render({ target: ul.element })
      );
      content.push(ul);
    }
    return content; 
  }

}
/**
 * Card individual de coach: foto, nome, cargo e credenciais.
 */
export class CoachCard2 extends Component {
  /**
   * @param {{name:string, title:string, image:string, credentials:string[]}} opts
   */
  constructor({ name, title, image, credentials }) {
    super("div",
      "card w-72 bg-base-300 rounded-lg shadow-md " +
      "transition-transform duration-300 hover:shadow-neon hover:scale-110"
    );

    // body do card
    const body = new Component("div",
      "card-body flex flex-col items-center text-center p-6 space-y-4"
    ).render({ target: this.element });

    // avatar
    const avatarWrapper = new Component("div",
      "w-32 h-32 rounded-full overflow-hidden ring-2 ring-primary " +
      "ring-offset-base-100 shadow-neon"
    ).render({ target: body.element });

    new Component("img")
      .setAttributes({
        src: image,
        alt: `Foto de ${name}`,
        class: "w-full h-full object-cover"
      })
      .render({ target: avatarWrapper.element });

    // nome
    new Component("h3",
      "text-xl font-heading barlow-condensed-semibold text-primary"
    )
      .setText(name)
      .render({ target: body.element });

    // cargo
    new Component("span", "text-sm opacity-70")
      .setText(title)
      .render({ target: body.element });

    // credenciais
    if (credentials && credentials.length) {
      const ul = new Component("ul", "mt-2 text-xs list-disc list-inside space-y-1").render({ target: body.element });
      credentials.forEach(cred =>
        new Component("li").setText(cred).render({ target: ul.element })
      );
    }
  }
}
/**
 * Seção inteira “Equipe de Coaches”:
 * • Vídeo à esquerda
 * • Dois CoachCards à direita
 */
export class CoachesSection extends Component {
  /**
   * @param {string|HTMLElement|Component|Node} target  — seletor ou elemento onde injetar a seção
   * @param {string} videoSrc                         — URL do vídeo institucional
   */
  constructor(target, videoSrc) {
    super("section",
      "py-16 bg-base-100 text-base-content"
    );
    this.setId("team-coaches").render({ target });

    // container 2-colunas
    const grid = new Component("div",
      "container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
    ).render({ target: this.element });

    // ► vídeo à esquerda
    new Component("div", "video-wrapper shadow-neon").render({ target: grid.element });
    new Component("video")
      .setAttributes({
        src: videoSrc,
        controls: "",
        autoplay: "",
        muted: "",
        loop: "",
        class: "w-full h-auto rounded-lg shadow-lg"
      })
      .render({ target: grid.element.querySelector(".video-wrapper") });

    // ► cards à direita
    const cardsWrapper = new Component("div",
      "flex flex-row justify-around my-auto"
    ).render({ target: grid.element });

    coachesData.forEach(coach =>
      new CoachCard().renderContent(coach).render({ target: cardsWrapper.element })
    );
  }
}
