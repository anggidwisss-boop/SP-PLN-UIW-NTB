# SP PLN UIW NTB

Aplikasi Android Pusat Informasi & Layanan Serikat Pekerja PLN UIW NTB.

## Arsitektur V1
- Android app
- Google Apps Script sebagai API
- Google Sheets sebagai database konten dan anggota
- GitHub sebagai source control

## Fitur V1
- Login anggota
- Dashboard
- Berita
- Pengumuman
- Agenda
- Dokumen/PKB
- Advokasi & pengaduan
- Struktur pengurus
- Profil anggota
- Notifikasi (tahap berikutnya)

## Struktur Repository
```text
android/       # source Android
apps-script/   # Google Apps Script API
admin/         # rancangan/panel admin
sheets/        # struktur spreadsheet dan panduan
assets/        # logo, icon, aset visual
.github/       # CI/CD GitHub Actions
```

> Jangan menyimpan NIP, nomor HP, password, token API, atau data pribadi anggota ke repository GitHub.
