// api/index.js
const express = require("express");
const { Pool } = require("pg"); // Menggunakan driver node-postgres
const bcrypt = require("bcryptjs");
const cors = require("cors");
const session = require("express-session");

const app = express();

// Inisialisasi koneksi ke Vercel Postgres menggunakan Environment Variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Diperlukan untuk koneksi ke Vercel Postgres
  },
});

// Middleware
app.use(
  cors({
    origin: "https://tugas-rpl-z4wf.vercel.app", // URL Vercel Anda
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Ambil dari Environment Variable
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // Wajib true untuk HTTPS (Vercel)
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// ENDPOINT LOGIN
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username dan password wajib diisi." });
  }

  try {
    const result = await pool.query("SELECT * FROM admin WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Username atau password salah" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      req.session.user = { id: user.id, username: user.username };
      return res.json({ success: true });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Username atau password salah" });
    }
  } catch (err) {
    console.error("Error saat login:", err); // Ini akan muncul di log Vercel
    return res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan pada server" });
  }
});

// ENDPOINT PROFILE
app.get("/api/profile", (req, res) => {
  if (req.session.user) {
    res.json({ username: req.session.user.username });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// ENDPOINT LOGOUT
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Gagal logout");
    }
    res.clearCookie("connect.sid"); // Nama cookie default dari express-session
    res.status(200).json({ message: "Logout berhasil" });
  });
});

// ENDPOINT PRODUK
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nama_produk, harga, deskripsi FROM products"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Gagal mengambil produk:", err);
    res.status(500).json({ message: "Gagal mengambil produk" });
  }
});

app.post("/api/products", async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized" });
  const { nama_produk, harga, deskripsi } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO products (nama_produk, harga, deskripsi) VALUES ($1, $2, $3) RETURNING id",
      [nama_produk, harga, deskripsi]
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error("Gagal menambah produk:", err);
    res.status(500).json({ message: "Gagal menambah produk" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized" });
  const { id } = req.params;
  const { nama_produk, harga, deskripsi } = req.body;
  try {
    await pool.query(
      "UPDATE products SET nama_produk = $1, harga = $2, deskripsi = $3 WHERE id = $4",
      [nama_produk, harga, deskripsi, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Gagal update produk:", err);
    res.status(500).json({ message: "Gagal update produk" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized" });
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Gagal menghapus produk:", err);
    res.status(500).json({ message: "Gagal menghapus produk" });
  }
});

// Export app untuk Vercel
module.exports = app;
