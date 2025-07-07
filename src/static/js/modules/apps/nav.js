import { AnchorToSection } from "../components/actions.js";
import { hamburger } from "../svg.js";
import { Component } from "../engine/core.js";

export class AppNav extends Component {
  constructor() {
    super("div", "absolute navbar h-24 bg-transparent z-50");
  }
  renderContent() {

    const links = [
      { sectionTargetId: "testimonials-section", text: "Depoimentos" },
      { sectionTargetId: "coaches-section", text: "Equipe" },
      { sectionTargetId: "locationcontact-section", text: "Contato" },
    ];
    const menu = new Component("ul", "menu menu-horizontal px-1 roboto-flex-400 text-sm md:text-lg");
    const menuMobile = new Component("ul", "menu menu-md dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52")
      .setAttribute("tabindex", "0");
    links.forEach((item) => {
      const anchor = new AnchorToSection({ classList: "cursor-pointer"})
            .renderContent(item)
      new Component("li")
        .addComponent(anchor).render({ target: menu.element });
      new Component("li")
        .addComponent(anchor).render({ target: menuMobile.element });
    });


    new Component("div", "navbar-start ml-5 md:ml-0")
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

    new Component("div", "md:navbar-center")
      .addComponent(menu)
      .render({ target: this.element });
    

    new Component("div", "navbar-end md:hidden mr-2 md:mr-0")
      .addComponent(
        new Component("div", "dropdown dropdown-end")
          .addComponents([
            new Component("div", "btn btn-ghost lg:hidden")
              .setAttributes({tabindex: 0, role: "button"})
              .setContent(hamburger),
            menuMobile,
          ])
      )
      .render({ target: this.element });
  }
  init(target) {
    this.renderContent();
    return this.render({ target });
  }
}
