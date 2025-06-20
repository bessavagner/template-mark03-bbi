//@ts-check

import { AppBenefits } from "./modules/apps/benefits.js";
import { AppHowItWorks } from "./modules/apps/how.js";
import { TestimonyCarousel } from "./modules/apps/testimony.js";
import { CoachesSection } from "./modules/apps/coaches.js";
import { ScheduleFormApp } from "./modules/apps/scheduleTrial.js";


document.addEventListener("DOMContentLoaded", () => {
    new AppBenefits().init("#app-cards-benefits");
    new AppHowItWorks("#app-steps").init();
    new TestimonyCarousel("#app-testimonials").init();
    new CoachesSection("#app-coaches", "/static/videos/video-institucional-1.mp4");
    new ScheduleFormApp().init("#app-contact");
});

