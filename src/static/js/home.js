//@ts-check

import { AppHero } from "./modules/apps/hero.js";
import { AppBenefits } from "./modules/apps/benefits.js";
import { AppHowItWorks } from "./modules/apps/how.js";
import { TestimonyCarousel } from "./modules/apps/testimony.js";
import { CoachesSection } from "./modules/apps/coaches.js";
import { AppLocationContact } from "./modules/apps/locationContact.js";
import { ScheduleFormApp } from "./modules/apps/scheduleTrial.js";

document.addEventListener("DOMContentLoaded", () => {
    new AppHero().init("#app-hero", { buttonTargetId: "contact" });
    new AppBenefits().init("#app-cards-benefits");
    new AppHowItWorks({ scrollTargetId: "contact" }).init("#app-steps");
    new TestimonyCarousel("#app-testimonials").init();
    new CoachesSection("#app-coaches", "/static/videos/video-institucional-1.mp4");
    new AppLocationContact().init("#app-location-contact");
    new ScheduleFormApp().init("#app-contact");
});

