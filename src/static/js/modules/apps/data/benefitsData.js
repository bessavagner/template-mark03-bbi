import { dumbell, coaches, plot } from "../../svg.js"

export const cardsData = [
    {
        title: "Treinos intensos e variados",
        descriptions: [
            "Variações de movimentos",
            "Intensidade elevada",
            "Desafios renovados",
        ],
        svg: dumbell
    },
    {
        title: "Acompanhamento profissional",
        descriptions: [
            "Orientação personalizada",
            "Treinadores qualificados",
            "Suporte ininterrupto",
        ],
        svg: coaches,
        eventListeners: {
            click: (e) => {
                e.preventDefault();
                const coachesSection = document.getElementById("coaches");
                if (coachesSection) {
                    coachesSection.scrollIntoView({ behavior: "smooth" });
                } else {
                    console.warn("#coaches não encontrado para scroll.");
                }
            }
        },
        styles: {
            cursor: "pointer",
        }
    },
    {
        title: "Resultados rápidos e visíveis",
        descriptions: [
            "Motivação que impulsiona",
            "Evolução constante",
            "Metas alcançadas",
        ],
        svg: plot
    }
]