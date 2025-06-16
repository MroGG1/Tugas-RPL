export function headerEffect() {
  // Cari elemen header satu kali saja saat halaman dimuat
  const header = document.querySelector(".header");

  // JIKA elemen .header TIDAK DITEMUKAN di halaman ini,
  // maka hentikan eksekusi fungsi ini.
  if (!header) {
    return;
  }

  // Jika elemen .header DITEMUKAN, baru jalankan event listener-nya
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.95)";
      header.style.backdropFilter = "blur(10px)";
    } else {
      header.style.background = "white";
      header.style.backdropFilter = "none";
    }
  });
}
