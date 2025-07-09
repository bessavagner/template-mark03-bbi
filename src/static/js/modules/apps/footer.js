//@ts-check

import { AnchorToSection } from "../components/actions.js";
import { Component } from "../engine/core.js";


export class AppFooter extends Component {
    constructor() {
        super("footer", "bg-base-100 border-t py-6");
        this.container = new Component(
            "div",
            "container mx-auto px-4 flex flex-col md:flex-row items-center justify-between"
        );
        this.year = new Date().getFullYear();
    }
    renderContent() {
        this.container.render({ target: this.element });

        new Component("p", "text-sm text-gray-500")
            .setText(`© ${this.year} Box Base Inicial. Todos os direitos reservados.`)
            .render({ target: this.container.element });

        const links = [
            { sectionTargetId: "testimonials-section", text: "Depoimentos"},
            { sectionTargetId: "coaches-section", text: "Equipe"},
            { sectionTargetId: "locationcontact-section", text: "Contato"},
            { sectionTargetId: "gallery-section", text: "Galeria" },
        ];

        const menu = new Component("ul", "flex space-x-4");
        links.forEach((item) => {
            new AnchorToSection({})
            .renderContent(item)
            .setStyle({
                cursor: "pointer",
            })
            .render({ target: menu.element });
        });

        menu.render({ target: this.container.element });
    }
    init(target) {
        this.renderContent();
        return this.render({ target });
    }
}