// api/index.js

const express = require("express");
const { Pool } = require("pg"); // Ganti sqlite3 dengan driver postgres
const bcrypt = require("bcryptjs");
const cors = require("cors");
const session = require("express-session");

const app = express();

// Inisialisasi koneksi ke Vercel Postgres
// URL koneksi akan kita masukkan lewat Environment Variable di Vercel
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "https://your-project-name.vercel.app", // Ganti dengan URL Vercel Anda nanti
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "ini-adalah-secret-yang-sangat-aman-dan-panjang",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Wajib true untuk HTTPS di Vercel
      sameSite: "lax",
    },
  })
);

// ENDPOINT AUTENTIKASI (sudah disesuaikan)
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
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
      res.json({ success: true });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Username atau password salah" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/profile", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json({ username: req.session.user.username });
});

// ENDPOINT PRODUK (sudah disesuaikan)
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nama_produk, harga, deskripsi FROM products"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ message: "Gagal menambah produk" });
  }
});

// Export app untuk Vercel agar bisa menjalankannya
module.exports = app;
