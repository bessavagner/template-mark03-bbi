// static/js/modules/apps/howSteps.js
// @ts-check
import { Component } from "../engine/core.js";
import { Button } from "../components/actions.js";

const steps = [
  {
    num: "➊",
    title: "Agende seu treino",
    desc: "Preencha o formulário com seus dados e disponibilidade.",
    icon: "📅", // substituível por SVG
  },
  {
    num: "➋",
    title: "Aguarde nossa confirmação",
    desc: "Você receberá um contato para confirmar o agendamento.",
    icon: "📲",
  },
  {
    num: "➌",
    title: "Venha pro box",
    desc: "No dia e horário combinados, sua experiência começa!",
    icon: "🏋️",
  },
];

export class AppHowSteps extends Component {
  constructor() {
    super("section", "bg-base-100 text-base-content py-16");
  }

  renderContent() {
    const wrapper = new Component(
      "div",
      "container w-10/12 md:w-1/2 mx-auto px-6"
    );

    new Component("h2", "text-center text-3xl md:text-4xl font-heading barlow-condensed-semibold")
      .setText("3 passos")
      .render({ target: wrapper.element });

    const stepsWrapper = new Component("ul", "timeline items-start timeline-vertical")
      .render({ target: wrapper.element });

    steps.forEach(({ num, title, desc, icon }) => {
      new Component("div", "flex flex-row justify-start items-start gap-4")
        .setContent(`
          <div class="timeline-middle text-3xl font-bold text-primary">${num}</div>
          <div class="timeline-end timeline-box">
            <h3 class="text-xl font-semibold">${title}</h3>
            <p class="text-sm opacity-80 mt-1">${desc}</p>
          </div>
          <hr />
        `)
        .render({ target: stepsWrapper.element });
    });

    new Button({
      classList:
        "btn btn-primary text-lg px-6 py-3 mt-6 mx-auto block shadow-neon hover:btn-success hover:shadow-neon-success",
    })
      .renderContent({
        text: "Agendar treino gratuito",
        onClick: () => {
          document.getElementById("contact")
            ?.scrollIntoView({ behavior: "smooth" });
        }
      })
      .render({ target: wrapper.element });

    wrapper.render({ target: this.element });
  }

  init(target) {
    this.render({ target });
    this.renderContent();
  }
}
