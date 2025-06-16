export function handleOrderForm() {
  const orderForm = document.getElementById("order-form");
  if (!orderForm) return;

  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Nomor WhatsApp Admin (ganti dengan nomor yang benar)
    const adminPhone = "6281234567890"; // Ganti dengan nomor WA Admin

    // Ambil nilai dari form
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const quantity = document.getElementById("quantity").value;

    // Validasi sederhana (bisa dikembangkan)
    if (name.trim() === "" || phone.trim() === "" || address.trim() === "") {
      alert("Harap lengkapi semua field.");
      return;
    }

    // Buat pesan untuk WhatsApp
    const message = `Halo Admin Raysa Es Kristal, saya mau pesan:
- Nama: ${name}
- Alamat: ${address}
- Jumlah: ${quantity} karung/kg
- No. HP: ${phone}

Mohon konfirmasi ketersediaan dan total biayanya. Terima kasih.`;

    // Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(message);

    // Buat URL WhatsApp
    const whatsappURL = `https://wa.me/<span class="math-inline">\{adminPhone\}?text\=</span>{encodedMessage}`;

    // Buka URL di tab baru
    window.open(whatsappURL, "_blank");

    // Reset form setelah submit
    orderForm.reset();
  });
}
