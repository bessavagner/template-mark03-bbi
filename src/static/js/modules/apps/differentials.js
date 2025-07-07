// static/js/modules/apps/differentials.js
// @ts-check
import { Component } from "../engine/core.js";
import { Button } from "../components/actions.js";

const DIFFERENTIALS = [
  {
    title: "FOCO NA BASE",
    desc: "Ajustes técnicos do zero",
  },
  {
    title: "APRENDIZADO CONTÍNUO",
    desc: "Coaches dedicadas e experientes",
  },
  {
    title: "RESULTADOS RÁPIDOS",
    desc: "Evolução já na 1ª semana",
  },
];

export class AppDifferentials extends Component {
  constructor() {
    super(
      "section",
      "h-full bg-primary text-primary-content flex flex-col items-center " +
        "justify-center py-8 md:py-12 px-6 space-y-10"
    );
  }

  _buildList() {
    const ul = new Component(
      "ul",
      "flex flex-col md:flex-row justify-around md:justify-center items-center gap-6 md:gap-8"
    );

    DIFFERENTIALS.forEach(({ title, desc }, idx) => {
      const li = new Component(
        "li",
        "relative flex flex-col items-center text-center w-96 px-4 " +
          "md:border-r md:border-white/40 md:last:border-none " +
          "md:basis-1/3"
      );

      new Component(
        "span",
        "font-heading barlow-condensed-bold text-2xl md:text-4xl leading-tight"
      )
        .setText(title)
        .render({ target: li.element });

      new Component("span", "text-md opacity-80 mt-1")
        .setText(desc)
        .render({ target: li.element });

      li.render({ target: ul.element });
      if (idx < DIFFERENTIALS.length - 1) {
        ul.addComponent(
          new Component("div", "h-[1px] w-48 bg-accent mt-4 rounded-full md:hidden my-0")
        )
      }
    });
    return ul;
  }

  renderContent() {
    this._buildList().render({ target: this.element });
    // this._buildCTA().render({ target: this.element });
  }

  init(target) {
    this.render({ target });
    this.renderContent();
  }

  _buildCTA() {
    return new Button({
      classList:
        "btn btn-accent hover:btn-success text-accent-content " +
        "font-semibold px-8 py-4 rounded-lg shadow-neon-accent " +
        "hover:shadow-neon-success transition mt-10",
    }).renderContent({
      text: "Agende seu treino grátis",
      onClick: (e) => {
        e.preventDefault();
        document
          .getElementById("contact")
          ?.scrollIntoView({ behavior: "smooth" });
      },
    });
  }
}
