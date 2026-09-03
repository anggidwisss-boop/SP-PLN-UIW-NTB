# API V1

Base URL adalah URL Web App hasil deployment Google Apps Script.

## GET

Semua request membutuhkan `key` yang cocok dengan `API_KEY` di `Code.gs`.

Contoh:

`GET /exec?action=berita&key=YOUR_KEY`

Action yang tersedia:

- `config`
- `anggota`
- `berita`
- `pengumuman`
- `agenda`
- `pengurus`
- `dokumen`

## POST pengaduan

Endpoint yang sama dengan method POST.

Body JSON:

```json
{
  "action": "pengaduan",
  "id_anggota": "A001",
  "kategori": "Ketenagakerjaan",
  "judul": "Judul pengaduan",
  "isi": "Isi pengaduan",
  "lampiran": ""
}
```

Jangan memasukkan API key ke repository publik. Untuk tahap produksi, gunakan mekanisme autentikasi yang lebih kuat daripada shared API key sederhana.
