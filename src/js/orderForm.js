// src/js/orderForm.js

export function handleOrderForm() {
  const orderForm = document.getElementById("order-form");
  if (!orderForm) return;

  // --- LOGIKA BARU UNTUK GEOLOCATION ---
  const getLocationBtn = document.getElementById("get-location-btn");
  const locationFeedback = document.getElementById("location-feedback");
  let userCoordinates = null; // Variabel untuk menyimpan koordinat

  if (getLocationBtn) {
    getLocationBtn.addEventListener("click", () => {
      if ("geolocation" in navigator) {
        locationFeedback.textContent = "Sedang mengambil lokasi...";
        getLocationBtn.disabled = true; // Nonaktifkan tombol saat proses berjalan

        navigator.geolocation.getCurrentPosition(
          // --- Success Callback ---
          (position) => {
            userCoordinates = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            locationFeedback.textContent = "✅ Lokasi berhasil didapat!";
            locationFeedback.style.color = "green";
          },
          // --- Error Callback ---
          (error) => {
            locationFeedback.textContent =
              "Gagal mengambil lokasi. Pastikan Anda mengizinkan akses lokasi.";
            locationFeedback.style.color = "red";
            getLocationBtn.disabled = false; // Aktifkan kembali tombol jika gagal
          }
        );
      } else {
        locationFeedback.textContent =
          "Browser Anda tidak mendukung Geolocation.";
        locationFeedback.style.color = "red";
      }
    });
  }
  // --- AKHIR LOGIKA GEOLOCATION ---

  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!userCoordinates) {
      alert(
        "Anda wajib membagikan lokasi spesifik Anda. Silakan klik tombol 'Ambil Lokasi Saat Ini'."
      );
      locationFeedback.style.color = "red";
      locationFeedback.textContent = "Lokasi wajib diisi!";
      return; // Menghentikan pengiriman formulir jika lokasi kosong
    }

    const adminPhone = "6282124136134"; // GANTI DENGAN NOMOR ASLI ANDA

    // ... (kode untuk mengambil data form lainnya)
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const kecamatan = document.getElementById("kecamatan").value;
    const address = document.getElementById("address").value;
    const quantity = document.getElementById("quantity").value;
    const notes = document.getElementById("notes").value;
    const paymentMethod = document.querySelector(
      'input[name="payment-method"]:checked'
    ).value;

    // ... (kode validasi yang sudah ada)

    // --- BUAT PESAN WHATSAPP ---
    let message = `Halo Admin Raysa Es Kristal, saya mau pesan:
- Nama: ${name}
- Alamat: ${address}, Kecamatan ${kecamatan}
- Jumlah: ${quantity} karung/kg
- No. HP: ${phone}`;

    message += `
- Metode Pembayaran: ${paymentMethod}`;
    if (notes.trim() !== "") {
      message += `, "Catatan: ${notes}"`;
    }
    // --- TAMBAHKAN LOKASI JIKA ADA ---
    if (userCoordinates) {
      const gmapsLink = `https://maps.google.com/?q=${userCoordinates.latitude},${userCoordinates.longitude}`;
      message += `
- Link Lokasi: ${gmapsLink}`;
    }

    message += `

Mohon konfirmasi ketersediaan dan total biayanya. Terima kasih.`;
    // --- AKHIR PEMBUATAN PESAN ---

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${adminPhone}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
    orderForm.reset();
    locationFeedback.textContent = ""; // Kosongkan feedback setelah submit
    getLocationBtn.disabled = false;
    userCoordinates = null;
  });
}
