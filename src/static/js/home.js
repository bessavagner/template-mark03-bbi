//@ts-check

import { AppHero } from "./modules/apps/hero.js";
import { AppDifferentials } from "./modules/apps/differentials.js";
import { AppTestimony } from "./modules/apps/testimony.js";
import { AppStaff } from "./modules/apps/coaches.js";
import { AppLocationContact } from "./modules/apps/locationContact.js";
import { ScheduleFormApp } from "./modules/apps/scheduleTrial.js";
import { AppFooter } from "./modules/apps/footer.js";
import { AppNav } from "./modules/apps/nav.js";

document.addEventListener("DOMContentLoaded", () => {
    new AppNav().init("#app-navbar");
    new AppHero().init("#app-hero", { buttonTargetId: "contact" });
    new AppDifferentials().init("#app-differentials");
    new AppTestimony().init("#app-testimonials");
    new AppStaff().init("#app-coaches");
    new AppLocationContact().init("#app-location-contact");
    new ScheduleFormApp().init("#app-contact");
    new AppFooter().init("#app-footer");
});
