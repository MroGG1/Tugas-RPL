// ----------------------------------------------------------------
// BAGIAN 1: IMPORT SEMUA PAKET YANG DIBUTUHKAN
// ----------------------------------------------------------------
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

// ----------------------------------------------------------------
// BAGIAN 2: INISIALISASI APP DAN MIDDLEWARE
// ----------------------------------------------------------------
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:9000",
    credentials: true,
  })
);
app.use(
  session({
    secret: "rahasia", // ganti dengan secret Anda
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: "lax",
    },
  })
);

// ----------------------------------------------------------------
// BAGIAN 3: INISIALISASI DATABASE
// ----------------------------------------------------------------
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Gagal koneksi ke database:", err.message);
  } else {
    console.log("Terhubung ke database SQLite.");
  }
});

// Buat tabel produk jika belum ada
db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_produk TEXT NOT NULL,
    harga INTEGER NOT NULL,
    deskripsi TEXT
  )
`);

// Buat tabel admin jika belum ada
db.run(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`);

// Tambahkan kode ini di bawah inisialisasi database di server.js, lalu jalankan server sekali
const username = "admin";
const password = "admin123";
bcrypt.hash(password, 10, (err, hash) => {
  if (err) return console.error(err);
  db.run(
    "INSERT OR IGNORE INTO admin (username, password) VALUES (?, ?)",
    [username, hash],
    function (err) {
      if (err) return console.error(err);
      console.log("Admin default berhasil ditambahkan!");
    }
  );
});

// ----------------------------------------------------------------
// BAGIAN 4: ENDPOINT AUTENTIKASI ADMIN
// ----------------------------------------------------------------
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM admin WHERE username = ?", [username], (err, user) => {
    if (err)
      return res.status(500).json({ success: false, message: "Server error" });
    if (!user)
      return res.status(401).json({ success: false, message: "Username salah" });

    // Jika password sudah di-hash, gunakan bcrypt.compare
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        req.session.user = { id: user.id, username: user.username };
        res.json({ success: true });
      } else {
        res.status(401).json({ success: false, message: "Password salah" });
      }
    });
  });
});

app.get("/api/profile", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json({ username: req.session.user.username });
});

// ----------------------------------------------------------------
// BAGIAN 5: ENDPOINT PRODUK
// ----------------------------------------------------------------

// Tambah produk (hanya admin)
app.post("/api/products", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { nama_produk, harga, deskripsi } = req.body;
  db.run(
    "INSERT INTO products (nama_produk, harga, deskripsi) VALUES (?, ?, ?)",
    [nama_produk, harga, deskripsi],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Gagal menambah produk" });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Ambil semua produk (untuk halaman utama)
app.get("/api/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Gagal mengambil produk" });
    }
    res.json(rows);
  });
});

// ----------------------------------------------------------------
// BAGIAN 6: JALANKAN SERVER
// ----------------------------------------------------------------
const PORT = 9001;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
