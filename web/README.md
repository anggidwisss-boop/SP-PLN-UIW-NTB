# SP PLN UIW NTB — Web

Web app statis untuk SP PLN UIW NTB. Tampilan dibuat selaras dengan aplikasi Android dan menggunakan Apps Script sebagai API.

## Menjalankan

Buka `index.html` melalui hosting statis/localhost.

Pada menu **Konfigurasi Server**, isi:
- URL Web App Google Apps Script
- API Key Apps Script

Nilai disimpan hanya pada browser perangkat tersebut (`localStorage`) dan tidak dimasukkan ke repository.

## Backend

API yang digunakan: `config`, `anggota`, `berita`, `pengumuman`, `agenda`, `dokumen`, dan POST `pengaduan`.

Jangan menyimpan password anggota, API key, atau data pribadi nyata di repository publik.
