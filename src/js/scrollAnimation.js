export function scrollAnimation() {
  const observerOptions = {
    threshold: 0.1, // Elemen dianggap terlihat jika 10% areanya masuk viewport
    rootMargin: "0px 0px -50px 0px", // Memicu sedikit lebih awal sebelum elemen benar-benar di dasar layar
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      // Jika elemen masuk ke dalam viewport
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");

        // Optimasi: Hentikan observasi pada elemen ini setelah animasi dijalankan
        // agar tidak membebani browser.
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Cari semua elemen yang ingin kita beri animasi.
  // Kita akan gunakan atribut 'data-aos' (Animate On Scroll) agar lebih fleksibel.
  const elementsToAnimate = document.querySelectorAll("[data-aos]");
  elementsToAnimate.forEach((el) => {
    observer.observe(el);
  });
}
