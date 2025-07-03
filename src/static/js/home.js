//@ts-check

import { AppHero } from "./modules/apps/hero.js";
import { AppBenefits } from "./modules/apps/benefits.js";
import { AppHowItWorks } from "./modules/apps/how.js";
import { TestimonyCarousel } from "./modules/apps/testimony.js";
import { CoachesSection } from "./modules/apps/coaches.js";
import { AppLocationContact } from "./modules/apps/locationContact.js";
import { ScheduleFormApp } from "./modules/apps/scheduleTrial.js";

document.addEventListener("DOMContentLoaded", () => {
    new AppHero().init("#app-hero", {
        buttonTargetId: "contact"
    });
    new AppBenefits().init("#app-cards-benefits");
    new AppHowItWorks("#app-steps", { scrollTargetId: "contact" }).init();
    new TestimonyCarousel("#app-testimonials").init();
    new CoachesSection("#app-coaches", "/static/videos/video-institucional-1.mp4");
    new AppLocationContact({
        address: "Rua Doutor José Coriolano 571, Centro – Crateús-CE, 63700-040",
        mapsUrl:
        "https://www.google.com.br/maps/place/R.+Dr.+Jos%C3%A9+Coriolano,+571+-+Centro,+Crate%C3%BAs+-+CE,+63700-040/@-5.1774075,-40.6730389,17z",
        whatsappUrl: "https://api.whatsapp.com/send?phone=5588994413562&text=",
        instagramUrl: "https://www.instagram.com/boxbaseinicial",
        // Imagem gerada pela Google Static Maps API (560×400, zoom 17) — troque YOUR_API_KEY:
        staticMapUrl:
        "https://maps.googleapis.com/maps/api/staticmap?center=-5.1774128,-40.670464&zoom=17&size=560x400&scale=2&maptype=roadmap&markers=color:blue%7C-5.1774128,-40.670464&key=AIzaSyBOMv2oLa_XlmlRL1owPqyhjcEygqXuX_E",
        scheduleTargetId: "contact",
    }).init(document.getElementById("app-location-contact"));
    new ScheduleFormApp().init("#app-contact");
});

