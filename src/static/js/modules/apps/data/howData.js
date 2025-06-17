// /js/modules/howData.js
import { calendar, coach, custom } from "../../svg.js";

export const stepsData = [
  {
    title: "Agende seu treino experimental",
    bullets: [
      "Escolha dia e hora mais convenientes",
      "Preencha um curto formulário",
      "Veja a confirmação imediata",
    ],
    svg: calendar,
  },
  {
    title: "Experiência guiada",
    bullets: [
      "Instruções claras e adaptadas",
      "Feedback em tempo real",
      "Ajustes personalizados",
    ],
    svg: coach,
  },
  {
    title: "Plano personalizado",
    bullets: [
        "Você define os dias e horários de treino",
        "Treino ajustado ao seu ritmo",
        "Suporte contínuo"
    ],
    svg: custom,
  },
];
