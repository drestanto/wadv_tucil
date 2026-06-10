// index.js
// Tugas Kecil 1 — Student API
// Web Advanced Development
//
// Instruksi:
//   1. Baca setiap komentar TODO dengan seksama.
//   2. Ganti baris "// TODO: ..." dengan kode yang benar.
//   3. Jangan ubah nama variabel, nama endpoint, atau struktur yang sudah ada.
//   4. Test setiap endpoint di Postman sebelum submit.
//
// Run: node index.js  →  http://localhost:3000

// Sebelum itu, tuliskan nama, NIM, di bawah ini, dan apabila sudah selesai, isi refleksi di bawah ini (dalam bentuk comment)
// Nama: Ade Imah
// NIM: 24110400016
// Refleksi:
// Dalam mengerjakan tugas ini, saya belajar tentang pembuatan RESTful API menggunakan Express.js. 
// Saya memahami bagaimana cara membuat endpoint GET, POST, PUT, dan DELETE untuk mengelola data mahasiswa.
// Tantangan yang saya hadapi adalah memahami urutan route untuk endpoint search agar tidak tertangkap oleh route params.
// Saya juga belajar tentang validasi input, penggunaan status code HTTP yang tepat (200, 201, 400, 404, 204),
// serta bagaimana mengupdate dan menghapus data dalam array.
// Tugas ini sangat membantu saya dalam memahami konsep backend development dan REST API.

const express = require("express");
const app = express();
const PORT = 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(express.json());

// ── In-memory "database" ─────────────────────────────────────
// Data awal — jangan diubah, dipakai untuk pengujian
let students = [
  { id: 1, name: "Andi Saputra",    nim: "231001", major: "Informatika",          gpa: 3.75 },
  { id: 2, name: "Bella Kurnia",    nim: "231002", major: "Sistem Informasi",      gpa: 3.50 },
  { id: 3, name: "Candra Wijaya",   nim: "231003", major: "Informatika",          gpa: 3.20 },
];

// nextId dipakai untuk generate id otomatis saat POST
let nextId = 4;

