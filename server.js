// ----------------------------------------------------------------
// BAGIAN 1: IMPORT SEMUA PAKET YANG DIBUTUHKAN
// ----------------------------------------------------------------
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const cors = require("cors");
const session = require("express-session");

// ----------------------------------------------------------------
// BAGIAN 2: INISIALISASI DATABASE SQLITE
// ----------------------------------------------------------------
const dbFile = "./raysa_eskristal.db";
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    return console.error("Error saat membuka database:", err.message);
  }

  console.log("Berhasil terhubung ke database SQLite.");

  // Menggunakan db.serialize untuk memastikan perintah dijalankan secara berurutan
  db.serialize(() => {
    // Membuat tabel 'admins' jika belum ada
    db.run(
      `CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`,
      (err) => {
        if (err)
          return console.error(
            "Error saat membuat tabel 'admins':",
            err.message
          );

        // Cek dan buat admin default jika belum ada
        db.get("SELECT COUNT(*) as count FROM admins", [], async (err, row) => {
          if (err)
            return console.error("Error saat memeriksa admin:", err.message);

          if (row.count === 0) {
            try {
              const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash("admin123", salt);
              db.run(
                `INSERT INTO admins (username, password) VALUES (?, ?)`,
                ["admin", hashedPassword],
                (err) => {
                  if (err)
                    return console.error(
                      "Error saat membuat admin default:",
                      err.message
                    );
                  console.log(
                    "Admin default berhasil dibuat. Username: 'admin', Password: 'admin123'"
                  );
                }
              );
            } catch (hashError) {
              console.error("Error saat hashing password:", hashError);
            }
          }
        });
      }
    );

    // Membuat tabel 'products' jika belum ada
    db.run(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL
    )`,
      (err) => {
        if (err)
          return console.error(
            "Error saat membuat tabel 'products':",
            err.message
          );
      }
    );
  });
});

// ----------------------------------------------------------------
// BAGIAN 3: KONFIGURASI SERVER EXPRESS
// ----------------------------------------------------------------
const app = express();
const port = 9001;

app.use(
  cors({
    origin: "http://localhost:9001",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: "kunci-rahasia-yang-lebih-baik-dan-panjang",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Untuk development (HTTP). Ganti jadi 'true' di production (HTTPS)
      maxAge: 1000 * 60 * 60 * 24, // Sesi berlaku 1 hari
    },
  })
);

// ----------------------------------------------------------------
// BAGIAN 4: MIDDLEWARE & RUTE API
// ----------------------------------------------------------------
const checkAuth = (req, res, next) => {
  if (!req.session.adminId) {
    return res.status(401).json({ message: "Akses ditolak. Silakan login." });
  }
  next();
};

// --- Rute Publik ---
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM admins WHERE username = ?";
  db.get(sql, [username], async (err, admin) => {
    if (err) return res.status(500).json({ message: "Error server." });
    if (!admin)
      return res.status(404).json({ message: "Username tidak ditemukan." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah." });

    req.session.adminId = admin.id;
    req.session.username = admin.username;
    res.status(200).json({ message: "Login berhasil!" });
  });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Gagal logout." });
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logout berhasil." });
  });
});

// --- Rute Terlindungi ---
app.get("/api/admin/profile", checkAuth, (req, res) => {
  res
    .status(200)
    .json({ id: req.session.adminId, username: req.session.username });
});

// --- API CRUD Produk ---
app.get("/api/admin/products", checkAuth, (req, res) => {
  db.all("SELECT * FROM products ORDER BY id DESC", [], (err, rows) => {
    if (err)
      return res.status(500).json({ message: "Gagal mengambil data produk." });
    res.json(rows);
  });
});

app.post("/api/admin/products", checkAuth, (req, res) => {
  const { name, description, price } = req.body;
  db.run(
    `INSERT INTO products (name, description, price) VALUES (?, ?, ?)`,
    [name, description, price],
    function (err) {
      if (err)
        return res.status(500).json({ message: "Gagal menyimpan produk." });
      res.status(201).json({ id: this.lastID, name, description, price });
    }
  );
});

app.put("/api/admin/products/:id", checkAuth, (req, res) => {
  const { name, description, price } = req.body;
  db.run(
    `UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?`,
    [name, description, price, req.params.id],
    function (err) {
      if (err)
        return res.status(500).json({ message: "Gagal memperbarui produk." });
      res.json({ message: "Produk berhasil diperbarui." });
    }
  );
});

app.delete("/api/admin/products/:id", checkAuth, (req, res) => {
  db.run(`DELETE FROM products WHERE id = ?`, req.params.id, function (err) {
    if (err)
      return res.status(500).json({ message: "Gagal menghapus produk." });
    res.json({ message: "Produk berhasil dihapus." });
  });
});

// ----------------------------------------------------------------
// BAGIAN 5: MENJALANKAN SERVER
// ----------------------------------------------------------------
app.listen(port, () => {
  console.log(`Server backend berjalan di http://localhost:${port}`);
});
