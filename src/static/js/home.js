//@ts-check

import { AppHero } from "./modules/apps/hero.js";
import { AppDifferentials } from "./modules/apps/differentials.js";
import { AppTestimony } from "./modules/apps/testimony.js";
import { AppStaff } from "./modules/apps/coaches.js";
import { AppLocationContact } from "./modules/apps/locationContact.js";
import { ScheduleFormApp } from "./modules/apps/scheduleTrial.js";

document.addEventListener("DOMContentLoaded", () => {
    new AppHero().init("#app-hero", { buttonTargetId: "contact" });
    new AppDifferentials().init("#app-differentials");
    new AppTestimony().init("#app-testimonials");
    new AppStaff().init("#app-coaches");
    new AppLocationContact().init("#app-location-contact");
    new ScheduleFormApp().init("#app-contact");
});
