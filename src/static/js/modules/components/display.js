//@ts-check

import { Component } from "../engine/core.js";

/**
 * Bullet component for displaying a small colored dot.
 * extends the base Component class.
 * @extends Component
 */
export class Bullet extends Component {
  constructor() {
    super("span", "h-2 w-2 bg-primary rounded-full mt-1 mr-3 flex-shrink-0");
  }
}

/**
 * BulletItem component for displaying a bullet point with text.
 * extends the base Component class.
 * @extends Component
 */
export class BulletItem extends Component {
  /**
   * @param {string} text
   */
  constructor(text) {
    super("li", "flex flex-row items-center");
    this.bullet = new Bullet().render({ target: this.element });
    this.text = new Component("span").render({ target: this.element });
    this.text.setText(text);
  }
}

/**
 * BulletList component for managing a list of BulletItem components.
 * extends the base Component class.
 * @extends Component
 */
export class BulletList extends Component {
  constructor() {
    super("ul");
    this.items = [];
  }
  /**
   * Adds a bullet item to the list.
   * @param {string} text - The text for the bullet item.
   * @returns {BulletList} - Returns the BulletList instance for chaining.
   */
  addItem(text) {
    const item = new BulletItem(text);
    this.items.push(item);
    item.render({ target: this.element });
    return this;
  }
  /**
   * Adds multiple bullet items to the list.
   * @param {string[]} items - An array of strings to be added as bullet items.
   * @returns {BulletList} - Returns the BulletList instance for chaining.
   */
  addItems(items) {
    items.forEach((item) => this.addItem(item));
    return this;
  }
  /**
   * Changes the bullet color for all items in the list.
   * @param {string} color - The new color for the bullets, should be a Tailwind CSS class (e.g., "bg-red-500").
   */
  changeBulletsColor(color) {
    if (!color.startsWith("bg-")) {
      color = `bg-${color}`;
    }
    for (const item of this.items) {
        item.bullet.setClassList(`h-2 w-2 ${color} rounded-full mt-1 mr-3 flex-shrink-0`)
    }
  }
}

/*
 * Card component for displaying content with a title and body.
 * extends the base Component class.
 * @extends Component
 */
export class Card extends Component {
  constructor() {
    super("div", "card");
    this.cardBody = new Component("div", "card-body");
    this.cardTitle = new Component("h2", "card-title");
  }
  renderBody() {
    this.cardBody.render({ target: this.element });
    return this;
  }
  /**
   * Renders the card with a title.
   * @param {string} title - The title to be displayed on the card.
   */
  renderTitle(title) {
    this.cardTitle.setText(title);
    this.cardTitle.render({ target: this.cardBody.element });
    return this;
  }
}


/**
 * CardList component for managing a list of Card components.
 * extends the base Component class.
 * @extends Component
 */
export class CardList extends Component {
  /**
   * Initializes the CardList component.
   * @param {string} classList - The CSS class list for the card list container.
   */
  constructor(classList) {
    super("div", classList);
    this.cards = [];
  }
  /**
   *  Adds a card to the card list.
   * @param {Card} card - The card instance to be added.
   * @returns {CardList} - Returns the CardList instance for chaining.
   */
  addCard(card) {
    this.cards.push(card);
    card.render({ target: this.element });
    return this;
  }
}
