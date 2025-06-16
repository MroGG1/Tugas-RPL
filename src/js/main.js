import { smoothScrolling } from "./smoothScroll.js";
import { headerEffect } from "./headerEffect.js";
import { scrollAnimation } from "./scrollAnimation.js";
import { hamburgerMenu } from "./hamburger.js";
import { formValidation } from "./formValidation.js";

document.addEventListener("DOMContentLoaded", () => {
  smoothScrolling();
  headerEffect();
  scrollAnimation();
  hamburgerMenu();
  formValidation();
});
