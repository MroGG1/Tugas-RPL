// Import semua file CSS
import "./src/style/base.css";
import "./src/style/buttons.css";
import "./src/style/footer.css";
import "./src/style/header.css";
import "./src/style/hero.css";
import "./src/style/responsive.css";
import "./src/style/sections.css";

// Import gambar
import logo from "./src/assets/images/logo.png";
import aboutImageSrc from "./src/assets/images/gambar/mobil4.jpeg";
import galleryImg1 from "./src/assets/images/gambar/es3.jpeg";
import galleryImg2 from "./src/assets/images/gambar/gudang3.jpeg";
import galleryImg3 from "./src/assets/images/gambar/kotak.jpeg";
import galleryImg4 from "./src/assets/images/gambar/mesin.jpeg";
import galleryImg5 from "./src/assets/images/gambar/es1.jpeg";
import galleryImg6 from "./src/assets/images/gambar/mobil.jpeg";
import galleryImg7 from "./src/assets/images/gambar/mobil3.jpeg";
import galleryImg8 from "./src/assets/images/gambar/es.jpeg";

// Import semua fungsi JavaScript
import { smoothScrolling } from "./src/js/smoothScroll.js"; // Pastikan baris ini ada
import { headerEffect } from "./src/js/headerEffect.js";
import { scrollAnimation } from "./src/js/scrollAnimation.js";
import { hamburgerMenu } from "./src/js/hamburger.js";
import { handleOrderForm } from "./src/js/orderForm.js";
import { initializeMap } from "./src/js/map.js";

function populateGallery() {
  // Definisikan sumber gambar dalam urutan yang benar (termasuk duplikasinya)
  const imageSources = [
    galleryImg1,
    galleryImg2,
    galleryImg3,
    galleryImg4,
    galleryImg5,
    galleryImg6,
    galleryImg7,
    galleryImg8,
  ];

  const galleryImages = document.querySelectorAll(".gallery-item img");

  // Loop melalui setiap tag <img> dan berikan src dari array di atas
  galleryImages.forEach((img, index) => {
    if (imageSources[index]) {
      img.src = imageSources[index];
    }
  });
}
// Jalankan semua fungsi setelah DOM siap
document.addEventListener("DOMContentLoaded", () => {
  const logoImage = document.querySelector(".logo-image");
  if (logoImage) {
    logoImage.src = logo;
  }

  const aboutImage = document.getElementById("about-us-image");
  if (aboutImage) {
    aboutImage.src = aboutImageSrc;
  }

  // Panggil semua fungsi
  smoothScrolling(); // Panggil fungsi yang baru dibuat
  headerEffect();
  scrollAnimation();
  hamburgerMenu();
  handleOrderForm();

  populateGallery();
  initializeMap();
});
