export function formValidation() {
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      if (name.trim() === "" || email.trim() === "" || message.trim() === "") {
        alert("Harap isi semua kolom yang wajib diisi.");
      } else {
        alert("Terima kasih! Pesan Anda telah dikirim.");
        contactForm.reset();
      }
    });
  }
}
