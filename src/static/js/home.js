//@ts-check

import { AppBenefits } from "./modules/apps/benefits.js?version=1";

document.addEventListener("DOMContentLoaded", () => {
    const app = new AppBenefits("#app-cards-bebfits");
    app.init();
});

