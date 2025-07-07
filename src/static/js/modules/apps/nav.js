import { AnchorToSection } from "../components/actions.js";
import { Component } from "../engine/core.js";

export class AppNav extends Component {
  constructor() {
    super("div", "absolute navbar h-24 bg-transparent z-50");
  }
  renderContent() {
    new Component("div", "navbar-start")
      .addComponents([
        new Component(
          "div",
          "hidden md:block barlow-condensed-light text-3xl ml-5"
        ).setText("Box Base Inicial"),
        new Component(
          "div",
          "flex md:hidden barlow-condensed-light text-2xl"
        ).setText("Base Inicial"),
      ])
      .render({ target: this.element });

    const links = [
      { sectionTargetId: "testimonials-section", text: "Depoimentos" },
      { sectionTargetId: "coaches-section", text: "Equipe" },
      { sectionTargetId: "locationcontact-section", text: "Contato" },
    ];
    const menu = new Component("ul", "menu menu-horizontal px-1 roboto-flex-400 text-lg");
    links.forEach((item) => {
      new Component("li")
        .addComponent(
          new AnchorToSection({ classList: "cursor-pointer"})
            .renderContent(item)
        )
        .render({ target: menu.element });
    });
    new Component("div", "navbar-center")
      .addComponent(menu)
      .render({ target: this.element });

    new Component("div", "navbar-end")
      .render({ target: this.element });
  }
  init(target) {
    this.renderContent();
    return this.render({ target });
  }
}
