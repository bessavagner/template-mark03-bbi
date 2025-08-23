//@ts-check

import { AppNav } from "./modules/apps/nav.js";
import { AppFooter } from "./modules/apps/footer.js";
import { Button } from "./modules/components/actions.js";
import { Component } from "./modules/engine/core.js"
import { Card } from "./modules/components/display.js"

document.addEventListener("DOMContentLoaded", () => {
  new AppNav().init("#app-navbar");
  new AppFooter().init("#app-footer");
  const ctaButton = new Button({
    classList: "btn btn-primary btn-lg mt-4 mx-auto px-8 py-4 rounded-full bebas-neue-regular text-xl shadow-neon",
  }).renderContent({
    text: "Marque seu treino experimental",
    onClick: () => {
      const baseUrl = window.location.origin;
      const formSectionId = "contact-section";
      const url = `${baseUrl}#${formSectionId}`;
      window.location.href = url;
    },
  });
  ctaButton.render({ target: document.querySelector("#institucional-cta") });
});