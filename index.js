import express from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const uploadDir = path.join(__dirname, "tmp");

await fs.mkdir(uploadDir, { recursive: true });

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = new Set([
      "audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav",
      "audio/ogg", "audio/flac", "audio/aac", "audio/mp4",
      "audio/webm", "application/octet-stream"
    ]);

    if (
      allowed.has(file.mimetype) ||
      /\.(mp3|wav|ogg|flac|aac|m4a|webm)$/i.test(file.originalname)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Format file belum didukung."));
    }
  }
});

// File website berada langsung di folder utama repository.
app.use(express.static(__dirname));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, name: "Slamet DJ Converter" });
});

app.post("/api/upload", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "Pilih file audio terlebih dahulu."
    });
  }

  res.json({
    id: randomUUID(),
    originalName: path.basename(req.file.originalname),
    size: req.file.size,
    mimeType: req.file.mimetype,
    message: "File diterima. Fitur konversi server dan upload Roblox belum diaktifkan."
  });
});

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      error: "Ukuran file melebihi batas 200 MB."
    });
  }

  res.status(400).json({
    error: err.message || "Terjadi kesalahan."
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Slamet DJ Converter berjalan di port ${PORT}`);
});
