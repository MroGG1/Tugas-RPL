export function initializeMap() {
  // Pastikan kode hanya berjalan jika elemen #map-footer ada di halaman
  const mapContainer = document.getElementById("map-footer");
  if (!mapContainer) {
    return;
  }

  // GANTI DENGAN KOORDINAT LOKASI TOKO ANDA
  const storeLocation = [-6.2088, 106.8456]; // Contoh: Koordinat Jakarta

  // Inisialisasi peta dengan menonaktifkan scroll wheel zoom
  const map = L.map("map-footer", {
    scrollWheelZoom: false, // <-- BARIS INI YANG DIUBAH
  }).setView(storeLocation, 16); // Zoom level 16

  // Tambahkan 'tile layer' (visual peta) dari OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Tambahkan penanda (marker) di lokasi toko
  L.marker(storeLocation)
    .addTo(map)
    .bindPopup("<b>Raysa Es Kristal</b><br>Jl. Contoh Alamat No. 123")
    .openPopup();
}