// ════════════════════════════════════════════════════════════
//  BONUS — GET /students/search?major=...
//  Filter mahasiswa berdasarkan query param major
//  Contoh: GET /students/search?major=Informatika
//  Jika tidak ada yang cocok → kembalikan array kosong []
//
//  ⚠️  Endpoint ini HARUS didefinisikan SEBELUM /students/:id
//      karena Express membaca route dari atas ke bawah —
//      "search" akan ditangkap sebagai :id kalau urutannya salah!
//
//  Petunjuk: gunakan req.query.major dan .filter()
// ════════════════════════════════════════════════════════════
app.get("/students/search", (req, res) => {
  const major = req.query.major;
  
  if (!major) {
    return res.status(400).json({ error: "Parameter major wajib diisi" });
  }
  
  const filteredStudents = students.filter(student => 
    student.major.toLowerCase() === major.toLowerCase()
  );
  
  res.status(200).json(filteredStudents);
});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 1 — GET /students
//  Kembalikan semua data mahasiswa dalam bentuk array JSON
// ════════════════════════════════════════════════════════════
app.get("/students", (req, res) => {
  // TODO: kirim response berisi seluruh array students dengan status 200
  res.status(200).json(students);
});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 2 — GET /students/:id
//  Kembalikan satu mahasiswa berdasarkan id
//  Jika tidak ditemukan → status 404 + { error: "Student tidak ditemukan" }
// ════════════════════════════════════════════════════════════
app.get("/students/:id", (req, res) => {
  // TODO: konversi req.params.id ke integer (gunakan parseInt)
  const id = parseInt(req.params.id);
  
  // TODO: cari mahasiswa di array students yang id-nya cocok
  //       gunakan .find()
  const student = students.find(s => s.id === id);
  
  // TODO: jika tidak ditemukan, kirim 404 + pesan error
  if (!student) {
    return res.status(404).json({ error: "Student tidak ditemukan" });
  }
  
  // TODO: jika ditemukan, kirim data mahasiswanya
  res.status(200).json(student);
});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 3 — POST /students
//  Tambahkan mahasiswa baru dari request body
//  Body yang dikirim: { name, nim, major, gpa }
//  Validasi: name, nim, major wajib ada — kalau tidak → 400
//  Sukses → status 201 + data mahasiswa baru
// ════════════════════════════════════════════════════════════
app.post("/students", (req, res) => {
  const { name, nim, major, gpa } = req.body;
  
  // TODO: validasi — cek apakah name, nim, dan major ada dan tidak kosong
  //       jika tidak valid → kirim status 400 + { error: "name, nim, dan major wajib diisi" }
  if (!name || name.trim() === "" || !nim || nim.trim() === "" || !major || major.trim() === "") {
    return res.status(400).json({ error: "name, nim, dan major wajib diisi" });
  }
  
  // TODO: buat object mahasiswa baru dengan struktur:
  //       { id: nextId, name, nim, major, gpa: gpa ?? 0 }
  //       lalu tambah nextId sebesar 1 (nextId++)
  const newStudent = {
    id: nextId++,
    name: name,
    nim: nim,
    major: major,
    gpa: gpa !== undefined ? gpa : 0
  };
  
  // TODO: masukkan mahasiswa baru ke array students (gunakan .push())
  students.push(newStudent);
  
  // TODO: kirim response status 201 + data mahasiswa baru
  res.status(201).json(newStudent);
});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 4 — PUT /students/:id
//  Update data mahasiswa berdasarkan id
//  Field yang bisa diupdate: name, nim, major, gpa (semua opsional)
//  Minimal satu field harus dikirim → kalau tidak ada → 400
//  Jika id tidak ditemukan → 404
// ════════════════════════════════════════════════════════════
app.put("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, nim, major, gpa } = req.body;
  
  // TODO: cek apakah semua field undefined — jika iya, kirim 400
  if (name === undefined && nim === undefined && major === undefined && gpa === undefined) {
    return res.status(400).json({ error: "Minimal satu field (name, nim, major, atau gpa) harus dikirim untuk update" });
  }
  
  // TODO: cari index mahasiswa di array dengan .findIndex()
  //       simpan hasilnya ke variabel "index"
  const index = students.findIndex(s => s.id === id);
  
  // TODO: jika index === -1 (tidak ditemukan), kirim 404
  if (index === -1) {
    return res.status(404).json({ error: "Student tidak ditemukan" });
  }
  
  // TODO: update hanya field yang dikirim (jangan timpa yang tidak dikirim)
  //       Petunjuk: pakai if (name !== undefined) students[index].name = name
  //       lakukan hal yang sama untuk nim, major, dan gpa
  if (name !== undefined) students[index].name = name;
  if (nim !== undefined) students[index].nim = nim;
  if (major !== undefined) students[index].major = major;
  if (gpa !== undefined) students[index].gpa = gpa;
  
  // TODO: kirim response status 200 + data mahasiswa yang sudah diupdate
  res.status(200).json(students[index]);
});

// ════════════════════════════════════════════════════════════
//  ENDPOINT 5 — DELETE /students/:id
//  Hapus mahasiswa berdasarkan id
//  Jika tidak ditemukan → 404
//  Sukses → status 204 (no content)
// ════════════════════════════════════════════════════════════
app.delete("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  
  // TODO: cari index mahasiswa dengan .findIndex()
  const index = students.findIndex(s => s.id === id);
  
  // TODO: jika tidak ditemukan (index === -1), kirim 404
  if (index === -1) {
    return res.status(404).json({ error: "Student tidak ditemukan" });
  }
  
  // TODO: hapus mahasiswa dari array menggunakan .splice(index, 1)
  students.splice(index, 1);
  
  // TODO: kirim response status 204 tanpa body (gunakan .send())
  res.status(204).send();
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  GET    /students`);
  console.log(`  GET    /students/search?major=... (bonus)`);
  console.log(`  GET    /students/:id`);
  console.log(`  POST   /students`);
  console.log(`  PUT    /students/:id`);
  console.log(`  DELETE /students/:id`);
});