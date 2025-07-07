// @ts-check
import { Component } from "../engine/core.js";
import { ScheduleForm } from "./scheduleTrial.js";

/** Botão-link que abre o modal de agendamento */
export class ContactLink extends Component {
  constructor() {
    super(
      "a",
      "btn btn-primary btn-lg mt-4 px-8 py-4 rounded-full " +
        "bebas-neue-regular text-xl shadow-neon"
    );
    this.setText("Marque seu treino experimental");
  }
  init(targetId = "contact") {
    this.addEventListener("click", (e) => {
      e.preventDefault(); // previne o comportamento padrão do <a>

      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      } else {
        console.warn("#contact não encontrado para scroll.");
      }
    });
  }
}

/** Section hero ⇒ gera o conteúdo dentro de <div id="app-hero"> */
export class AppHero extends Component {
  constructor() {
    super(
      "div",
      "hero-content w-10/12 md:w-full max-w-full relative text-center " +
        "mt-20 mx-auto px-4 sm:px-6 lg:px-8 z-10"
    );
  }

  /** Monta o DOM interno */
  renderContent(options = {}) {
    const buttonTargetId = options.buttonTargetId || "contact";
    // garante conteúdo limpo em re-renders
    this.setContent("");

    this.addComponent(this._buildLeftPlaceholder());
    this.addComponent(this._buildContent(buttonTargetId));

    return this;
  }

  /**
   * Inicializa o componente
   * @param {string|HTMLElement|Component|Node} target – seletor/elemento onde renderizar
   */
  init(target, options = {}) {
    const buttonTargetId = options.buttonTargetId || "contact";
    this.render({
      target: target,
      method: "before",
      reference: document.getElementById("hero-bg"),
    });
    this.renderContent(buttonTargetId);
    return this;
  }
  /** Construção da coluna vazia usada só para alinhamento à direita */
  _buildLeftPlaceholder() {
    return new Component("div", "hidden md:flex w-1/2");
  }

/** Coluna com título, parágrafo e CTA */
_buildContent(buttonTargetId = "contact") {
  const wrapper = new Component(
    "div",
    "w-full md:w-1/2 max-w-2xl mx-auto space-y-6"
  );

  // Título animado
  new Component(
    "h1",
    "text-4xl sm:text-5xl md:text-6xl barlow-condensed-semibold leading-tight opacity-0 animate-fade-in-up"
  )
    .setContent('O seu box de <span class="text-primary">Cross Training</span> em Crateús')
    .render({ target: wrapper.element });

  // Subtítulo animado
  const cta = new Component(
    "p",
    "text-lg sm:text-xl md:text-2xl barlow-condensed-semibold mb-10 opacity-0 animate-slide-up delay-[150ms]"
  ).setText("AGENDE AGORA SEU TREINO EXPERIMENTAL!");
  
  const form = new ScheduleForm();
  cta.render({ target: form.element });

  // Form animado
  form.renderContent();
  form.removeClass("bg-base-300");
  form.addClassList("bg-base-300/85 mb-10 opacity-0 animate-grow-in delay-[300ms]");
  form.fields["submitButton"].addClassList("mt-10");
  form.fields["submitButton"].removeClass("self-end");

  form.render({ target: wrapper.element });

  return wrapper;
}

}
