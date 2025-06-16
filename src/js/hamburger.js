// src/js/hamburger.js
export function hamburgerMenu() {
  const hamburger = document.querySelector(".hamburger-menu");
  const mobileNav = document.querySelector(".mobile-nav");
  const navOverlay = document.querySelector(".nav-overlay");
  const navLinks = document.querySelectorAll(".mobile-nav a");
  const body = document.body;

  if (hamburger && mobileNav && navOverlay) {
    const toggleMenu = () => {
      // Toggle class active pada semua elemen terkait
      hamburger.classList.toggle("active");
      mobileNav.classList.toggle("active");
      navOverlay.classList.toggle("active");
      body.classList.toggle("body-no-scroll");
    };

    // Event listener untuk tombol hamburger
    hamburger.addEventListener("click", toggleMenu);

    // Event listener untuk overlay (menutup menu saat area gelap diklik)
    navOverlay.addEventListener("click", toggleMenu);

    // Event listener untuk setiap link di menu mobile
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        // Hanya tutup jika menu sedang aktif
        if (mobileNav.classList.contains("active")) {
          toggleMenu();
        }
      });
    });
  }
}
