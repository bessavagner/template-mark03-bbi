// /js/modules/how.js
//@ts-check
import { Component } from "../engine/core.js";
import { BulletList } from "../components/display.js";
import { stepsData } from "./howData.js";

/* ───────── CircleOverLight ─ circle icon ────────────────────── */
class CircleOverLight extends Component {
  constructor(svg) {
    super("div",
      "bg-base-300 w-30 h-30 md:w-40 md:h-40 rounded-full " +
      "flex items-center justify-center text-primary shadow-neon");
    this.setContent(svg);
  }
}

/* ───────── StepItem ─ one step block ─────────────────── */
class StepItem extends Component {
  constructor({ title = "", bullets = [], svg = "" }) {
    super("div", "flex flex-col items-center md:w-1/3");
    // ball
    this.head = new Component("div", "mb-8");
    this.body = new Component("div", "flex flex-col items-center mt-8");
    this.circle = new CircleOverLight(svg).render({ target: this.head.element })
    // title
    this.title = new Component("h3", "font-heading barlow-condensed-semibold text-3xl text-center mt-4")
      .setText(title)
      .render({ target: this.body.element });
    // bullet list
    this.list = new BulletList();
    this.list.addItems(bullets);
    this.list.setClassList("space-y-2 text-xl roboto-flex-100 text-center mt-10");
    this.list.render({ target: this.body.element });

    this.head.render({ target: this.element });
    this.body.render({ target: this.element });
  }
}

/* ───────── Timeline root ─────────────────────────────── */
export class AppHowItWorks extends Component {
  constructor(target) {
    super("div", "relative mt-16");
    this.render({ target });
    // horizontal line – desktop only
    new Component("div",
      "hidden md:block absolute top-1/2 left-8 right-8 h-[2px] bg-primary opacity-50")
      .render({ target: this.element });
    // wrapper flex
    this.stepsWrapper = new Component(
      "div",
      "flex flex-col md:flex-row items-center " +
      "justify-between space-y-12 md:space-y-0 md:space-x-4",
    ).render({ target: this.element });
  }
  init() {
    stepsData.forEach(step => {
      new StepItem(step).render({ target: this.stepsWrapper.element });
    });
  }
}
