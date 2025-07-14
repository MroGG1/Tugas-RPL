const express = require("express");
const { Pool } = require("pg");
const bcrypt = "bcryptjs";
const cors = require("cors");
const session = require("express-session");

const app = express();

// Konfigurasi koneksi ke Supabase (Postgres)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(
  cors({
    origin: "https://tugas-rpl-z4wf.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // Sesi berlaku 1 hari
    },
  })
);

// === API ENDPOINTS ===

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username dan password wajib diisi." });
  }

  try {
    const { rows } = await pool.query(
      "SELECT * FROM admin WHERE username = $1",
      [username]
    );
    const user = rows[0];

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Username atau password salah." });
    }

    // Ganti bcrypt.compare menjadi perbandingan langsung sesuai permintaan sebelumnya
    if (password === user.password_plain) {
      // Asumsikan ada kolom password_plain
      req.session.user = { id: user.id, username: user.username };
      return res.json({ success: true });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Username atau password salah." });
    }
  } catch (err) {
    console.error("SERVER ERROR DI /api/login:", err);
    return res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan pada server." });
  }
});

// Cek Sesi
app.get("/api/profile", (req, res) => {
  if (req.session.user) {
    res.json({ username: req.session.user.username });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Logout
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Gagal logout." });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout berhasil." });
  });
});

// Produk
app.get("/api/products", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error("SERVER ERROR DI /api/products:", err);
    res.status(500).json({ message: "Gagal mengambil data produk." });
  }
});

// ... (Endpoint untuk Create, Update, Delete produk bisa ditambahkan di sini jika perlu) ...

// Export app untuk Vercel
module.exports = app;
