//@ts-check

import { Component } from "../engine/core.js";
import { Card, BulletList, CardList } from "../components/display.js";
import { cardsData } from "./benefitsData.js?version=2";

export class BenefitsCard extends Card {
    constructor(options = {}) {
        const {title = "", descriptions = [], svg = ""} = options;
        super();
        this.setClassList("card w-96 md:h-[500px] bg-base-300 rounded-lg transition-all duration-300 hover:shadow-neon hover:scale-105");
        this.cardBody.setClassList("card-body max-w-full justify-center m-auto");
        this.cardTitle.setClassList("mt-4 text-center text-xl md:text-4xl font-heading barlow-condensed-regular px-2");

        this.svgWrapper = new Component("div", "flex flex-col items-center mb-4").setContent(svg).render({target: this.cardBody.element});
        this.renderTitle(title);
        this.descriptionsItems = new BulletList().render({target: this.cardBody.element});
        this.descriptionsItems.setClassList("space-y-2 text-lg md:text-xl mt-10 roboto-flex-400");
        for (const description of descriptions) {
            this.descriptionsItems.addItem(description);
        }
    }
}

export class AppBenefits extends Component {
    /**
     * Initializes the AppBenefits component.
     * @param {string|HTMLElement|Component|Node} target - The target to resolve and where the component will be rendered to.
     */
    constructor(target) {
        super("div", "mx-auto mt-20");
        this.render({target: target});
        const classList = "grid grid-cols-1 md:grid-cols-3 justify-items-center gap-4 mt-10 w-11/12 mx-auto";
        this.cardsWrapper = new CardList(classList).render({target: this.element});
    }
    init() {
        for (const cardData of cardsData) {
            const card = new BenefitsCard(cardData).renderBody();
            this.cardsWrapper.addCard(card);
        }
        return this;
    }
}