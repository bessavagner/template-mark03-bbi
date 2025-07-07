//@ts-check

import { AppHero } from "./modules/apps/hero.js";
import { AppDifferentials } from "./modules/apps/differentials.js";
import { AppTestimony } from "./modules/apps/testimony.js";
import { AppGallery } from "./modules/apps/gallery.js";
import { AppStaff } from "./modules/apps/coaches.js";
import { AppLocationContact } from "./modules/apps/locationContact.js";
import { ScheduleFormApp } from "./modules/apps/scheduleTrial.js";
import { AppFooter } from "./modules/apps/footer.js";
import { AppNav } from "./modules/apps/nav.js";

import { AnchorToSection } from "./modules/components/actions.js";
import { calendarSmall } from "./modules/svg.js";
import { LazyMount } from "./modules/utils/lazyMount.js";
import { Component } from "./modules/engine/core.js";

const galleryImages = [
  { src: "/static/images/gallery/box-01.png", alt: "Rig principal e anilhas" },
  { src: "/static/images/gallery/box-02.png", alt: "Área de levantamento com plataformas" },
  { src: "/static/images/gallery/box-03.png", alt: "Paredão de wall-balls" },
  { src: "/static/images/gallery/box-04.png", alt: "Atletas durante WOD em equipe" },
];

document.addEventListener("DOMContentLoaded", () => {
  new AppNav().init("#app-navbar");
  new AppHero().init("#app-hero", { buttonTargetId: "contact" });
  new AppDifferentials().init("#app-differentials");
  const appTestimony = new AppTestimony();
  LazyMount.observe("testimonials-section", () => {
      appTestimony.init("#app-testimonials");
  })
  LazyMount.observe("gallery-section", () => {
    new AppGallery().init("#app-galery", { images: galleryImages });
  });
  LazyMount.observe("location-contact-section", () => {
    new AppLocationContact().init("#app-location-contact");
  });
  LazyMount.observe("coaches-section", () => {
    new AppStaff().init("#app-coaches");
  });
  new ScheduleFormApp().init("#app-contact");
  new AppFooter().init("#app-footer");

  new Component("div", "md:hidden avatar indicator fixed bottom-16 right-6 z-50").addComponents([
    new Component("span", "indicator-item indicator-start badge badge-neutral opacity-70").setText(
      "Agendar"
    ),
    new AnchorToSection({
      classList:
        "w-14 h-14 rounded-full bg-accent shadow-neon-accent text-accent-content transition-shadow duration-300 animate-pulse",
    }).renderContent({sectionTargetId: "contact"}).setContent(calendarSmall),
  ]).render({ target: document.body});
});
