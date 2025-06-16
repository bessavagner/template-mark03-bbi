//@ts-check

import { AppBenefits } from "./modules/apps/benefits.js?version=3";
import { AppHowItWorks } from "./modules/apps/how.js?version=2";
import { TestimonyCarousel } from "./modules/apps/testimony.js?version=2";

document.addEventListener("DOMContentLoaded", () => {
    new AppBenefits("#app-cards-bebfits").init();
    new AppHowItWorks("#app-steps").init();
    new TestimonyCarousel("#app-testimonials").init();
});

