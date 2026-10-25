# Slamet DJ Converter — Slamet Project

Starter website untuk dikembangkan menjadi audio converter NekoDJ/Roblox.

## Yang sudah ada
- Responsive dark/purple UI
- Pemilihan file audio dan drag & drop
- Preview audio di browser
- Kontrol preview playback speed dan perkiraan pitch (mengubah playback rate)
- Download audio asli
- Backend Node.js/Express untuk menerima file sementara (maksimum 200 MB)
- Bagian informasi integrasi Roblox Open Cloud

## Yang belum diimplementasikan
Ini adalah starter/prototipe, belum setara dengan semua fungsi website referensi:
- Konversi audio server-side/FFmpeg
- Pitch shifting yang mempertahankan durasi
- Rumus NekoDJ `effectSpeed` yang terverifikasi
- Upload ke Roblox Open Cloud
- Riwayat persisten, autentikasi, pembatasan penyalahgunaan, dan penyimpanan permanen

Tombol "Proses file" saat ini menguji endpoint upload; tombol download mengunduh audio asli. Jangan mengklaim sebagai konversi final sampai backend pemrosesan ditambahkan.

## Jalankan lokal
Memerlukan Node.js 20+.

```bash
npm install
npm start
```

Buka `http://localhost:3000`.

## Deploy ke Koyeb
1. Upload folder proyek ini ke repository GitHub milikmu.
2. Di Koyeb, buat Web Service dari repository tersebut.
3. Build command: `npm install`
4. Run command: `npm start`
5. Port aplikasi menggunakan `process.env.PORT`.
6. Untuk pemrosesan audio sebenarnya, tambahkan FFmpeg dan backend conversion; cek storage dan batas memori/ukuran pada instance yang dipilih.

## Keamanan Roblox
Jangan pernah meletakkan Roblox API key di frontend atau commit ke GitHub. Simpan sebagai environment variable di hosting dan beri izin minimum yang dibutuhkan. Periksa dokumentasi resmi Roblox Open Cloud sebelum mengaktifkan upload.
