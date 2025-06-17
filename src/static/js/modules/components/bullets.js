//@ts-check
import { Component } from "../engine/core.js";
import { normalizeClass } from "../utils.js";
/* ------------------------------------------------------------------
   BULLET
-------------------------------------------------------------------*/

/**
 * Pequeno marcador colorido. Semântica “pura apresentação”.
 */
export class Bullet extends Component {
  /**
   * @param {string} [color="primary"] cor Tailwind (sem o "bg-")
   * @param {number} [size=2] tamanho em Tailwind (unidades h-&-w)
   */
  constructor(color = "primary", size = 2) {
    super("span");
    this.update(color, size);
  }

  /**
   * Permite mudar cor/tamanho dinamicamente.
   * @param {string} color
   * @param {number} size
   */
  update(color, size) {
    this.setClassList(
      `inline-block flex-shrink-0 rounded-full mt-1 mr-3 h-${size} w-${size} bg-${color}`
    );
  }
}

/* ------------------------------------------------------------------
   BULLET ITEM  (bullet + texto)
-------------------------------------------------------------------*/

export class BulletItem extends Component {
  /**
   * @param {string} text
   * @param {Partial<{color:string,size:number}>} [opts]
   */
  constructor(text, opts = {}) {
    super("li", "flex items-center gap-2");
    const { color = "primary", size = 2 } = opts;
    new Bullet(color, size).render({ target: this.element });
    new Component("span").setText(text).render({ target: this.element });
  }
}


/**
 * @extends Component
 */
export class BulletList extends Component {
  /**
   * @param {Partial<{color:string,size:number,classList:string|string[]}>} [opts]
   */
  constructor(opts = {}) {
    super("ul", normalizeClass(opts.classList ?? "space-y-1"));
    this._items = [];
    this.bulletColor = opts.color ?? "primary";
    this.bulletSize = opts.size ?? 2;
  }

  addItem(text) {
    const item = new BulletItem(text, {
      color: this.bulletColor,
      size: this.bulletSize,
    }).render({ target: this.element });
    this._items.push(item);
    return this;
  }

  addItems(texts) {
    texts.forEach((t) => this.addItem(t));
    return this;
  }

  clear() {
    this.element.innerHTML = "";
    this._items = [];
    return this;
  }

  /**
   * Atualiza a cor dos bullets já criados e os próximos.
   */
  setBulletColor(color) {
    this.bulletColor = color;
    this._items.forEach((it) => it.element.firstChild?.classList.replace(
      /bg-[\w-]+/, `bg-${color}`
    ));
    return this;
  }
}


