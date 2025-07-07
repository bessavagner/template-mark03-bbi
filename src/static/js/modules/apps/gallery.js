import { Component } from "../engine/core.js";
import { Anchor } from "../components/actions.js";

/* Slide individual */
class GallerySlide extends Component {
  constructor() {
    super(
      "div",
      "absolute inset-0 w-full h-full flex items-center justify-center " +
        "mx-auto transition-all duration-700 ease-in-out transform-gpu opacity-0 scale-90 z-0"
    );
  }

  renderContent({ src = "", alt = "" }) {
    this.setContent("");
    new Component(
      "img",
      "max-h-[600px] object-contain rounded-xl shadow-lg mx-auto"
    )
      .setAttributes({ src, alt })
      .render({ target: this.element });
    return this;
  }

  setActive(isActive) {
    if (isActive) {
      this.addClassList("opacity-100 scale-100 z-20");
      this.removeClassList(["opacity-0", "scale-90", "z-0"]);
    } else {
      this.addClassList("opacity-0 scale-90 z-0");
      this.removeClassList(["opacity-100", "scale-100", "z-20"]);
    }
  }
}

/* Carrossel */
export class GalleryCarousel extends Component {
  constructor({ images = [], interval = 7000 }) {
    super("div", "relative w-full h-[400px] md:h-[600px] overflow-hidden");

    this.slides = images.map((data) => new GallerySlide().renderContent(data));
    this.currentIndex = 0;
    this.interval = interval;
    this.timer = null;

    this.btnPrev = this._buildNavButton(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
  <path d="M15.75 19.5L8.25 12l7.5-7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>
`,
      () => this.prev()
    );
    this.btnNext = this._buildNavButton(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
  <path d="M8.25 4.5L15.75 12l-7.5 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>
`,
      () => this.next()
    );
  }

  _buildNavButton(label, onClick) {
    return new Component(
      "button",
      "btn btn-base-300 md:btn-neutral w-16 h-16 rounded-full absolute bottom-0 md:top-1/2 md:-translate-y-1/2 text-3xl px-4 py-2 text-base-content cursor-pointer " +
        "hover:text-neutral md:hover:text-base-300 transition rounded-full shadow-md z-30"
    )
      .setContent(label)
      .addEventListener("click", (e) => {
        e.preventDefault();
        onClick();
      });
  }

  renderContent() {
    this.setContent("");

    this.slides.forEach((slide) => this.append(slide));
    this.append(this.btnPrev.setStyle({ left: "1rem" }));
    this.append(this.btnNext.setStyle({ right: "1rem" }));

    this.updateVisuals();
    return this;
  }

  updateVisuals() {
    this.slides.forEach((slide, idx) =>
      slide.setActive(idx === this.currentIndex)
    );
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateVisuals();
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateVisuals();
  }

  init(target) {
    this.renderContent();
    this.render({ target });
    this.timer = setInterval(() => this.next(), this.interval);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  beforeUnmount() {
    this.stop();
  }
}

export class AppGallery extends Component {
  constructor() {
    super("section", "flex flex-col items-center justify-center w-full");
  }

  /**
   * @param {HTMLElement|string|Component} target
   * @param {{ images?: Array<{ src: string, alt: string }> }} [opts]
   */
  init(target, opts = {}) {
    this.render({ target });

    const { images = [] } = opts;

    this.addComponent(
      new Component(
        "h2",
        "barlow-condensed-bold text-2xl md:text-3xl text-center text-primary mb-8"
      ).setText("Conheça nosso Box")
    );

    const carousel = new GalleryCarousel({ images });
    carousel.init(this.element);

    this.addComponent(
      new Component(
        "p",
        "text-md md:text-lg opacity-80 mt-16 mb-8 text-center max-w-xl"
      ).setText("Veja mais fotos e bastidores no nosso Instagram!")
    );

    this.addComponent(
      new Anchor({
        href: "https://instagram.com/boxbaseinicial",
        targetBlank: true,
        classList:
          "btn btn-accent w-64 text-lg px-6 py-3 mt-8 md:mt-0 rounded-full shadow-neon-accent hover:btn-success hover:shadow-neon-success",
      }).renderContent({ text: "Seguir no Instagram" })
    );
  }
}
